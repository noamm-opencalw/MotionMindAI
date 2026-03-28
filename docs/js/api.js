import { supabase, getUser, isAdmin, isGuest } from './auth.js';

// =============================
// CONFIGURATION
// =============================
const CREW_API_URL = 'http://localhost:8000/api';

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
// CREW AI BACKEND CALLS
// =============================
async function callCrew(endpoint, body) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('NO_API_KEY');

  const response = await fetch(`${CREW_API_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...body, apiKey }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const detail = errorData.detail || `API error: ${response.status}`;
    console.error('Crew API error:', response.status, detail);
    if (response.status === 400) throw new Error('INVALID_API_KEY');
    throw new Error(detail);
  }

  return response.json();
}

// =============================
// TEST CONNECTION
// =============================
export async function testConnection() {
  const apiKey = getApiKey();
  if (!apiKey) return { ok: false, error: 'NO_API_KEY' };

  try {
    const response = await fetch(`${CREW_API_URL}/test-connection`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey }),
    });

    if (!response.ok) {
      return { ok: false, error: `HTTP ${response.status}` };
    }

    const data = await response.json();
    return { ok: data.success, response: data.message };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

// =============================
// GUEST SESSION STORAGE
// =============================
const GUEST_LESSONS_KEY = 'guest_lessons';

function getGuestLessons() {
  try {
    return JSON.parse(sessionStorage.getItem(GUEST_LESSONS_KEY) || '[]');
  } catch { return []; }
}

function saveGuestLesson(lesson) {
  const lessons = getGuestLessons();
  lessons.unshift(lesson);
  sessionStorage.setItem(GUEST_LESSONS_KEY, JSON.stringify(lessons));
}

function getGuestLessonById(id) {
  return getGuestLessons().find(l => l.id === id) || null;
}

function deleteGuestLesson(id) {
  const lessons = getGuestLessons().filter(l => l.id !== id);
  sessionStorage.setItem(GUEST_LESSONS_KEY, JSON.stringify(lessons));
}

// =============================
// LESSON API (CrewAI + Supabase)
// =============================
export async function generateLesson({ targetAge, gender, focusAreas, durationMinutes, equipment }) {
  const plan = await callCrew('/generate/lesson', {
    targetAge,
    gender,
    focusAreas: Array.isArray(focusAreas) ? focusAreas : [focusAreas],
    durationMinutes,
    equipment: equipment || [],
  });

  const lessonData = {
    title: plan.title,
    targetAgeGroup: targetAge,
    focusArea: Array.isArray(focusAreas) ? focusAreas[0] : focusAreas,
    focusAreas: Array.isArray(focusAreas) ? focusAreas : [focusAreas],
    durationMinutes,
    equipment: equipment || [],
    musicRecommendations: plan.musicRecommendations || [],
    nutritionTips: plan.nutritionTips || [],
    safetyNotes: plan.safetyNotes || [],
    instructor: { id: 1, name: 'Spearit! AI Crew', specialty: 'פילאטיס וחינוך גופני' },
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

  // Guest users: save to sessionStorage (cleared on page refresh)
  if (isGuest()) {
    const guestLesson = { ...lessonData, id: `guest-${Date.now()}` };
    saveGuestLesson(guestLesson);
    return guestLesson;
  }

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

  const result = await callCrew('/generate/regenerate', {
    exerciseContext: JSON.stringify(exercise),
    userNote: note,
    lessonContext: JSON.stringify({
      targetAgeGroup: lesson.targetAgeGroup,
      focusAreas: lesson.focusAreas || lesson.focusArea,
      equipment: lesson.equipment,
    }),
  });

  const newExercise = result.exercise || result;

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
  if (isGuest()) return getGuestLessons();

  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('user_id', getUser().id)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(row => ({ ...row.data, id: row.id }));
}

export async function getLessonById(id) {
  if (isGuest() || String(id).startsWith('guest-')) {
    return getGuestLessonById(String(id));
  }

  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error || !data) return null;
  return { ...data.data, id: data.id };
}

export async function deleteLesson(id) {
  if (isGuest() || String(id).startsWith('guest-')) {
    deleteGuestLesson(String(id));
    return;
  }
  await supabase.from('lessons').delete().eq('id', id);
}

// =============================
// TRAINING PROGRAM API (CrewAI + Supabase)
// =============================
export async function generateProgram(params) {
  const plan = await callCrew('/generate/program', params);

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
    safetyNotes: plan.safetyNotes || [],
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
