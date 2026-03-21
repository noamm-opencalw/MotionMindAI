// =============================
// CONFIGURATION
// =============================
const API_BASE = ''; // Set to deployed API URL if available
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

// =============================
// API KEY MANAGEMENT (localStorage)
// =============================
export function getApiKey() {
  return localStorage.getItem('motionmind_gemini_key') || '';
}

export function setApiKey(key) {
  if (key) {
    localStorage.setItem('motionmind_gemini_key', key.trim());
  } else {
    localStorage.removeItem('motionmind_gemini_key');
  }
}

export function hasApiKey() {
  return getApiKey().length > 0;
}

// =============================
// LESSON STORAGE (localStorage)
// =============================
function getLessonsFromStorage() {
  try {
    return JSON.parse(localStorage.getItem('motionmind_lessons') || '[]');
  } catch {
    return [];
  }
}

function saveLessonsToStorage(lessons) {
  localStorage.setItem('motionmind_lessons', JSON.stringify(lessons));
}

function getNextId() {
  const lessons = getLessonsFromStorage();
  if (lessons.length === 0) return 1;
  return Math.max(...lessons.map(l => l.id)) + 1;
}

// =============================
// GEMINI DIRECT API CALL
// =============================
function buildPrompt(targetAge, focusArea, durationMinutes) {
  return `You are a certified Pilates and Physical Education instructor.
Generate a structured lesson plan in valid JSON.

Parameters:
- Target age group: ${targetAge}
- Focus area: ${focusArea}
- Total duration: ${durationMinutes} minutes

Return ONLY valid JSON matching this exact schema (no markdown, no extra text):
{
  "title": "string (in Hebrew)",
  "exercises": [
    {
      "name": "string (in Hebrew)",
      "description": "string (in Hebrew)",
      "durationSeconds": number,
      "category": "Warm-Up | Core | Strength | Flexibility | Cool-Down",
      "coachCues": "string (in Hebrew)"
    }
  ]
}

Rules:
- IMPORTANT: All text fields (title, name, description, coachCues) MUST be in Hebrew
- Include 4-7 exercises appropriate for ${targetAge}
- Total exercise time should fill approximately ${durationMinutes} minutes
- coachCues should be concise verbal instructions an instructor would say
- Categories must come from the enum above (keep category values in English)`;
}

async function callGemini(targetAge, focusArea, durationMinutes) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('NO_API_KEY');

  const prompt = buildPrompt(targetAge, focusArea, durationMinutes);

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

  // Parse the JSON response
  const plan = JSON.parse(jsonText);
  return plan;
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
// PUBLIC API
// =============================
export async function generateLesson(targetAge, focusArea, durationMinutes) {
  // If a backend API is configured, use it
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/api/lessons/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetAge, focusArea, durationMinutes }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  // Call Gemini directly from the browser
  const plan = await callGemini(targetAge, focusArea, durationMinutes);

  // Create a full lesson object
  const lesson = {
    id: getNextId(),
    title: plan.title,
    targetAgeGroup: targetAge,
    focusArea,
    durationMinutes,
    instructor: { id: 1, name: 'מאמן AI', specialty: 'פילאטיס וחינוך גופני' },
    exercises: (plan.exercises || []).map((ex, i) => ({
      id: Date.now() + i,
      name: ex.name,
      description: ex.description,
      durationSeconds: ex.durationSeconds,
      category: ex.category,
      coachCues: ex.coachCues,
    })),
  };

  // Save to localStorage
  const lessons = getLessonsFromStorage();
  lessons.push(lesson);
  saveLessonsToStorage(lessons);

  return lesson;
}

export async function getAllLessons() {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/api/lessons`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  return getLessonsFromStorage();
}

export async function getLessonById(id) {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/api/lessons/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  const lessons = getLessonsFromStorage();
  return lessons.find(l => l.id === Number(id)) || null;
}

export async function deleteLesson(id) {
  if (API_BASE) return; // Not implemented in backend

  const lessons = getLessonsFromStorage();
  const filtered = lessons.filter(l => l.id !== Number(id));
  saveLessonsToStorage(filtered);
}
