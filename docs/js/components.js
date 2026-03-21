import { t } from './i18n.js';
import {
  iconClock, iconUsers, iconExercise, iconCoach, iconTarget,
  categoryIcon, categoryColorClass, categoryColor,
  iconCoreFire, iconWave, iconDumbbell, iconSun, iconRehab, iconCoordination,
} from './icons.js';

// Exercise card for the timeline
export function exerciseCard(exercise) {
  const colorClass = categoryColorClass(exercise.category);
  const catName = t.categories[exercise.category] || exercise.category;
  const durationMin = Math.round(exercise.durationSeconds / 60);
  const durationDisplay = durationMin >= 1
    ? `${durationMin} ${t.detail.minutes}`
    : `${exercise.durationSeconds} ${t.detail.seconds}`;

  return `
    <div class="timeline-item">
      <div class="timeline-dot" style="background: ${categoryColor(exercise.category)}"></div>
      <div class="card exercise-card">
        <div class="exercise-card__header">
          <div>
            <span class="badge badge--${colorClass}">${catName}</span>
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
      </div>
    </div>
  `;
}

// Lesson card for the list view
export function lessonCard(lesson) {
  const focusColorClass = categoryColorClass(lesson.focusArea);
  const catName = t.categories[lesson.focusArea] || lesson.focusArea;
  const exerciseCount = lesson.exercises ? lesson.exercises.length : 0;

  return `
    <a href="#/lesson/${lesson.id}" class="card card--interactive card--accent-start lesson-card"
       style="border-inline-start-color: ${categoryColor(lesson.focusArea)}">
      <div class="card__body lesson-card">
        <div class="lesson-card__title">${lesson.title}</div>
        <div class="lesson-card__meta">
          <span class="badge badge--${focusColorClass}">${catName}</span>
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
    default: return iconTarget();
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
