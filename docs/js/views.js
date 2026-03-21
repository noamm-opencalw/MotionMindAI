import { t } from './i18n.js';
import {
  heroIllustration, iconTimeSaving, iconCertificate, iconBrain,
  iconArrowRight, iconChevronLeft, iconClock, iconUsers, iconExercise,
  iconInstructor, emptyStateIllustration, iconTarget,
  iconKey, iconCheck, iconTrash, iconAlert,
} from './icons.js';
import {
  exerciseCard, lessonCard, categoryBar, skeletonCards,
  focusIcon, showToast, showLoading, hideLoading,
} from './components.js';
import { generateLesson, getAllLessons, getLessonById, hasApiKey, getApiKey, setApiKey, testConnection } from './api.js';

// =============================
// HOME VIEW
// =============================
export function renderHome() {
  const hasKey = hasApiKey();

  return `
    <div class="page page-enter">
      <!-- API Key Banner -->
      ${!hasKey ? `
        <div class="container" style="margin-bottom:0">
          <a href="#/settings" class="api-banner">
            <div class="api-banner__icon">${iconAlert()}</div>
            <div class="api-banner__text">
              <strong>${t.errors.noApiKey}</strong>
            </div>
            <div class="api-banner__arrow">${iconArrowRight()}</div>
          </a>
        </div>
      ` : ''}

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
  const hasKey = hasApiKey();

  return `
    <div class="page page-enter">
      <div class="container container--narrow">
        <h1 class="section-title">${t.generate.title}</h1>
        <p class="section-subtitle" style="margin-bottom:var(--space-6)">${t.generate.subtitle}</p>

        ${!hasKey ? `
          <a href="#/settings" class="api-banner" style="margin-bottom:var(--space-4)">
            <div class="api-banner__icon">${iconAlert()}</div>
            <div class="api-banner__text">
              <strong>${t.errors.noApiKey}</strong>
            </div>
            <div class="api-banner__arrow">${iconArrowRight()}</div>
          </a>
        ` : ''}

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

    if (!hasApiKey()) {
      showToast(t.errors.noApiKey, 'error');
      setTimeout(() => { window.location.hash = '#/settings'; }, 1500);
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
      if (err.message === 'NO_API_KEY') {
        showToast(t.errors.noApiKey, 'error');
        setTimeout(() => { window.location.hash = '#/settings'; }, 1500);
      } else if (err.message === 'INVALID_API_KEY') {
        showToast(t.errors.invalidApiKey, 'error');
      } else {
        showToast(t.errors.generateFailed, 'error');
      }
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

// =============================
// SETTINGS VIEW
// =============================
export function renderSettings() {
  const currentKey = getApiKey();
  const isConnected = hasApiKey();

  return `
    <div class="page page-enter">
      <div class="container container--narrow">
        <h1 class="section-title">${t.settings.title}</h1>

        <!-- Connection Status -->
        <div class="card" style="margin-bottom:var(--space-4)">
          <div class="card__body">
            <div id="connection-status" class="settings-status ${isConnected ? 'settings-status--connected' : 'settings-status--disconnected'}">
              <div class="settings-status__dot"></div>
              <span>${isConnected ? t.settings.status.connected : t.settings.status.notConnected}</span>
            </div>
          </div>
        </div>

        <!-- API Key -->
        <div class="card" style="margin-bottom:var(--space-4)">
          <div class="card__body">
            <div class="form-group" style="margin-bottom:var(--space-4)">
              <label class="form-label">
                ${iconKey()}
                ${t.settings.apiKeyLabel}
              </label>
              <input
                type="text"
                id="api-key-input"
                class="settings-input"
                placeholder="${t.settings.apiKeyPlaceholder}"
                value="${currentKey}"
                autocomplete="off"
                dir="ltr"
                spellcheck="false"
              />
              <p class="settings-help">
                ${t.settings.apiKeyHelp}
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener">${t.settings.apiKeyLink}</a>
              </p>
            </div>

            <div style="display:flex;gap:var(--space-2);flex-wrap:wrap">
              <button type="button" id="save-key-btn" class="btn btn--primary" style="flex:1;min-width:120px">
                ${iconCheck()}
                ${t.settings.save}
              </button>
              <button type="button" id="test-key-btn" class="btn btn--secondary" style="flex:1;min-width:120px">
                ${iconArrowRight()}
                בדוק חיבור
              </button>
              ${currentKey ? `
                <button type="button" id="clear-key-btn" class="btn btn--ghost">
                  ${iconTrash()}
                  ${t.settings.clear}
                </button>
              ` : ''}
            </div>

            <!-- Test result area -->
            <div id="test-result" style="margin-top:var(--space-3);display:none"></div>
          </div>
        </div>

        <!-- Data Management -->
        <div class="card">
          <div class="card__body">
            <div class="form-group">
              <label class="form-label">${t.settings.dataTitle}</label>
              <button type="button" id="clear-data-btn" class="btn btn--ghost" style="color:var(--color-error)">
                ${iconTrash()}
                ${t.settings.clearData}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initSettings() {
  const saveBtn = document.getElementById('save-key-btn');
  const testBtn = document.getElementById('test-key-btn');
  const clearBtn = document.getElementById('clear-key-btn');
  const clearDataBtn = document.getElementById('clear-data-btn');
  const input = document.getElementById('api-key-input');
  const testResult = document.getElementById('test-result');
  const statusEl = document.getElementById('connection-status');

  // Save key
  if (saveBtn && input) {
    saveBtn.addEventListener('click', () => {
      const key = input.value.trim();
      if (key) {
        setApiKey(key);
        showToast(t.settings.saved, 'success');
        // Update status indicator inline (no reload)
        if (statusEl) {
          statusEl.className = 'settings-status settings-status--connected';
          statusEl.querySelector('span').textContent = t.settings.status.connected;
        }
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveBtn.click();
      }
    });
  }

  // Test connection
  if (testBtn && testResult) {
    testBtn.addEventListener('click', async () => {
      // Save key first if entered
      const key = input.value.trim();
      if (key) setApiKey(key);

      testResult.style.display = 'block';
      testResult.innerHTML = '<div style="color:var(--color-text-secondary);font-size:var(--text-sm)">בודק חיבור ל-Gemini AI...</div>';
      testBtn.disabled = true;

      const result = await testConnection();
      testBtn.disabled = false;

      if (result.ok) {
        testResult.innerHTML = '<div style="color:var(--color-success);font-size:var(--text-sm);font-weight:600">החיבור תקין! Gemini AI מוכן ליצירת תוכניות.</div>';
        if (statusEl) {
          statusEl.className = 'settings-status settings-status--connected';
          statusEl.querySelector('span').textContent = t.settings.status.connected;
        }
      } else {
        testResult.innerHTML = '<div style="color:var(--color-error);font-size:var(--text-sm);font-weight:600">שגיאת חיבור: ' + result.error + '<br>בדוק שהמפתח תקין ונסה שנית.</div>';
      }
    });
  }

  // Clear key
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      setApiKey('');
      if (input) input.value = '';
      showToast(t.settings.cleared, 'success');
      if (statusEl) {
        statusEl.className = 'settings-status settings-status--disconnected';
        statusEl.querySelector('span').textContent = t.settings.status.notConnected;
      }
    });
  }

  // Clear data
  if (clearDataBtn) {
    clearDataBtn.addEventListener('click', () => {
      if (confirm(t.settings.clearConfirm)) {
        localStorage.removeItem('motionmind_lessons');
        showToast(t.settings.dataCleared, 'success');
      }
    });
  }
}
