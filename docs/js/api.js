import { supabase, getUser, isAdmin } from './auth.js';

// =============================
// CONFIGURATION
// =============================
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

// =============================
// API KEY MANAGEMENT (Supabase app_settings)
// =============================
let cachedApiKey = '';

export async function loadApiKey() {
  const { data } = await supabase
    .from('app_settings')
    .select('value')
    .eq('key', 'gemini_api_key')
    .maybeSingle();
  cachedApiKey = data?.value || '';
}

export function getApiKey() {
  return cachedApiKey;
}

export async function setApiKey(key) {
  if (key) {
    const { error } = await supabase.from('app_settings').upsert(
      { key: 'gemini_api_key', value: key.trim(), updated_by: getUser().id, updated_at: new Date().toISOString() },
      { onConflict: 'key' }
    );
    if (error) throw error;
    cachedApiKey = key.trim();
  } else {
    await supabase.from('app_settings').delete().eq('key', 'gemini_api_key');
    cachedApiKey = '';
  }
}

export function hasApiKey() {
  return cachedApiKey.length > 0;
}

// =============================
// GEMINI DIRECT API CALL
// =============================
function buildPrompt({ targetAge, gender, focusAreas, durationMinutes, equipment }) {
  const equipmentLine = equipment && equipment.length > 0
    ? `- Available equipment: ${equipment.join(', ')}`
    : '- Available equipment: none (bodyweight only)';

  const genderMap = { male: 'men', female: 'women', mixed: 'mixed group (men and women)' };
  const genderLine = gender ? `- Target audience: ${genderMap[gender] || gender}` : '';

  const focusLine = Array.isArray(focusAreas)
    ? `- Focus areas: ${focusAreas.join(', ')}`
    : `- Focus area: ${focusAreas}`;

  return `You are a certified Pilates and Physical Education instructor.
Generate a structured lesson plan in valid JSON.

Parameters:
- Target age group: ${targetAge}
${genderLine}
${focusLine}
- Total duration: ${durationMinutes} minutes
${equipmentLine}

Return ONLY valid JSON matching this exact schema (no markdown, no extra text):
{
  "title": "string (in Hebrew)",
  "exercises": [
    {
      "name": "string (in Hebrew)",
      "description": "string (in Hebrew)",
      "durationSeconds": number,
      "category": "Warm-Up | Core | Strength | Flexibility | Cool-Down",
      "coachCues": "string (in Hebrew)",
      "equipment": "string (in Hebrew, which equipment is used, or empty string if none)"
    }
  ],
  "musicRecommendations": [
    {
      "title": "string (song name)",
      "artist": "string (artist name)",
      "tempo": "slow | medium | fast"
    }
  ]
}

Rules:
- IMPORTANT: All text fields (title, name, description, coachCues, equipment) MUST be in Hebrew
- Include 4-8 exercises appropriate for ${targetAge}
- Total exercise time should fill approximately ${durationMinutes} minutes
- coachCues should be concise verbal instructions an instructor would say
- Categories must come from the enum above (keep category values in English)
- Use ONLY the specified equipment; adapt exercises to available tools
- Incorporate all focus areas into the workout distribution
- Each exercise must clearly describe proper form and positioning
- Include 3-5 music recommendations that match the workout tempo and energy. Include a mix of Israeli/Hebrew songs and international songs. Song titles and artist names should be in their original language (Hebrew for Israeli songs).`;
}

function buildRegeneratePrompt(exercise, note, lessonContext) {
  return `You are a certified Pilates and Physical Education instructor.
Regenerate a SINGLE exercise based on the following context and note.

Original exercise:
- Name: ${exercise.name}
- Description: ${exercise.description}
- Category: ${exercise.category}
- Duration: ${exercise.durationSeconds} seconds
- Coach Cues: ${exercise.coachCues}

Lesson context:
- Age group: ${lessonContext.targetAgeGroup}
- Focus areas: ${lessonContext.focusAreas || lessonContext.focusArea}
- Equipment: ${lessonContext.equipment ? lessonContext.equipment.join(', ') : 'none'}

User note/request for changes: ${note}

Return ONLY valid JSON for a single exercise (no markdown, no extra text):
{
  "name": "string (in Hebrew)",
  "description": "string (in Hebrew)",
  "durationSeconds": number,
  "category": "Warm-Up | Core | Strength | Flexibility | Cool-Down",
  "coachCues": "string (in Hebrew)",
  "equipment": "string (in Hebrew, or empty string)"
}

Rules:
- IMPORTANT: All text fields MUST be in Hebrew
- Keep the same category and similar duration unless the note requests otherwise
- Adapt the exercise based on the user's note
- Keep category values in English`;
}

function buildProgramPrompt(params) {
  return `You are an elite certified personal trainer and sports scientist.
Build a comprehensive, periodized training program in valid JSON.

Client Profile:
- Goal: ${params.goal}${params.goalCustom ? ` (${params.goalCustom})` : ''}
- Gender: ${params.gender === 'male' ? 'Male' : 'Female'}
- Age: ${params.age || 'Not specified'}
- Current weight: ${params.weight ? params.weight + ' kg' : 'Not specified'}
- Fitness level: ${params.fitnessLevel}
- Training location: ${params.location}
- Available equipment: ${params.equipment && params.equipment.length > 0 ? params.equipment.join(', ') : 'bodyweight only'}
- Training days per week: ${params.daysPerWeek}
- Session duration: ${params.sessionDuration} minutes
- Timeframe: ${params.timeframe}
- Limitations/injuries: ${params.limitations || 'None'}

Return ONLY valid JSON matching this exact schema (no markdown, no extra text):
{
  "title": "string (in Hebrew - program title)",
  "description": "string (in Hebrew - 2-3 sentence overview of the program approach)",
  "totalWeeks": number,
  "daysPerWeek": number,
  "phases": [
    {
      "name": "string (in Hebrew - phase name, e.g. שלב התאמה)",
      "weekStart": number,
      "weekEnd": number,
      "focus": "string (in Hebrew - phase focus description)",
      "intensity": "low | moderate | high | very-high"
    }
  ],
  "weeks": [
    {
      "weekNumber": number,
      "theme": "string (in Hebrew - week theme/focus)",
      "days": [
        {
          "dayNumber": number (1=Sunday, 7=Saturday),
          "type": "training | rest | active-recovery",
          "title": "string (in Hebrew - e.g. אימון כוח עליון / יום מנוחה)",
          "focus": "string (in Hebrew - brief focus description, empty for rest days)",
          "duration": number (minutes, 0 for rest days),
          "exercises": [
            {
              "name": "string (in Hebrew)",
              "sets": number,
              "reps": "string (e.g. '12' or '30 שניות' or '8-12')",
              "rest": "string (e.g. '60 שניות')",
              "notes": "string (in Hebrew - form cues)"
            }
          ]
        }
      ]
    }
  ],
  "nutrition": {
    "calories": "string (in Hebrew - daily calorie recommendation)",
    "protein": "string (in Hebrew - protein recommendation)",
    "tips": ["string (in Hebrew - 3-4 nutrition tips)"]
  },
  "tips": ["string (in Hebrew - 3-5 general program tips)"]
}

Rules:
- IMPORTANT: All text fields MUST be in Hebrew
- Build a proper periodized program with progressive overload
- Include rest days and active recovery days appropriately
- For rest days, set type to "rest", exercises to empty array
- For active recovery, include light activities (walking, stretching)
- Adapt exercises to the available equipment and location
- Consider the client's limitations/injuries in exercise selection
- Include warm-up and cool-down in each training day
- Progress intensity gradually across phases
- For programs longer than 4 weeks, only detail the first 4 weeks fully, then provide a summary pattern for remaining weeks
- Each training day should have 5-8 exercises
- Provide realistic and safe progression`;
}

async function callGemini(prompt) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('NO_API_KEY');

  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      responseMimeType: 'application/json',
    },
  };

  const url = `${GEMINI_URL}/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Gemini API error:', response.status, errorText);
    if (response.status === 400 || response.status === 403) {
      throw new Error('INVALID_API_KEY');
    }
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const jsonText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!jsonText) throw new Error('Empty response from Gemini');

  return JSON.parse(jsonText);
}

// =============================
// TEST CONNECTION
// =============================
export async function testConnection() {
  const apiKey = getApiKey();
  if (!apiKey) return { ok: false, error: 'NO_API_KEY' };

  try {
    const url = `${GEMINI_URL}/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Reply with exactly: OK' }] }],
        generationConfig: { temperature: 0, maxOutputTokens: 10 },
      }),
    });

    if (!response.ok) {
      return { ok: false, error: `HTTP ${response.status}` };
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return { ok: true, response: text };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

// =============================
// LESSON API (Supabase)
// =============================
export async function generateLesson({ targetAge, gender, focusAreas, durationMinutes, equipment }) {
  const prompt = buildPrompt({ targetAge, gender, focusAreas, durationMinutes, equipment });
  const plan = await callGemini(prompt);

  const lessonData = {
    title: plan.title,
    targetAgeGroup: targetAge,
    focusArea: Array.isArray(focusAreas) ? focusAreas[0] : focusAreas,
    focusAreas: Array.isArray(focusAreas) ? focusAreas : [focusAreas],
    durationMinutes,
    equipment: equipment || [],
    musicRecommendations: plan.musicRecommendations || [],
    instructor: { id: 1, name: 'מאמן AI', specialty: 'פילאטיס וחינוך גופני' },
    exercises: (plan.exercises || []).map((ex, i) => ({
      id: Date.now() + i,
      name: ex.name,
      description: ex.description,
      durationSeconds: ex.durationSeconds,
      category: ex.category,
      coachCues: ex.coachCues,
      equipment: ex.equipment || '',
      note: '',
    })),
  };

  const { data, error } = await supabase
    .from('lessons')
    .insert({ user_id: getUser().id, data: lessonData })
    .select()
    .single();
  if (error) throw error;

  return { ...lessonData, id: data.id };
}

export async function regenerateExercise(lessonId, exerciseId, note) {
  const lesson = await getLessonById(lessonId);
  if (!lesson) throw new Error('Lesson not found');

  const exerciseIndex = lesson.exercises.findIndex(e => e.id === Number(exerciseId));
  if (exerciseIndex === -1) throw new Error('Exercise not found');

  const exercise = lesson.exercises[exerciseIndex];
  const prompt = buildRegeneratePrompt(exercise, note, lesson);
  const newExercise = await callGemini(prompt);

  lesson.exercises[exerciseIndex] = {
    ...lesson.exercises[exerciseIndex],
    name: newExercise.name,
    description: newExercise.description,
    durationSeconds: newExercise.durationSeconds,
    category: newExercise.category,
    coachCues: newExercise.coachCues,
    equipment: newExercise.equipment || '',
    note: '',
  };

  const { id, ...lessonData } = lesson;
  await supabase.from('lessons')
    .update({ data: lessonData, updated_at: new Date().toISOString() })
    .eq('id', lessonId);

  return lesson;
}

export async function updateExerciseNote(lessonId, exerciseId, note) {
  const lesson = await getLessonById(lessonId);
  if (!lesson) throw new Error('Lesson not found');

  const exercise = lesson.exercises.find(e => e.id === Number(exerciseId));
  if (!exercise) throw new Error('Exercise not found');

  exercise.note = note;
  const { id, ...lessonData } = lesson;
  await supabase.from('lessons')
    .update({ data: lessonData, updated_at: new Date().toISOString() })
    .eq('id', lessonId);

  return lesson;
}

export async function reorderExercises(lessonId, exerciseIds) {
  const lesson = await getLessonById(lessonId);
  if (!lesson) throw new Error('Lesson not found');

  const reordered = exerciseIds.map(eid => lesson.exercises.find(e => e.id === Number(eid))).filter(Boolean);
  lesson.exercises = reordered;

  const { id, ...lessonData } = lesson;
  await supabase.from('lessons')
    .update({ data: lessonData, updated_at: new Date().toISOString() })
    .eq('id', lessonId);

  return lesson;
}

export async function getAllLessons() {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('user_id', getUser().id)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(row => ({ ...row.data, id: row.id }));
}

export async function getLessonById(id) {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error || !data) return null;
  return { ...data.data, id: data.id };
}

export async function deleteLesson(id) {
  await supabase.from('lessons').delete().eq('id', id);
}

// =============================
// TRAINING PROGRAM API (Supabase)
// =============================
export async function generateProgram(params) {
  const prompt = buildProgramPrompt(params);
  const plan = await callGemini(prompt);

  const programData = {
    createdAt: new Date().toISOString(),
    params,
    title: plan.title,
    description: plan.description,
    totalWeeks: plan.totalWeeks,
    daysPerWeek: plan.daysPerWeek,
    phases: plan.phases || [],
    weeks: plan.weeks || [],
    nutrition: plan.nutrition || null,
    tips: plan.tips || [],
  };

  const { data, error } = await supabase
    .from('programs')
    .insert({ user_id: getUser().id, data: programData })
    .select()
    .single();
  if (error) throw error;

  return { ...programData, id: data.id };
}

export async function getAllPrograms() {
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('user_id', getUser().id)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(row => ({ ...row.data, id: row.id }));
}

export async function getProgramById(id) {
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error || !data) return null;
  return { ...data.data, id: data.id };
}

export async function deleteProgram(id) {
  await supabase.from('programs').delete().eq('id', id);
}

// =============================
// ADMIN FUNCTIONS
// =============================
export async function getAllUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function toggleUserLock(userId, lock) {
  const { error } = await supabase
    .from('profiles')
    .update({ is_locked: lock, updated_at: new Date().toISOString() })
    .eq('id', userId);
  if (error) throw error;
}

export async function deleteUser(userId) {
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId);
  if (error) throw error;
}

export async function getUserLessonsCount(userId) {
  const { count } = await supabase
    .from('lessons')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);
  return count || 0;
}

export async function getUserProgramsCount(userId) {
  const { count } = await supabase
    .from('programs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);
  return count || 0;
}
