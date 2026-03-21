// API configuration — change this to your deployed API URL
const API_BASE = '';

// Mock data for demo mode (when API is not available)
const MOCK_LESSONS = [
  {
    id: 1,
    title: 'פילאטיס ליבה - עוצמה ושליטה',
    targetAgeGroup: 'מבוגרים',
    focusArea: 'Core Strength',
    durationMinutes: 45,
    instructor: { id: 1, name: 'מאמן AI', specialty: 'אימונים מבוססי בינה מלאכותית' },
    exercises: [
      { id: 1, name: 'חימום - Cat-Cow', description: 'תנועה עדינה של עמוד השדרה לחימום הגב והליבה. תנועה איטית ומבוקרת בין קשת לעיגול.', durationSeconds: 180, category: 'Warm-Up', coachCues: 'נשמו עמוק, הרגישו כל חוליה בעמוד השדרה זזה בנפרד. שמרו על כתפיים רחוקות מהאוזניים.' },
      { id: 2, name: 'Pilates Hundred', description: 'תרגיל קלאסי לסיבולת הליבה. שכיבה על הגב עם רגליים ב-tabletop, הנפת ראש וכתפיים.', durationSeconds: 120, category: 'Core', coachCues: 'שמרו על גב תחתון צמוד לרצפה. ידיים פועמות בתנועות קטנות ומבוקרות לצד הגוף.' },
      { id: 3, name: 'Single Leg Stretch', description: 'חיזוק שרירי הבטן וייצוב אגן. משיכת ברך לחזה בחילופין.', durationSeconds: 150, category: 'Core', coachCues: 'שמרו על הגב התחתון צמוד למזרן. החליפו רגליים בתנועה זורמת ורציפה.' },
      { id: 4, name: 'גשר אגן', description: 'חיזוק הישבן וגב תחתון. הרמת אגן מכיפוף ברכיים בשכיבה על הגב.', durationSeconds: 120, category: 'Strength', coachCues: 'לחצו כפות רגליים לרצפה. עלו חוליה אחרי חוליה ורדו באותה דרך.' },
      { id: 5, name: 'Plank', description: 'ייצוב כל שרירי הליבה. עמידה על אמות ידיים וקצות אצבעות הרגליים.', durationSeconds: 60, category: 'Strength', coachCues: 'שמרו על קו ישר מראש ועד עקבים. אל תתנו לאגן לצנוח או להתרומם.' },
      { id: 6, name: 'מתיחת יונה', description: 'מתיחה עמוקה לכופפי הירך ולשרירי הירך הקדמיים.', durationSeconds: 120, category: 'Flexibility', coachCues: 'שמרו על אגן מאוזן. נשמו לעומק המתיחה, אל תכריחו.' },
      { id: 7, name: 'תנוחת ילד', description: 'שחרור ומנוחה. ישיבה על העקבים, ידיים מושטות קדימה, מצח על הרצפה.', durationSeconds: 120, category: 'Cool-Down', coachCues: 'תנו לגב להתארך. נשמו לאזור הצלעות האחוריות. הרגישו את השחרור.' },
    ],
  },
  {
    id: 2,
    title: 'אימון גמישות - זרימה ותנועה',
    targetAgeGroup: 'מבוגרים',
    focusArea: 'Flexibility',
    durationMinutes: 30,
    instructor: { id: 1, name: 'מאמן AI', specialty: 'אימונים מבוססי בינה מלאכותית' },
    exercises: [
      { id: 8, name: 'נשימות וחימום', description: 'נשימות עמוקות עם תנועות עדינות של צוואר וכתפיים.', durationSeconds: 120, category: 'Warm-Up', coachCues: 'עצמו עיניים, התמקדו בנשימה. שחררו כל מתח.' },
      { id: 9, name: 'סיבובי עמוד שדרה', description: 'סיבוב עדין של פלג גוף עליון בישיבה או בשכיבה.', durationSeconds: 120, category: 'Flexibility', coachCues: 'סובבו מהמותן, לא מהכתפיים. שמרו על אגן יציב.' },
      { id: 10, name: 'מתיחת המסטרינג', description: 'מתיחה לשרירי הירך האחוריים בעזרת רצועה.', durationSeconds: 150, category: 'Flexibility', coachCues: 'שמרו על הרגל ישרה, כופפו מהירך. אל תנעלו ברך.' },
      { id: 11, name: 'שחרור גב', description: 'גלגול איטי של עמוד השדרה ומתיחות עדינות.', durationSeconds: 150, category: 'Cool-Down', coachCues: 'תנו למשיכת הכובד לעשות את העבודה. נשמו ושחררו.' },
    ],
  },
];

let mockIdCounter = MOCK_LESSONS.length;

// Check if we're in demo mode (no API configured)
function isDemoMode() {
  return !API_BASE;
}

export async function generateLesson(targetAge, focusArea, durationMinutes) {
  if (isDemoMode()) {
    // Simulate API delay
    await new Promise(r => setTimeout(r, 2000));
    mockIdCounter++;
    const mock = {
      id: mockIdCounter,
      title: `תוכנית ${focusArea === 'Core Strength' ? 'ליבה' : focusArea === 'Flexibility' ? 'גמישות' : focusArea === 'Strength' ? 'כוח' : 'אימון'} - ${targetAge}`,
      targetAgeGroup: targetAge,
      focusArea,
      durationMinutes,
      instructor: { id: 1, name: 'מאמן AI', specialty: 'אימונים מבוססי בינה מלאכותית' },
      exercises: generateMockExercises(focusArea, durationMinutes),
    };
    MOCK_LESSONS.push(mock);
    return mock;
  }

  const res = await fetch(`${API_BASE}/api/lessons/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetAge, focusArea, durationMinutes }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function getAllLessons() {
  if (isDemoMode()) {
    await new Promise(r => setTimeout(r, 300));
    return [...MOCK_LESSONS];
  }

  const res = await fetch(`${API_BASE}/api/lessons`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function getLessonById(id) {
  if (isDemoMode()) {
    await new Promise(r => setTimeout(r, 200));
    const lesson = MOCK_LESSONS.find(l => l.id === Number(id));
    return lesson || null;
  }

  const res = await fetch(`${API_BASE}/api/lessons/${id}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function generateMockExercises(focusArea, durationMinutes) {
  const totalSeconds = durationMinutes * 60;
  const exerciseBank = {
    'Core Strength': [
      { name: 'חימום ליבה', category: 'Warm-Up', coachCues: 'התחילו בעדינות, חממו את שרירי הבטן.' },
      { name: 'Pilates Hundred', category: 'Core', coachCues: 'גב תחתון צמוד לרצפה, ידיים פועמות.' },
      { name: 'Dead Bug', category: 'Core', coachCues: 'שמרו על גב תחתון צמוד, הזיזו יד ורגל נגדיות.' },
      { name: 'Plank Hold', category: 'Strength', coachCues: 'קו ישר מראש לעקבים, נשמו באופן קבוע.' },
      { name: 'Bird Dog', category: 'Core', coachCues: 'שמרו על אגן יציב, הושיטו יד ורגל נגדיות.' },
      { name: 'שחרור ונשימות', category: 'Cool-Down', coachCues: 'נשימות עמוקות, שחררו את כל השרירים.' },
    ],
    'Flexibility': [
      { name: 'נשימות ותנועה', category: 'Warm-Up', coachCues: 'נשימה עמוקה, תנועות עדינות.' },
      { name: 'Cat-Cow Flow', category: 'Flexibility', coachCues: 'חוליה אחרי חוליה, תנועה זורמת.' },
      { name: 'מתיחת יונה', category: 'Flexibility', coachCues: 'אגן מאוזן, נשמו לעומק.' },
      { name: 'Forward Fold', category: 'Flexibility', coachCues: 'כופפו מהירכיים, שמרו על גב ארוך.' },
      { name: 'שחרור סופי', category: 'Cool-Down', coachCues: 'שכבו בשלווה, שחררו כל מתח.' },
    ],
    'Strength': [
      { name: 'חימום דינמי', category: 'Warm-Up', coachCues: 'הזיזו את כל המפרקים, חממו את הגוף.' },
      { name: 'סקוואט', category: 'Strength', coachCues: 'ברכיים בכיוון האצבעות, ירדו עמוק.' },
      { name: 'לאנג\'ים', category: 'Strength', coachCues: 'צעד רחב, ברך אחורית כמעט לרצפה.' },
      { name: 'שכיבות סמיכה', category: 'Strength', coachCues: 'גוף ישר כקרש, ירדו לאט.' },
      { name: 'גשר ישבני', category: 'Strength', coachCues: 'לחצו כפות רגליים, הרימו אגן.' },
      { name: 'מתיחות סיום', category: 'Cool-Down', coachCues: 'מתחו כל שריר שעבד, נשמו עמוק.' },
    ],
  };

  const exercises = exerciseBank[focusArea] || exerciseBank['Core Strength'];
  const perExercise = Math.round(totalSeconds / exercises.length);

  return exercises.map((ex, i) => ({
    id: Date.now() + i,
    name: ex.name,
    description: `תרגיל ${i + 1} מתוך ${exercises.length} בתוכנית`,
    durationSeconds: perExercise,
    category: ex.category,
    coachCues: ex.coachCues,
  }));
}
