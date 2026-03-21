export const t = {
  appName: 'פאר טוסיק',
  appTagline: 'תוכניות אימון חכמות',

  nav: {
    home: 'ראשי',
    generate: 'יצירה',
    lessons: 'התוכניות שלי',
  },

  hero: {
    title: 'תוכניות אימון מותאמות אישית בלחיצת כפתור',
    subtitle: 'בינה מלאכותית שמבינה תנועה — יוצרת תוכניות פילאטיס וחינוך גופני מקצועיות, עם תרגילים, זמנים והנחיות מאמן.',
    cta: 'צור תוכנית אימון',
  },

  features: {
    time: {
      title: 'חיסכון בזמן',
      desc: 'תוכנית מלאה תוך שניות',
    },
    quality: {
      title: 'איכות מקצועית',
      desc: 'תרגילים מותאמים ומדויקים',
    },
    ai: {
      title: 'מונע בינה מלאכותית',
      desc: 'טכנולוגיית Gemini AI',
    },
  },

  howItWorks: {
    title: 'איך זה עובד?',
    steps: [
      {
        title: 'בחר פרמטרים',
        desc: 'גיל, מכשירים, תחומי מיקוד, מוזיקה ומשך האימון',
      },
      {
        title: 'הבינה המלאכותית יוצרת',
        desc: 'Gemini AI מתכנן תוכנית מפורטת',
      },
      {
        title: 'התאם ושפר',
        desc: 'ערוך תרגילים, שנה סדר והוסף הערות',
      },
    ],
  },

  generate: {
    title: 'יצירת תוכנית אימון חדשה',
    subtitle: 'מלא את הפרטים והבינה המלאכותית תיצור תוכנית מותאמת',
    ageLabel: 'קבוצת גיל',
    equipmentLabel: 'מכשירים וציוד',
    equipmentHint: 'ניתן לבחור מספר מכשירים',
    focusLabel: 'תחומי מיקוד',
    focusHint: 'ניתן לבחור מספר תחומים',
    musicLabel: 'מוזיקה לאימון',
    musicStyleLabel: 'סגנון מוזיקה',
    musicCustomLabel: 'שירים ספציפיים (אופציונלי)',
    musicCustomPlaceholder: 'לדוגמה: עידן רייכל - שובי אל ביתי, שלומי שבת...',
    durationLabel: 'משך האימון',
    durationUnit: 'דקות',
    submit: 'צור תוכנית',
    loading: 'הבינה המלאכותית יוצרת...',
    loadingSub: 'מתכננת תרגילים, זמנים והנחיות מאמן',
  },

  ageOptions: [
    { value: 'ילדים (6-8)', label: 'ילדים (6-8)' },
    { value: 'ילדים (9-12)', label: 'ילדים (9-12)' },
    { value: 'נוער (13-17)', label: 'נוער (13-17)' },
    { value: 'מבוגרים', label: 'מבוגרים' },
    { value: 'גיל הזהב (60+)', label: 'גיל הזהב (60+)' },
  ],

  equipmentOptions: [
    { value: 'ללא ציוד', label: 'ללא ציוד', icon: 'bodyweight' },
    { value: 'מזרן', label: 'מזרן', icon: 'mat' },
    { value: 'כדור פילאטיס', label: 'כדור פילאטיס', icon: 'ball' },
    { value: 'גומיית התנגדות', label: 'גומיית התנגדות', icon: 'band' },
    { value: 'רולר קצף', label: 'רולר קצף', icon: 'roller' },
    { value: 'משקולות קלות', label: 'משקולות קלות', icon: 'weights' },
    { value: 'טבעת פילאטיס', label: 'טבעת פילאטיס', icon: 'ring' },
    { value: 'כיסא', label: 'כיסא', icon: 'chair' },
    { value: 'קיר', label: 'קיר', icon: 'wall' },
    { value: 'חישוק', label: 'חישוק', icon: 'hoop' },
    { value: 'חבל קפיצה', label: 'חבל קפיצה', icon: 'rope' },
    { value: 'ספסל שוודי', label: 'ספסל שוודי', icon: 'bench' },
  ],

  focusOptions: [
    { value: 'Core Strength', label: 'חיזוק ליבה', icon: 'core' },
    { value: 'Flexibility', label: 'גמישות', icon: 'flexibility' },
    { value: 'Strength', label: 'כוח', icon: 'strength' },
    { value: 'Warm-Up', label: 'חימום כללי', icon: 'warmup' },
    { value: 'Rehabilitation', label: 'שיקום', icon: 'rehab' },
    { value: 'Coordination', label: 'קואורדינציה', icon: 'coordination' },
    { value: 'Balance', label: 'שיווי משקל', icon: 'balance' },
    { value: 'Cardio', label: 'סיבולת לב-ריאה', icon: 'cardio' },
    { value: 'Posture', label: 'יציבה', icon: 'posture' },
  ],

  musicStyles: [
    { value: 'none', label: 'ללא מוזיקה' },
    { value: 'calm-instrumental', label: 'אינסטרומנטלי רגוע' },
    { value: 'pop-hebrew', label: 'פופ ישראלי' },
    { value: 'pop-international', label: 'פופ בינלאומי' },
    { value: 'electronic-chill', label: 'אלקטרוני צ\'יל' },
    { value: 'world-music', label: 'מוזיקת עולם' },
    { value: 'classical', label: 'קלאסית' },
    { value: 'mizrahi', label: 'מזרחית' },
    { value: 'upbeat-energy', label: 'אנרגטי ומהיר' },
    { value: 'yoga-ambient', label: 'יוגה ואמביינט' },
  ],

  durationOptions: [15, 30, 45, 60],

  categories: {
    'Warm-Up': 'חימום',
    'Core': 'ליבה',
    'Strength': 'כוח',
    'Flexibility': 'גמישות',
    'Cool-Down': 'שחרור',
  },

  lessons: {
    title: 'התוכניות שלי',
    empty: {
      title: 'עדיין לא נוצרו תוכניות',
      desc: 'צור את תוכנית האימון הראשונה שלך בלחיצת כפתור',
      cta: 'צור תוכנית ראשונה',
    },
    exercises: 'תרגילים',
    minutes: 'דקות',
  },

  detail: {
    back: 'חזרה לתוכניות',
    coachCues: 'הנחיית מאמן',
    exercisesTitle: 'מהלך האימון',
    summary: {
      duration: 'משך כולל',
      exercises: 'תרגילים',
      categories: 'קטגוריות',
    },
    instructor: 'מאמן',
    seconds: 'שניות',
    minutes: 'דקות',
    notFound: 'התוכנית לא נמצאה',
    notFoundDesc: 'התוכנית שחיפשת לא קיימת',
    noteLabel: 'הערה',
    notePlaceholder: 'הוסף הערה לתרגיל...',
    regenerateExercise: 'צור מחדש תרגיל זה',
    regenerating: 'יוצר מחדש...',
    moveUp: 'הזז למעלה',
    moveDown: 'הזז למטה',
    editExercises: 'עריכת תרגילים',
    doneEditing: 'סיום עריכה',
    musicTitle: 'מוזיקה מומלצת',
    equipment: 'ציוד',
  },

  settings: {
    title: 'הגדרות',
    apiKeyLabel: 'מפתח Gemini API',
    apiKeyPlaceholder: 'הכנס את מפתח ה-API שלך...',
    apiKeyHelp: 'קבל מפתח חינמי מ-',
    apiKeyLink: 'Google AI Studio',
    save: 'שמור',
    clear: 'נקה מפתח',
    saved: 'המפתח נשמר בהצלחה',
    cleared: 'המפתח נמחק',
    testConnection: 'בדוק חיבור',
    testing: 'בודק חיבור ל-Gemini AI...',
    testSuccess: 'החיבור תקין! Gemini AI מוכן ליצירת תוכניות.',
    testFailed: 'שגיאת חיבור. בדוק שהמפתח תקין ונסה שנית.',
    status: {
      connected: 'מחובר ומוכן ליצירה',
      notConnected: 'לא מוגדר — יש להזין מפתח API',
    },
    dataTitle: 'ניהול נתונים',
    clearData: 'מחק את כל התוכניות',
    dataCleared: 'כל התוכניות נמחקו',
    clearConfirm: 'האם למחוק את כל התוכניות השמורות?',
  },

  errors: {
    generateFailed: 'שגיאה ביצירת התוכנית. נסה שנית.',
    invalidApiKey: 'מפתח API לא תקין. בדוק את המפתח בהגדרות.',
    noApiKey: 'יש להגדיר מפתח Gemini API בהגדרות לפני יצירת תוכנית.',
    loadFailed: 'שגיאה בטעינת הנתונים. נסה שנית.',
    fillAll: 'יש לבחור קבוצת גיל ותחום מיקוד אחד לפחות',
    regenerateFailed: 'שגיאה ביצירת התרגיל מחדש. נסה שנית.',
  },

  toast: {
    success: 'התוכנית נוצרה בהצלחה!',
    exerciseRegenerated: 'התרגיל נוצר מחדש!',
    lessonUpdated: 'התוכנית עודכנה!',
    noteSaved: 'ההערה נשמרה!',
  },
};
