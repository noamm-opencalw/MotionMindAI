export const t = {
  appName: 'MotionMind AI',
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
        desc: 'גיל, תחום מיקוד ומשך האימון',
      },
      {
        title: 'הבינה המלאכותית יוצרת',
        desc: 'Gemini AI מתכנן תוכנית מפורטת',
      },
      {
        title: 'קבל תוכנית מוכנה',
        desc: 'עם תרגילים, זמנים והנחיות מאמן',
      },
    ],
  },

  generate: {
    title: 'יצירת תוכנית אימון חדשה',
    subtitle: 'מלא את הפרטים והבינה המלאכותית תיצור תוכנית מותאמת',
    ageLabel: 'קבוצת גיל',
    focusLabel: 'תחום מיקוד',
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

  focusOptions: [
    { value: 'Core Strength', label: 'חיזוק ליבה', icon: 'core' },
    { value: 'Flexibility', label: 'גמישות', icon: 'flexibility' },
    { value: 'Strength', label: 'כוח', icon: 'strength' },
    { value: 'Warm-Up', label: 'חימום כללי', icon: 'warmup' },
    { value: 'Rehabilitation', label: 'שיקום', icon: 'rehab' },
    { value: 'Coordination', label: 'קואורדינציה', icon: 'coordination' },
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
    fillAll: 'יש למלא את כל השדות',
  },

  toast: {
    success: 'התוכנית נוצרה בהצלחה!',
  },
};
