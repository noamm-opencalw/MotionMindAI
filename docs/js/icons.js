// Material Symbols Outlined icons — using Google Material Symbols font
// Each function returns a <span> with the appropriate icon name

function ms(name, opts = {}) {
  const classes = ['material-symbols-outlined'];
  if (opts.filled) classes.push('filled');
  const style = opts.size ? `font-size:${opts.size}px` : '';
  return `<span class="${classes.join(' ')}" ${style ? `style="${style}"` : ''}>${name}</span>`;
}

// Navigation icons
export function iconHome() { return ms('home'); }
export function iconSparkle() { return ms('auto_awesome'); }
export function iconList() { return ms('layers'); }
export function iconSettings() { return ms('settings'); }
export function iconTarget() { return ms('edit_calendar'); }

// Action icons
export function iconArrowRight() { return ms('arrow_forward'); }
export function iconChevronLeft() { return ms('chevron_left'); }
export function iconChevronUp() { return ms('expand_less'); }
export function iconChevronDown() { return ms('expand_more'); }

// Feature icons
export function iconBrain() { return ms('psychology'); }
export function iconCertificate() { return ms('verified'); }
export function iconTimeSaving() { return ms('schedule'); }
export function iconClock() { return ms('timer', { size: 16 }); }
export function iconUsers() { return ms('group'); }
export function iconInstructor() { return ms('school'); }
export function iconCoach() { return ms('record_voice_over', { size: 18 }); }

// Exercise & workout icons
export function iconExercise() { return ms('fitness_center', { size: 16 }); }
export function iconDumbbell() { return ms('fitness_center'); }
export function iconSun() { return ms('wb_sunny'); }
export function iconCoreFire() { return ms('local_fire_department'); }
export function iconWave() { return ms('self_improvement'); }
export function iconSnowflake() { return ms('ac_unit'); }
export function iconRehab() { return ms('healing'); }
export function iconCoordination() { return ms('hub'); }
export function iconBalance() { return ms('balance'); }
export function iconCardio() { return ms('monitor_heart'); }
export function iconPosture() { return ms('accessibility_new'); }

// Equipment icons
export function iconBodyweight() { return ms('accessibility_new'); }
export function iconMat() { return ms('yoga'); }
export function iconBall() { return ms('sports_tennis'); }
export function iconBand() { return ms('cable'); }
export function iconRoller() { return ms('view_column'); }
export function iconWeights() { return ms('fitness_center'); }
export function iconRing() { return ms('circle'); }
export function iconChair() { return ms('chair'); }
export function iconWall() { return ms('wall'); }
export function iconHoop() { return ms('radio_button_unchecked'); }
export function iconRope() { return ms('jump_rope'); }
export function iconBench() { return ms('table_restaurant'); }

// Utility icons
export function iconKey() { return ms('key'); }
export function iconCheck() { return ms('check'); }
export function iconTrash() { return ms('delete', { size: 16 }); }
export function iconAlert() { return ms('warning'); }
export function iconEdit() { return ms('edit'); }
export function iconRefresh() { return ms('refresh'); }
export function iconNote() { return ms('sticky_note_2', { size: 16 }); }
export function iconGrip() { return ms('drag_indicator'); }
export function iconMusic() { return ms('music_note'); }

// Notification icon
export function iconNotifications() { return ms('notifications'); }

// Hero illustration — now a teal-themed abstract SVG
export function heroIllustration() {
  return `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="90" fill="rgba(255,255,255,0.05)"/>
    <circle cx="100" cy="100" r="65" fill="rgba(255,255,255,0.05)"/>
    <g transform="translate(55, 30)">
      <circle cx="45" cy="20" r="14" fill="rgba(255,255,255,0.9)"/>
      <path d="M20 60 Q45 25 70 60" stroke="rgba(255,255,255,0.9)" stroke-width="6" stroke-linecap="round" fill="none"/>
      <line x1="25" y1="52" x2="5" y2="38" stroke="rgba(255,255,255,0.8)" stroke-width="5" stroke-linecap="round"/>
      <line x1="65" y1="52" x2="85" y2="38" stroke="rgba(255,255,255,0.8)" stroke-width="5" stroke-linecap="round"/>
      <line x1="20" y1="60" x2="10" y2="90" stroke="rgba(255,255,255,0.9)" stroke-width="5" stroke-linecap="round"/>
      <line x1="10" y1="90" x2="0" y2="92" stroke="rgba(255,255,255,0.9)" stroke-width="5" stroke-linecap="round"/>
      <line x1="70" y1="60" x2="80" y2="90" stroke="rgba(255,255,255,0.9)" stroke-width="5" stroke-linecap="round"/>
      <line x1="80" y1="90" x2="90" y2="92" stroke="rgba(255,255,255,0.9)" stroke-width="5" stroke-linecap="round"/>
      <rect x="-5" y="95" width="100" height="4" rx="2" fill="rgba(255,255,255,0.3)"/>
    </g>
    <g fill="rgba(255,255,255,0.6)">
      <circle cx="35" cy="45" r="2"><animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite"/></circle>
      <circle cx="160" cy="55" r="2.5"><animate attributeName="opacity" values="0.3;1;0.3" dur="2.5s" begin="0.5s" repeatCount="indefinite"/></circle>
      <circle cx="45" cy="150" r="1.5"><animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" begin="1s" repeatCount="indefinite"/></circle>
      <circle cx="155" cy="140" r="2"><animate attributeName="opacity" values="0.3;1;0.3" dur="2.2s" begin="0.3s" repeatCount="indefinite"/></circle>
      <circle cx="100" cy="165" r="1.5"><animate attributeName="opacity" values="0.3;1;0.3" dur="2s" begin="0.7s" repeatCount="indefinite"/></circle>
    </g>
    <circle cx="100" cy="100" r="95" stroke="rgba(255,255,255,0.1)" stroke-width="1" fill="none" stroke-dasharray="6 4"/>
  </svg>`;
}

// Loading animation
export function loadingAnimation() {
  return `<svg class="spinner" viewBox="0 0 50 50">
    <circle class="spinner__circle" cx="25" cy="25" r="20" fill="none" stroke="url(#spinner-gradient)" stroke-width="4"/>
    <defs>
      <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="var(--color-primary)"/>
        <stop offset="100%" stop-color="var(--color-primary-container)"/>
      </linearGradient>
    </defs>
  </svg>`;
}

// Empty state illustration
export function emptyStateIllustration() {
  return `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="50" y="40" width="100" height="130" rx="12" stroke="currentColor" stroke-width="2" stroke-dasharray="6 4"/>
    <rect x="75" y="32" width="50" height="16" rx="4" fill="currentColor" opacity="0.2"/>
    <line x1="100" y1="90" x2="100" y2="130" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity="0.4"/>
    <line x1="80" y1="110" x2="120" y2="110" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity="0.4"/>
    <line x1="70" y1="75" x2="95" y2="75" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.15"/>
    <line x1="105" y1="75" x2="130" y2="75" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.15"/>
    <line x1="70" y1="145" x2="100" y2="145" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.15"/>
    <line x1="110" y1="145" x2="130" y2="145" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.15"/>
  </svg>`;
}

// Logo icon - PNG image
export function logoIcon() {
  return `<img src="MotionMindAI_nobg.png" alt="פאר טוסיק" style="width:32px;height:32px;border-radius:8px;object-fit:cover;">`;
}

// Category icon mapper
export function categoryIcon(category) {
  switch(category) {
    case 'Warm-Up': return iconSun();
    case 'Core': return iconCoreFire();
    case 'Strength': return iconDumbbell();
    case 'Flexibility': return iconWave();
    case 'Cool-Down': return iconSnowflake();
    default: return iconExercise();
  }
}

// Category color mapper
export function categoryColorClass(category) {
  switch(category) {
    case 'Warm-Up': return 'warmup';
    case 'Core': return 'core';
    case 'Strength': return 'strength';
    case 'Flexibility': return 'flexibility';
    case 'Cool-Down': return 'cooldown';
    default: return 'primary';
  }
}

export function categoryColor(category) {
  switch(category) {
    case 'Warm-Up': return 'var(--color-warmup)';
    case 'Core': return 'var(--color-core)';
    case 'Strength': return 'var(--color-strength)';
    case 'Flexibility': return 'var(--color-flexibility)';
    case 'Cool-Down': return 'var(--color-cooldown)';
    default: return 'var(--color-primary)';
  }
}
