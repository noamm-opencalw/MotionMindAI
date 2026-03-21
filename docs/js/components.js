import { t } from './i18n.js';
import {
  iconClock, iconUsers, iconExercise, iconCoach, iconTarget,
  categoryIcon, categoryColorClass, categoryColor,
  iconCoreFire, iconWave, iconDumbbell, iconSun, iconRehab, iconCoordination,
  iconBalance, iconCardio, iconPosture,
  iconBodyweight, iconMat, iconBall, iconBand, iconRoller, iconWeights,
  iconRing, iconChair, iconWall, iconHoop, iconRope, iconBench,
  iconMusic, iconRefresh, iconChevronUp, iconChevronDown, iconNote, iconGrip,
} from './icons.js';

// Exercise card for the timeline
export function exerciseCard(exercise, index, total, editMode = false) {
  const colorClass = categoryColorClass(exercise.category);
  const catName = t.categories[exercise.category] || exercise.category;
  const durationMin = Math.round(exercise.durationSeconds / 60);
  const durationDisplay = durationMin >= 1
    ? `${durationMin} ${t.detail.minutes}`
    : `${exercise.durationSeconds} ${t.detail.seconds}`;

  const equipmentBadge = exercise.equipment
    ? `<span class="badge badge--primary" style="font-size:var(--text-xs)">${exercise.equipment}</span>`
    : '';

  const noteDisplay = exercise.note
    ? `<div class="exercise-card__note">
        ${iconNote()}
        <span>${exercise.note}</span>
      </div>`
    : '';

  const editActions = editMode ? `
    <div class="exercise-card__actions">
      <div class="exercise-card__reorder">
        ${index > 0 ? `<button type="button" class="btn btn--icon btn--ghost exercise-move-up" data-exercise-id="${exercise.id}" title="${t.detail.moveUp}">
          ${iconChevronUp()}
        </button>` : '<div style="width:44px"></div>'}
        <span class="exercise-card__index">${index + 1}</span>
        ${index < total - 1 ? `<button type="button" class="btn btn--icon btn--ghost exercise-move-down" data-exercise-id="${exercise.id}" title="${t.detail.moveDown}">
          ${iconChevronDown()}
        </button>` : '<div style="width:44px"></div>'}
      </div>
      <div class="exercise-card__edit-actions">
        <div class="exercise-card__note-input">
          <textarea class="exercise-note-input" data-exercise-id="${exercise.id}" placeholder="${t.detail.notePlaceholder}" rows="2">${exercise.note || ''}</textarea>
        </div>
        <button type="button" class="btn btn--secondary btn--sm exercise-regenerate" data-exercise-id="${exercise.id}">
          ${iconRefresh()}
          ${t.detail.regenerateExercise}
        </button>
      </div>
    </div>
  ` : '';

  return `
    <div class="timeline-item" data-exercise-id="${exercise.id}">
      <div class="timeline-dot" style="background: ${categoryColor(exercise.category)}"></div>
      <div class="card exercise-card">
        <div class="exercise-card__header">
          <div style="display:flex;gap:var(--space-2);flex-wrap:wrap;align-items:center">
            <span class="badge badge--${colorClass}">${catName}</span>
            ${equipmentBadge}
          </div>
          <div class="meta-item">
            ${iconClock()}
            <span class="ltr-content">${durationDisplay}</span>
          </div>
        </div>
        <div class="exercise-card__name">${exercise.name}</div>
        <div class="exercise-card__desc">${exercise.description}</div>
        ${exercise.coachCues ? `
          <div class="exercise-card__cues">
            ${iconCoach()}
            <span class="exercise-card__cues-text"><strong>${t.detail.coachCues}:</strong> ${exercise.coachCues}</span>
          </div>
        ` : ''}
        ${noteDisplay}
        ${editActions}
      </div>
    </div>
  `;
}

// Lesson card for the list view
export function lessonCard(lesson) {
  const focusColorClass = categoryColorClass(lesson.focusArea);
  const catName = t.categories[lesson.focusArea] || lesson.focusArea;
  const exerciseCount = lesson.exercises ? lesson.exercises.length : 0;

  // Show multiple focus badges if available
  const focusBadges = (lesson.focusAreas && lesson.focusAreas.length > 0)
    ? lesson.focusAreas.map(fa => {
        const cc = categoryColorClass(fa);
        const name = t.categories[fa] || fa;
        return `<span class="badge badge--${cc}">${name}</span>`;
      }).join('')
    : `<span class="badge badge--${focusColorClass}">${catName}</span>`;

  const equipmentCount = lesson.equipment && lesson.equipment.length > 0
    ? `<span class="meta-item">${iconDumbbell()}<span>${lesson.equipment.length} ציוד</span></span>`
    : '';

  return `
    <a href="#/lesson/${lesson.id}" class="card card--interactive card--accent-start lesson-card"
       style="border-inline-start-color: ${categoryColor(lesson.focusArea)}">
      <div class="card__body lesson-card">
        <div class="lesson-card__title">${lesson.title}</div>
        <div class="lesson-card__meta">
          ${focusBadges}
          <span class="badge badge--primary">${lesson.targetAgeGroup}</span>
        </div>
        <div class="lesson-card__footer">
          <div class="lesson-card__stats">
            <span class="meta-item">
              ${iconClock()}
              <span>${lesson.durationMinutes} ${t.lessons.minutes}</span>
            </span>
            <span class="meta-item">
              ${iconExercise()}
              <span>${exerciseCount} ${t.lessons.exercises}</span>
            </span>
            ${equipmentCount}
          </div>
        </div>
      </div>
    </a>
  `;
}

// Category breakdown bar
export function categoryBar(exercises) {
  if (!exercises || exercises.length === 0) return '';

  const totalSeconds = exercises.reduce((sum, ex) => sum + ex.durationSeconds, 0);
  const categories = {};
  exercises.forEach(ex => {
    categories[ex.category] = (categories[ex.category] || 0) + ex.durationSeconds;
  });

  const segments = Object.entries(categories).map(([cat, seconds]) => {
    const pct = (seconds / totalSeconds * 100).toFixed(1);
    return `<div class="detail-header__bar-segment" style="width:${pct}%;background:${categoryColor(cat)}" title="${t.categories[cat] || cat}: ${pct}%"></div>`;
  }).join('');

  return `<div class="detail-header__bar">${segments}</div>`;
}

// Music recommendations display
export function musicRecommendations(recommendations) {
  if (!recommendations || recommendations.length === 0) return '';

  const tempoLabels = { slow: 'איטי', medium: 'בינוני', fast: 'מהיר' };

  return `
    <div class="card music-card" style="margin-top:var(--space-4)">
      <div class="card__body">
        <h3 class="music-card__title">
          ${iconMusic()}
          <span>${t.detail.musicTitle}</span>
        </h3>
        <div class="music-list">
          ${recommendations.map(song => `
            <div class="music-item">
              <div class="music-item__info">
                <span class="music-item__title">${song.title}</span>
                <span class="music-item__artist">${song.artist}</span>
              </div>
              ${song.tempo ? `<span class="badge badge--primary">${tempoLabels[song.tempo] || song.tempo}</span>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// Skeleton loader cards
export function skeletonCards(count = 3) {
  return Array.from({ length: count }, () => `
    <div class="card">
      <div class="card__body">
        <div class="skeleton skeleton--title"></div>
        <div style="display:flex;gap:var(--space-2);margin-bottom:var(--space-3)">
          <div class="skeleton skeleton--badge"></div>
          <div class="skeleton skeleton--badge"></div>
        </div>
        <div class="skeleton skeleton--text"></div>
        <div class="skeleton skeleton--text-sm"></div>
      </div>
    </div>
  `).join('');
}

// Focus area icon mapper
export function focusIcon(iconName) {
  switch (iconName) {
    case 'core': return iconCoreFire();
    case 'flexibility': return iconWave();
    case 'strength': return iconDumbbell();
    case 'warmup': return iconSun();
    case 'rehab': return iconRehab();
    case 'coordination': return iconCoordination();
    case 'balance': return iconBalance();
    case 'cardio': return iconCardio();
    case 'posture': return iconPosture();
    default: return iconTarget();
  }
}

// Equipment icon mapper
export function equipmentIcon(iconName) {
  switch (iconName) {
    case 'bodyweight': return iconBodyweight();
    case 'mat': return iconMat();
    case 'ball': return iconBall();
    case 'band': return iconBand();
    case 'roller': return iconRoller();
    case 'weights': return iconWeights();
    case 'ring': return iconRing();
    case 'chair': return iconChair();
    case 'wall': return iconWall();
    case 'hoop': return iconHoop();
    case 'rope': return iconRope();
    case 'bench': return iconBench();
    default: return iconDumbbell();
  }
}

// Toast notification
export function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast--exit');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Loading overlay
export function showLoading() {
  const overlay = document.createElement('div');
  overlay.id = 'loading-overlay';
  overlay.className = 'loading-overlay';
  overlay.innerHTML = `
    <div class="pulse-rings">
      <div class="pulse-ring"></div>
      <div class="pulse-ring"></div>
      <div class="pulse-ring"></div>
      <div class="pulse-rings__icon">${iconCoreFire()}</div>
    </div>
    <div>
      <div class="loading-overlay__text">${t.generate.loading}</div>
      <div class="loading-overlay__sub">${t.generate.loadingSub}</div>
    </div>
  `;
  document.body.appendChild(overlay);
}

export function hideLoading() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) overlay.remove();
}
