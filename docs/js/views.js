import { t } from './i18n.js';
import {
  heroIllustration, iconTimeSaving, iconCertificate, iconBrain,
  iconArrowRight, iconChevronLeft, iconClock, iconUsers, iconExercise,
  iconInstructor, emptyStateIllustration, iconTarget,
} from './icons.js';
import {
  exerciseCard, lessonCard, categoryBar, skeletonCards,
  focusIcon, showToast, showLoading, hideLoading,
} from './components.js';
import { generateLesson, getAllLessons, getLessonById } from './api.js';

// =============================
// HOME VIEW
// =============================
export function renderHome() {
  return `
    <div class="page page-enter">
      <!-- Hero -->
      <section class="hero">
        <div class="hero__particles">
          ${Array.from({ length: 8 }, (_, i) => `
            <div class="hero__particle" style="
              inset-inline-start: ${10 + Math.random() * 80}%;
              animation-duration: ${4 + Math.random() * 6}s;
              animation-delay: ${Math.random() * 5}s;
              width: ${2 + Math.random() * 4}px;
              height: ${2 + Math.random() * 4}px;
            "></div>
          `).join('')}
        </div>
        <div class="hero__content">
          <div class="hero__illustration">${heroIllustration()}</div>
          <h1 class="hero__title">${t.hero.title}</h1>
          <p class="hero__subtitle">${t.hero.subtitle}</p>
          <a href="#/generate" class="hero__cta">
            ${iconArrowRight()}
            ${t.hero.cta}
          </a>
        </div>
      </section>

      <!-- Features -->
      <div class="container">
        <div class="features stagger-enter">
          <div class="feature-card">
            <div class="feature-card__icon feature-card__icon--time">${iconTimeSaving()}</div>
            <div class="feature-card__title">${t.features.time.title}</div>
            <div class="feature-card__desc">${t.features.time.desc}</div>
          </div>
          <div class="feature-card">
            <div class="feature-card__icon feature-card__icon--quality">${iconCertificate()}</div>
            <div class="feature-card__title">${t.features.quality.title}</div>
            <div class="feature-card__desc">${t.features.quality.desc}</div>
          </div>
          <div class="feature-card">
            <div class="feature-card__icon feature-card__icon--ai">${iconBrain()}</div>
            <div class="feature-card__title">${t.features.ai.title}</div>
            <div class="feature-card__desc">${t.features.ai.desc}</div>
          </div>
        </div>

        <!-- How it works -->
        <section class="how-it-works">
          <h2 class="section-title">${t.howItWorks.title}</h2>
          <div class="steps">
            ${t.howItWorks.steps.map((step, i) => `
              <div class="step">
                <div class="step__number">${i + 1}</div>
                <div class="step__title">${step.title}</div>
                <div class="step__desc">${step.desc}</div>
              </div>
            `).join('')}
          </div>
        </section>
      </div>
    </div>
  `;
}

// =============================
// GENERATE VIEW
// =============================
export function renderGenerate() {
  return `
    <div class="page page-enter">
      <div class="container container--narrow">
        <h1 class="section-title">${t.generate.title}</h1>
        <p class="section-subtitle" style="margin-bottom:var(--space-6)">${t.generate.subtitle}</p>

        <form id="generate-form" class="generate-form">
          <!-- Age Group -->
          <div class="card generate-card">
            <div class="card__body">
              <div class="form-group">
                <label class="form-label">${t.generate.ageLabel}</label>
                <div class="pill-group" data-field="age">
                  ${t.ageOptions.map(opt => `
                    <button type="button" class="pill" data-value="${opt.value}">${opt.label}</button>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>

          <!-- Focus Area -->
          <div class="card generate-card">
            <div class="card__body">
              <div class="form-group">
                <label class="form-label">${t.generate.focusLabel}</label>
                <div class="focus-grid" data-field="focus">
                  ${t.focusOptions.map(opt => `
                    <button type="button" class="focus-card" data-value="${opt.value}">
                      ${focusIcon(opt.icon)}
                      <span class="focus-card__label">${opt.label}</span>
                    </button>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>

          <!-- Duration -->
          <div class="card generate-card">
            <div class="card__body">
              <div class="form-group">
                <label class="form-label">${t.generate.durationLabel}</label>
                <div class="duration-selector">
                  <div class="duration-display">
                    <span id="duration-value">45</span>
                    <span class="duration-unit">${t.generate.durationUnit}</span>
                  </div>
                  <div class="pill-group" data-field="duration" style="justify-content:center">
                    ${t.durationOptions.map(d => `
                      <button type="button" class="pill ${d === 45 ? 'active' : ''}" data-value="${d}">${d} ${t.generate.durationUnit}</button>
                    `).join('')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Submit -->
          <button type="submit" class="btn btn--primary btn--lg btn--full btn--shimmer" id="generate-btn">
            ${iconArrowRight()}
            ${t.generate.submit}
          </button>
        </form>
      </div>
    </div>
  `;
}

export function initGenerate() {
  const form = document.getElementById('generate-form');
  if (!form) return;

  const state = { age: null, focus: null, duration: 45 };

  // Pill selectors
  form.querySelectorAll('.pill-group .pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const group = pill.closest('[data-field]');
      const field = group.dataset.field;
      group.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      if (field === 'age') state.age = pill.dataset.value;
      if (field === 'duration') {
        state.duration = Number(pill.dataset.value);
        document.getElementById('duration-value').textContent = state.duration;
      }
    });
  });

  // Focus cards
  form.querySelectorAll('.focus-grid .focus-card').forEach(card => {
    card.addEventListener('click', () => {
      form.querySelectorAll('.focus-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      state.focus = card.dataset.value;
    });
  });

  // Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!state.age || !state.focus) {
      showToast(t.errors.fillAll, 'error');
      return;
    }

    showLoading();

    try {
      const lesson = await generateLesson(state.age, state.focus, state.duration);
      hideLoading();
      showToast(t.toast.success, 'success');
      window.location.hash = `#/lesson/${lesson.id}`;
    } catch (err) {
      hideLoading();
      showToast(t.errors.generateFailed, 'error');
      console.error('Generate error:', err);
    }
  });
}

// =============================
// LESSONS LIST VIEW
// =============================
export function renderLessons() {
  return `
    <div class="page page-enter">
      <div class="container">
        <h1 class="section-title">${t.lessons.title}</h1>
        <div id="lessons-content">
          ${skeletonCards(3)}
        </div>
      </div>
    </div>
  `;
}

export async function initLessons() {
  const content = document.getElementById('lessons-content');
  if (!content) return;

  try {
    const lessons = await getAllLessons();

    if (lessons.length === 0) {
      content.innerHTML = `
        <div class="empty-state">
          ${emptyStateIllustration()}
          <div class="empty-state__title">${t.lessons.empty.title}</div>
          <div class="empty-state__desc">${t.lessons.empty.desc}</div>
          <a href="#/generate" class="btn btn--primary">${t.lessons.empty.cta}</a>
        </div>
      `;
      return;
    }

    content.innerHTML = `
      <div class="lessons-list stagger-enter">
        ${lessons.map(l => lessonCard(l)).join('')}
      </div>
    `;
  } catch (err) {
    content.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__title">${t.errors.loadFailed}</div>
      </div>
    `;
    console.error('Load lessons error:', err);
  }
}

// =============================
// LESSON DETAIL VIEW
// =============================
export function renderLessonDetail() {
  return `
    <div class="page page-enter">
      <div class="container container--narrow">
        <a href="#/lessons" class="back-link">
          ${iconChevronLeft()}
          ${t.detail.back}
        </a>
        <div id="detail-content">
          <div class="skeleton skeleton--card" style="height:200px;margin-bottom:var(--space-4)"></div>
          ${skeletonCards(2)}
        </div>
      </div>
    </div>
  `;
}

export async function initLessonDetail(id) {
  const content = document.getElementById('detail-content');
  if (!content) return;

  try {
    const lesson = await getLessonById(id);

    if (!lesson) {
      content.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__title">${t.detail.notFound}</div>
          <div class="empty-state__desc">${t.detail.notFoundDesc}</div>
          <a href="#/lessons" class="btn btn--secondary">${t.detail.back}</a>
        </div>
      `;
      return;
    }

    const exercises = lesson.exercises || [];
    const uniqueCategories = [...new Set(exercises.map(e => e.category))];
    const totalDuration = exercises.reduce((sum, e) => sum + e.durationSeconds, 0);
    const totalMin = Math.round(totalDuration / 60);

    content.innerHTML = `
      <!-- Header -->
      <div class="card" style="margin-bottom:var(--space-6)">
        <div class="card__body detail-header">
          <h1 class="detail-header__title">${lesson.title}</h1>
          <div class="meta-row">
            <span class="meta-item">
              ${iconUsers()}
              <span>${lesson.targetAgeGroup}</span>
            </span>
            <span class="meta-item">
              ${iconTarget()}
              <span>${t.categories[lesson.focusArea] || lesson.focusArea}</span>
            </span>
            <span class="meta-item">
              ${iconClock()}
              <span>${lesson.durationMinutes} ${t.detail.minutes}</span>
            </span>
            ${lesson.instructor ? `
              <span class="meta-item">
                ${iconInstructor()}
                <span>${lesson.instructor.name}</span>
              </span>
            ` : ''}
          </div>
          ${categoryBar(exercises)}
        </div>
      </div>

      <!-- Exercises -->
      <h2 class="section-title">${t.detail.exercisesTitle}</h2>
      <div class="timeline">
        ${exercises.map(ex => exerciseCard(ex)).join('')}
      </div>

      <!-- Summary -->
      <div class="detail-summary">
        <div class="summary-stat">
          <div class="summary-stat__value">${totalMin}</div>
          <div class="summary-stat__label">${t.detail.summary.duration}</div>
        </div>
        <div class="summary-stat">
          <div class="summary-stat__value">${exercises.length}</div>
          <div class="summary-stat__label">${t.detail.summary.exercises}</div>
        </div>
        <div class="summary-stat">
          <div class="summary-stat__value">${uniqueCategories.length}</div>
          <div class="summary-stat__label">${t.detail.summary.categories}</div>
        </div>
      </div>
    `;
  } catch (err) {
    content.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__title">${t.errors.loadFailed}</div>
      </div>
    `;
    console.error('Load detail error:', err);
  }
}
