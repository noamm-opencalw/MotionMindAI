import { t } from './i18n.js';
import {
  iconArrowRight, iconChevronLeft, iconClock, iconUsers, iconExercise,
  iconInstructor, emptyStateIllustration, iconTarget,
  iconKey, iconCheck, iconTrash, iconAlert, iconEdit, iconDumbbell,
} from './icons.js';
import {
  exerciseCard, lessonCard, categoryBar, skeletonCards,
  focusIcon, equipmentIcon, musicRecommendations,
  showToast, showLoading, hideLoading,
} from './components.js';
import {
  generateLesson, getAllLessons, getLessonById, hasApiKey, getApiKey, setApiKey,
  testConnection, regenerateExercise, updateExerciseNote, reorderExercises,
  deleteLesson, generateProgram, getAllPrograms, getProgramById, deleteProgram,
  getAllUsers, toggleUserLock, deleteUser, getUserLessonsCount, getUserProgramsCount,
} from './api.js';
import { signInWithGoogle, signInWithApple, signInAnonymously, isAdmin, isGuest, getFirstName, getTimeGreeting, getProfile } from './auth.js';

// =============================
// LOGIN VIEW
// =============================
export function renderLogin() {
  return `
    <div class="login-page">
      <div class="login-card">
        <img src="spearit_small.png" alt="${t.appName}" class="login-card__logo">
        <h1 class="login-card__title">${t.appName}</h1>
        <p class="login-card__tagline" style="font-size:0.95rem;color:var(--color-secondary);font-weight:500;margin:-4px 0 8px">${t.appTagline}</p>
        <p class="login-card__subtitle">${t.auth.loginSubtitle}</p>
        <button type="button" class="google-btn" id="google-signin-btn">
          <svg class="google-btn__icon" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          ${t.auth.loginWithGoogle}
        </button>
        <div class="login-card__divider">
          <span>או</span>
        </div>
        <button type="button" class="guest-btn" id="guest-signin-btn">
          <span class="material-symbols-outlined" style="font-size:20px">person</span>
          ${t.auth.loginAsGuest}
        </button>
      </div>
    </div>
  `;
}

export function initLogin() {
  document.getElementById('google-signin-btn')?.addEventListener('click', async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Login error:', err);
      showToast('שגיאה בהתחברות. נסה שנית.', 'error');
    }
  });
  document.getElementById('apple-signin-btn')?.addEventListener('click', async () => {
    try {
      await signInWithApple();
    } catch (err) {
      console.error('Apple login error:', err);
      showToast('כניסה עם Apple עדיין לא זמינה. נסה עם Google.', 'error');
    }
  });
  document.getElementById('guest-signin-btn')?.addEventListener('click', async () => {
    try {
      await signInAnonymously();
      window.location.reload();
    } catch (err) {
      console.error('Guest login error:', err);
      const msg = err.message?.includes('Anonymous sign-ins are disabled')
        ? 'כניסה כאורח לא מופעלת. יש להפעיל Anonymous sign-ins ב-Supabase.'
        : 'שגיאה בכניסה כאורח. נסה שנית.';
      showToast(msg, 'error');
    }
  });
}

// =============================
// LOCKED VIEW
// =============================
export function renderLocked() {
  return `
    <div class="login-page">
      <div class="login-card">
        <div class="locked-icon">
          <span class="material-symbols-outlined" style="font-size:64px;color:var(--color-error)">lock</span>
        </div>
        <h1 class="login-card__title">${t.auth.lockedTitle}</h1>
        <p class="login-card__subtitle">${t.auth.lockedDesc}</p>
        <button type="button" class="btn btn--secondary" id="locked-logout-btn">
          <span class="material-symbols-outlined" style="font-size:18px">logout</span>
          ${t.auth.logout}
        </button>
      </div>
    </div>
  `;
}

// =============================
// HOME VIEW
// =============================
export function renderHome() {
  const hasKey = hasApiKey();
  const firstName = getFirstName();
  const greeting = getTimeGreeting(firstName);
  const admin = isAdmin();

  return `
    <div class="page page-enter">
      ${!hasKey ? `
        <div class="container" style="margin-bottom:0">
          <a href="${admin ? '#/settings' : '#/'}" class="api-banner">
            <div class="api-banner__icon">${iconAlert()}</div>
            <div class="api-banner__text">
              <strong>${admin ? t.errors.noApiKey : t.errors.noApiKeyUser}</strong>
            </div>
            ${admin ? `<div class="api-banner__arrow">${iconArrowRight()}</div>` : ''}
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
          <div class="hero__logo">
            <img src="spearit.png" alt="${t.appName}" class="hero__logo-img" />
          </div>
          <div class="greeting">
            <h2 class="greeting__text" style="color:#fff">${greeting}</h2>
          </div>
          <h1 class="hero__title">${t.hero.title}</h1>
          <p class="hero__subtitle">${t.hero.subtitle}</p>
          <div class="hero__actions">
            <a href="#/generate" class="hero__cta">
              ${iconArrowRight()}
              ${t.hero.cta}
            </a>
            <a href="#/program" class="hero__cta hero__cta--secondary">
              ${iconTarget()}
              ${t.hero.ctaProgram}
            </a>
          </div>
        </div>
      </section>

      <div class="container">
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
  const admin = isAdmin();

  return `
    <div class="page page-enter">
      <div class="container container--narrow">
        <h1 class="section-title">${t.generate.title}</h1>
        <p class="section-subtitle" style="margin-bottom:var(--space-6)">${t.generate.subtitle}</p>

        ${!hasKey ? `
          <a href="${admin ? '#/settings' : '#/'}" class="api-banner" style="margin-bottom:var(--space-4)">
            <div class="api-banner__icon">${iconAlert()}</div>
            <div class="api-banner__text"><strong>${admin ? t.errors.noApiKey : t.errors.noApiKeyUser}</strong></div>
            ${admin ? `<div class="api-banner__arrow">${iconArrowRight()}</div>` : ''}
          </a>
        ` : ''}

        <form id="generate-form" class="generate-form">
          <div class="card generate-card"><div class="card__body"><div class="form-group">
            <label class="form-label">${t.generate.ageLabel}</label>
            <div class="pill-group" data-field="age">
              ${t.ageOptions.map(opt => `<button type="button" class="pill" data-value="${opt.value}">${opt.label}</button>`).join('')}
            </div>
          </div></div></div>

          <div class="card generate-card"><div class="card__body"><div class="form-group">
            <label class="form-label">${t.generate.genderLabel}</label>
            <div class="pill-group" data-field="gender">
              ${t.generate.genderOptions.map(opt => `<button type="button" class="pill" data-value="${opt.value}">${opt.label}</button>`).join('')}
            </div>
          </div></div></div>

          <div class="card generate-card"><div class="card__body"><div class="form-group">
            <label class="form-label">${iconDumbbell()} ${t.generate.equipmentLabel}</label>
            <p class="form-hint">${t.generate.equipmentHint}</p>
            <div class="equipment-grid" data-field="equipment">
              ${t.equipmentOptions.map(opt => `
                <button type="button" class="equipment-card" data-value="${opt.value}">
                  ${equipmentIcon(opt.icon)}
                  <span class="equipment-card__label">${opt.label}</span>
                </button>
              `).join('')}
            </div>
          </div></div></div>

          <div class="card generate-card"><div class="card__body"><div class="form-group">
            <label class="form-label">${t.generate.focusLabel}</label>
            <p class="form-hint">${t.generate.focusHint}</p>
            <div class="focus-grid" data-field="focus">
              ${t.focusOptions.map(opt => `
                <button type="button" class="focus-card" data-value="${opt.value}">
                  ${focusIcon(opt.icon)}
                  <span class="focus-card__label">${opt.label}</span>
                </button>
              `).join('')}
            </div>
          </div></div></div>

          <div class="card generate-card"><div class="card__body"><div class="form-group">
            <label class="form-label">${t.generate.durationLabel}</label>
            <div class="duration-selector">
              <div class="duration-display">
                <span id="duration-value">45</span>
                <span class="duration-unit">${t.generate.durationUnit}</span>
              </div>
              <div class="pill-group" data-field="duration" style="justify-content:center">
                ${t.durationOptions.map(d => `<button type="button" class="pill ${d === 45 ? 'active' : ''}" data-value="${d}">${d} ${t.generate.durationUnit}</button>`).join('')}
              </div>
            </div>
          </div></div></div>

          <button type="submit" class="btn btn--primary btn--lg btn--full btn--shimmer" id="generate-btn">
            ${iconArrowRight()} ${t.generate.submit}
          </button>
        </form>
      </div>
    </div>
  `;
}

export function initGenerate() {
  const form = document.getElementById('generate-form');
  if (!form) return;

  const state = { age: null, gender: null, equipment: [], focus: [], duration: 45 };

  form.querySelectorAll('.pill-group[data-field="age"] .pill, .pill-group[data-field="gender"] .pill, .pill-group[data-field="duration"] .pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const group = pill.closest('[data-field]');
      const field = group.dataset.field;
      group.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      if (field === 'age') state.age = pill.dataset.value;
      if (field === 'gender') state.gender = pill.dataset.value;
      if (field === 'duration') {
        state.duration = Number(pill.dataset.value);
        document.getElementById('duration-value').textContent = state.duration;
      }
    });
  });

  form.querySelectorAll('.equipment-grid .equipment-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('active');
      const value = card.dataset.value;
      if (card.classList.contains('active')) {
        if (!state.equipment.includes(value)) state.equipment.push(value);
      } else {
        state.equipment = state.equipment.filter(v => v !== value);
      }
    });
  });

  form.querySelectorAll('.focus-grid .focus-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('active');
      const value = card.dataset.value;
      if (card.classList.contains('active')) {
        if (!state.focus.includes(value)) state.focus.push(value);
      } else {
        state.focus = state.focus.filter(v => v !== value);
      }
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!state.age || state.focus.length === 0) { showToast(t.errors.fillAll, 'error'); return; }
    if (!hasApiKey()) { showToast(isAdmin() ? t.errors.noApiKey : t.errors.noApiKeyUser, 'error'); return; }

    showLoading();
    try {
      const lesson = await generateLesson({ targetAge: state.age, gender: state.gender, focusAreas: state.focus, durationMinutes: state.duration, equipment: state.equipment });
      hideLoading();
      showToast(t.toast.success, 'success');
      window.location.hash = `#/lesson/${lesson.id}`;
    } catch (err) {
      hideLoading();
      if (err.message === 'NO_API_KEY') { showToast(isAdmin() ? t.errors.noApiKey : t.errors.noApiKeyUser, 'error'); }
      else if (err.message === 'INVALID_API_KEY') { showToast(t.errors.invalidApiKey, 'error'); }
      else { showToast(t.errors.generateFailed, 'error'); }
      console.error('Generate error:', err);
    }
  });
}

// =============================
// LESSONS LIST VIEW
// =============================
export function renderLessons() {
  const title = isGuest() ? t.nav.lessonsGuest : t.lessons.title;
  return `<div class="page page-enter"><div class="container">
    <h1 class="section-title">${title}</h1>
    ${isGuest() ? `<p class="section-subtitle" style="margin-bottom:var(--space-4);color:var(--color-text-secondary)">${t.auth.guestSessionMessage}</p>` : ''}
    <div id="lessons-content">${skeletonCards(3)}</div>
  </div></div>`;
}

export async function initLessons() {
  const content = document.getElementById('lessons-content');
  if (!content) return;

  try {
    const lessons = await getAllLessons();

    if (lessons.length === 0) {
      content.innerHTML = `<div class="empty-state">${emptyStateIllustration()}<div class="empty-state__title">${t.lessons.empty.title}</div><div class="empty-state__desc">${t.lessons.empty.desc}</div><a href="#/generate" class="btn btn--primary">${t.lessons.empty.cta}</a></div>`;
      return;
    }

    content.innerHTML = `<div class="lessons-list stagger-enter">${lessons.map(l => lessonCard(l)).join('')}</div>`;

    // Bind delete buttons
    content.querySelectorAll('.lesson-delete-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm(t.lessons.deleteConfirm)) return;
        await deleteLesson(btn.dataset.lessonId);
        showToast(t.lessons.deleted, 'success');
        await initLessons();
      });
    });
  } catch (err) {
    content.innerHTML = `<div class="empty-state"><div class="empty-state__title">${t.errors.loadFailed}</div></div>`;
    console.error('Load lessons error:', err);
  }
}

// =============================
// LESSON DETAIL VIEW
// =============================
export function renderLessonDetail() {
  return `<div class="page page-enter"><div class="container container--narrow">
    <a href="#/lessons" class="back-link">${iconChevronLeft()} ${t.detail.back}</a>
    <div id="detail-content"><div class="skeleton skeleton--card" style="height:200px;margin-bottom:var(--space-4)"></div>${skeletonCards(2)}</div>
  </div></div>`;
}

export async function initLessonDetail(id) {
  const content = document.getElementById('detail-content');
  if (!content) return;

  let editMode = false;

  async function renderDetail() {
    const lesson = await getLessonById(id);
    if (!lesson) {
      content.innerHTML = `<div class="empty-state"><div class="empty-state__title">${t.detail.notFound}</div><div class="empty-state__desc">${t.detail.notFoundDesc}</div><a href="#/lessons" class="btn btn--secondary">${t.detail.back}</a></div>`;
      return;
    }

    const exercises = lesson.exercises || [];
    const uniqueCategories = [...new Set(exercises.map(e => e.category))];
    const totalDuration = exercises.reduce((sum, e) => sum + e.durationSeconds, 0);
    const totalMin = Math.round(totalDuration / 60);

    const focusAreas = lesson.focusAreas || (lesson.focusArea ? [lesson.focusArea] : []);
    const focusBadges = focusAreas.length > 0
      ? focusAreas.map(fa => t.categories[fa] || fa).join(' · ')
      : '';

    const equipmentDisplay = lesson.equipment && lesson.equipment.length > 0
      ? `<span class="meta-item">${iconDumbbell()}<span>${lesson.equipment.join(', ')}</span></span>` : '';

    content.innerHTML = `
      <div class="card" style="margin-bottom:var(--space-6)"><div class="card__body detail-header">
        <h1 class="detail-header__title">${lesson.title || ''}</h1>
        <div class="meta-row">
          ${lesson.targetAgeGroup ? `<span class="meta-item">${iconUsers()}<span>${lesson.targetAgeGroup}</span></span>` : ''}
          ${focusBadges ? `<span class="meta-item">${iconTarget()}<span>${focusBadges}</span></span>` : ''}
          ${lesson.durationMinutes ? `<span class="meta-item">${iconClock()}<span>${lesson.durationMinutes} ${t.detail.minutes}</span></span>` : ''}
          ${equipmentDisplay}
          ${lesson.instructor ? `<span class="meta-item">${iconInstructor()}<span>${lesson.instructor.name}</span></span>` : ''}
        </div>
        ${categoryBar(exercises)}
      </div></div>

      <div class="detail-edit-toggle">
        <h2 class="section-title" style="margin-bottom:0">${t.detail.exercisesTitle}</h2>
        ${!isGuest() ? `<button type="button" class="btn btn--secondary btn--sm" id="toggle-edit-btn">
          ${editMode ? iconCheck() : iconEdit()} ${editMode ? t.detail.doneEditing : t.detail.editExercises}
        </button>` : ''}
      </div>

      <div class="timeline" id="exercises-timeline">
        ${exercises.map((ex, i) => exerciseCard(ex, i, exercises.length, editMode)).join('')}
      </div>

      ${musicRecommendations(lesson.musicRecommendations)}

      <div class="detail-summary">
        <div class="summary-stat"><div class="summary-stat__value">${totalMin}</div><div class="summary-stat__label">${t.detail.summary.duration}</div></div>
        <div class="summary-stat"><div class="summary-stat__value">${exercises.length}</div><div class="summary-stat__label">${t.detail.summary.exercises}</div></div>
        <div class="summary-stat"><div class="summary-stat__value">${uniqueCategories.length}</div><div class="summary-stat__label">${t.detail.summary.categories}</div></div>
      </div>
    `;

    document.getElementById('toggle-edit-btn')?.addEventListener('click', () => { editMode = !editMode; renderDetail(); });
    if (editMode) bindEditActions(id, renderDetail);
  }

  try { await renderDetail(); }
  catch (err) { content.innerHTML = `<div class="empty-state"><div class="empty-state__title">${t.errors.loadFailed}</div></div>`; console.error('Load detail error:', err); }
}

function bindEditActions(lessonId, renderDetail) {
  document.querySelectorAll('.exercise-move-up').forEach(btn => {
    btn.addEventListener('click', async () => {
      const items = [...document.querySelectorAll('.timeline-item')];
      const ids = items.map(item => Number(item.dataset.exerciseId));
      const idx = ids.indexOf(Number(btn.dataset.exerciseId));
      if (idx > 0) { [ids[idx], ids[idx - 1]] = [ids[idx - 1], ids[idx]]; await reorderExercises(lessonId, ids); showToast(t.toast.lessonUpdated, 'success'); await renderDetail(); }
    });
  });

  document.querySelectorAll('.exercise-move-down').forEach(btn => {
    btn.addEventListener('click', async () => {
      const items = [...document.querySelectorAll('.timeline-item')];
      const ids = items.map(item => Number(item.dataset.exerciseId));
      const idx = ids.indexOf(Number(btn.dataset.exerciseId));
      if (idx < ids.length - 1) { [ids[idx], ids[idx + 1]] = [ids[idx + 1], ids[idx]]; await reorderExercises(lessonId, ids); showToast(t.toast.lessonUpdated, 'success'); await renderDetail(); }
    });
  });

  document.querySelectorAll('.exercise-note-input').forEach(textarea => {
    textarea.addEventListener('blur', async () => { await updateExerciseNote(lessonId, textarea.dataset.exerciseId, textarea.value.trim()); });
  });

  document.querySelectorAll('.exercise-regenerate').forEach(btn => {
    btn.addEventListener('click', async () => {
      const exerciseId = btn.dataset.exerciseId;
      const textarea = btn.closest('.exercise-card__edit-actions')?.querySelector('.exercise-note-input');
      const note = textarea?.value.trim() || 'צור תרגיל חלופי דומה';
      btn.disabled = true; btn.innerHTML = t.detail.regenerating;
      try {
        await updateExerciseNote(lessonId, exerciseId, note);
        await regenerateExercise(lessonId, exerciseId, note);
        showToast(t.toast.exerciseRegenerated, 'success'); await renderDetail();
      } catch (err) { showToast(t.errors.regenerateFailed, 'error'); btn.disabled = false; console.error('Regenerate error:', err); }
    });
  });
}

// =============================
// TRAINING PROGRAM - CREATE
// =============================
export function renderProgramCreate() {
  const hasKey = hasApiKey();
  const admin = isAdmin();

  return `
    <div class="page page-enter"><div class="container container--narrow">
      <h1 class="section-title">${t.program.title}</h1>
      <p class="section-subtitle" style="margin-bottom:var(--space-6)">${t.program.subtitle}</p>

      ${!hasKey ? `<a href="${admin ? '#/settings' : '#/'}" class="api-banner" style="margin-bottom:var(--space-4)"><div class="api-banner__icon">${iconAlert()}</div><div class="api-banner__text"><strong>${admin ? t.errors.noApiKey : t.errors.noApiKeyUser}</strong></div>${admin ? `<div class="api-banner__arrow">${iconArrowRight()}</div>` : ''}</a>` : ''}

      <form id="program-form" class="generate-form">
        <!-- Goal -->
        <div class="card generate-card"><div class="card__body"><div class="form-group">
          <label class="form-label">${iconTarget()} ${t.program.goalLabel}</label>
          <div class="pill-group pill-group--wrap" data-field="goal">
            ${t.program.goals.map(g => `<button type="button" class="pill" data-value="${g.value}">${g.label}</button>`).join('')}
          </div>
          <div style="margin-top:var(--space-3)">
            <label class="form-label-sm">${t.program.goalCustomLabel}</label>
            <input type="text" id="goal-custom" class="settings-input" style="font-family:var(--font-family);direction:rtl;text-align:right" placeholder="${t.program.goalPlaceholder}" />
          </div>
        </div></div></div>

        <!-- Timeframe -->
        <div class="card generate-card"><div class="card__body"><div class="form-group">
          <label class="form-label">${iconClock()} ${t.program.timeframeLabel}</label>
          <div class="pill-group" data-field="timeframe">
            ${t.program.timeframes.map(tf => `<button type="button" class="pill" data-value="${tf.value}">${tf.label}</button>`).join('')}
          </div>
        </div></div></div>

        <!-- Gender & Age -->
        <div class="card generate-card"><div class="card__body"><div class="form-group">
          <label class="form-label">${t.program.genderLabel}</label>
          <div class="pill-group" data-field="gender">
            ${t.program.genders.map(g => `<button type="button" class="pill" data-value="${g.value}">${g.label}</button>`).join('')}
          </div>
          <div style="display:flex;gap:var(--space-3);margin-top:var(--space-3)">
            <div style="flex:1"><label class="form-label-sm">${t.program.ageLabel}</label><input type="number" id="program-age" class="settings-input" placeholder="${t.program.agePlaceholder}" style="font-family:var(--font-family);direction:ltr" /></div>
            <div style="flex:1"><label class="form-label-sm">${t.program.weightLabel}</label><input type="number" id="program-weight" class="settings-input" placeholder="${t.program.weightPlaceholder}" style="font-family:var(--font-family);direction:ltr" /></div>
          </div>
        </div></div></div>

        <!-- Fitness Level -->
        <div class="card generate-card"><div class="card__body"><div class="form-group">
          <label class="form-label">${t.program.fitnessLevelLabel}</label>
          <div class="pill-group pill-group--wrap" data-field="fitnessLevel">
            ${t.program.fitnessLevels.map(fl => `<button type="button" class="pill" data-value="${fl.value}">${fl.label}</button>`).join('')}
          </div>
        </div></div></div>

        <!-- Location -->
        <div class="card generate-card"><div class="card__body"><div class="form-group">
          <label class="form-label">${t.program.locationLabel}</label>
          <div class="pill-group" data-field="location">
            ${t.program.locations.map(l => `<button type="button" class="pill" data-value="${l.value}">${l.label}</button>`).join('')}
          </div>
        </div></div></div>

        <!-- Equipment -->
        <div class="card generate-card"><div class="card__body"><div class="form-group">
          <label class="form-label">${iconDumbbell()} ${t.program.equipmentLabel}</label>
          <div class="equipment-grid" data-field="equipment">
            ${t.equipmentOptions.map(opt => `<button type="button" class="equipment-card" data-value="${opt.value}">${equipmentIcon(opt.icon)}<span class="equipment-card__label">${opt.label}</span></button>`).join('')}
          </div>
        </div></div></div>

        <!-- Schedule -->
        <div class="card generate-card"><div class="card__body"><div class="form-group">
          <label class="form-label">${t.program.daysPerWeekLabel}</label>
          <div class="pill-group" data-field="daysPerWeek" style="justify-content:center">
            ${[2,3,4,5,6].map(d => `<button type="button" class="pill ${d === 4 ? 'active' : ''}" data-value="${d}">${d}</button>`).join('')}
          </div>
          <div style="margin-top:var(--space-3)">
            <label class="form-label-sm">${t.program.sessionDurationLabel}</label>
            <div class="pill-group" data-field="sessionDuration" style="justify-content:center">
              ${[30,45,60,75,90].map(d => `<button type="button" class="pill ${d === 60 ? 'active' : ''}" data-value="${d}">${d} ${t.generate.durationUnit}</button>`).join('')}
            </div>
          </div>
        </div></div></div>

        <!-- Limitations -->
        <div class="card generate-card"><div class="card__body"><div class="form-group">
          <label class="form-label">${t.program.limitationsLabel}</label>
          <textarea id="program-limitations" class="settings-input" style="font-family:var(--font-family);direction:rtl;text-align:right;min-height:60px;resize:vertical" placeholder="${t.program.limitationsPlaceholder}"></textarea>
        </div></div></div>

        <button type="submit" class="btn btn--primary btn--lg btn--full btn--shimmer" id="program-btn">
          ${iconArrowRight()} ${t.program.submit}
        </button>
      </form>
    </div></div>
  `;
}

export function initProgramCreate() {
  const form = document.getElementById('program-form');
  if (!form) return;

  const state = { goal: null, timeframe: null, gender: null, fitnessLevel: null, location: null, equipment: [], daysPerWeek: 4, sessionDuration: 60 };

  // Single-select pills
  ['goal', 'timeframe', 'gender', 'fitnessLevel', 'location'].forEach(field => {
    form.querySelectorAll(`.pill-group[data-field="${field}"] .pill`).forEach(pill => {
      pill.addEventListener('click', () => {
        pill.closest('[data-field]').querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state[field] = pill.dataset.value;
      });
    });
  });

  // Numeric pills
  ['daysPerWeek', 'sessionDuration'].forEach(field => {
    form.querySelectorAll(`.pill-group[data-field="${field}"] .pill`).forEach(pill => {
      pill.addEventListener('click', () => {
        pill.closest('[data-field]').querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state[field] = Number(pill.dataset.value);
      });
    });
  });

  // Equipment multi-select
  form.querySelectorAll('.equipment-grid .equipment-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('active');
      const value = card.dataset.value;
      if (card.classList.contains('active')) { if (!state.equipment.includes(value)) state.equipment.push(value); }
      else { state.equipment = state.equipment.filter(v => v !== value); }
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!state.goal || !state.timeframe || !state.gender || !state.fitnessLevel) { showToast(t.errors.programFillAll, 'error'); return; }
    if (!hasApiKey()) { showToast(isAdmin() ? t.errors.noApiKey : t.errors.noApiKeyUser, 'error'); return; }

    showLoading();
    try {
      const program = await generateProgram({
        ...state,
        goalCustom: document.getElementById('goal-custom')?.value.trim() || '',
        age: document.getElementById('program-age')?.value.trim() || '',
        weight: document.getElementById('program-weight')?.value.trim() || '',
        limitations: document.getElementById('program-limitations')?.value.trim() || '',
      });
      hideLoading();
      showToast(t.toast.programCreated, 'success');
      window.location.hash = `#/program/${program.id}`;
    } catch (err) {
      hideLoading();
      if (err.message === 'NO_API_KEY') { showToast(isAdmin() ? t.errors.noApiKey : t.errors.noApiKeyUser, 'error'); }
      else if (err.message === 'INVALID_API_KEY') { showToast(t.errors.invalidApiKey, 'error'); }
      else { showToast(t.errors.programFailed, 'error'); }
      console.error('Program error:', err);
    }
  });
}

// =============================
// TRAINING PROGRAMS LIST
// =============================
export function renderPrograms() {
  return `<div class="page page-enter"><div class="container">
    <h1 class="section-title">${t.program.listTitle}</h1>
    <div id="programs-content">${skeletonCards(3)}</div>
  </div></div>`;
}

export async function initPrograms() {
  const content = document.getElementById('programs-content');
  if (!content) return;

  try {
    const programs = await getAllPrograms();

    if (programs.length === 0) {
      content.innerHTML = `<div class="empty-state">${emptyStateIllustration()}<div class="empty-state__title">${t.program.empty.title}</div><div class="empty-state__desc">${t.program.empty.desc}</div><a href="#/program" class="btn btn--primary">${t.program.empty.cta}</a></div>`;
      return;
    }

    content.innerHTML = `<div class="lessons-list stagger-enter">${programs.map(p => {
      const goalLabel = t.program.goals.find(g => g.value === p.params?.goal)?.label || p.params?.goal || '';
      const timeLabel = t.program.timeframes.find(tf => tf.value === p.params?.timeframe)?.label || '';
      return `
        <div class="card card--interactive card--accent-start lesson-card" style="border-inline-start-color:var(--color-secondary);position:relative">
          <a href="#/program/${p.id}" class="card__body lesson-card" style="text-decoration:none;color:inherit">
            <div class="lesson-card__title">${p.title || 'תוכנית אימונים'}</div>
            <div class="lesson-card__meta">
              <span class="badge badge--primary">${goalLabel}</span>
              <span class="badge badge--flexibility">${timeLabel}</span>
            </div>
            <div class="lesson-card__footer">
              <div class="lesson-card__stats">
                <span class="meta-item">${iconClock()}<span>${p.totalWeeks} ${t.program.weeks}</span></span>
                <span class="meta-item">${iconExercise()}<span>${p.daysPerWeek} ${t.program.sessionsPerWeek}</span></span>
              </div>
            </div>
          </a>
          <button type="button" class="lesson-delete-btn program-delete-btn" data-program-id="${p.id}" title="מחק">${iconTrash()}</button>
        </div>
      `;
    }).join('')}</div>`;

    content.querySelectorAll('.program-delete-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm(t.program.deleteConfirm)) return;
        await deleteProgram(btn.dataset.programId);
        showToast(t.program.deleted, 'success');
        await initPrograms();
      });
    });
  } catch (err) {
    content.innerHTML = `<div class="empty-state"><div class="empty-state__title">${t.errors.loadFailed}</div></div>`;
    console.error('Load programs error:', err);
  }
}

// =============================
// TRAINING PROGRAM DETAIL
// =============================
export function renderProgramDetail() {
  return `<div class="page page-enter"><div class="container container--narrow">
    <a href="#/programs" class="back-link">${iconChevronLeft()} ${t.program.backToPrograms}</a>
    <div id="program-detail-content"><div class="skeleton skeleton--card" style="height:200px;margin-bottom:var(--space-4)"></div>${skeletonCards(3)}</div>
  </div></div>`;
}

export async function initProgramDetail(id) {
  const content = document.getElementById('program-detail-content');
  if (!content) return;

  const program = await getProgramById(id);
  if (!program) {
    content.innerHTML = `<div class="empty-state"><div class="empty-state__title">${t.detail.notFound}</div><a href="#/programs" class="btn btn--secondary">${t.program.backToPrograms}</a></div>`;
    return;
  }

  const goalLabel = t.program.goals.find(g => g.value === program.params?.goal)?.label || program.params?.goal || '';
  const timeLabel = t.program.timeframes.find(tf => tf.value === program.params?.timeframe)?.label || '';
  const intensityColors = { low: 'var(--color-success)', moderate: 'var(--color-warmup)', high: 'var(--color-core)', 'very-high': '#DC2626' };
  const intensityLabels = { low: 'נמוכה', moderate: 'בינונית', high: 'גבוהה', 'very-high': 'גבוהה מאוד' };
  const dayNames = ['', 'ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

  content.innerHTML = `
    <!-- Header -->
    <div class="card" style="margin-bottom:var(--space-6)"><div class="card__body detail-header">
      <h1 class="detail-header__title">${program.title}</h1>
      <p style="color:var(--color-text-secondary);font-size:var(--text-sm);margin-top:var(--space-2)">${program.description || ''}</p>
      <div class="meta-row" style="margin-top:var(--space-3)">
        <span class="badge badge--primary">${goalLabel}</span>
        <span class="badge badge--flexibility">${timeLabel}</span>
        <span class="meta-item">${iconClock()}<span>${program.totalWeeks} ${t.program.weeks}</span></span>
        <span class="meta-item">${iconExercise()}<span>${program.daysPerWeek} ${t.program.sessionsPerWeek}</span></span>
      </div>
    </div></div>

    <!-- Phases -->
    ${program.phases && program.phases.length > 0 ? `
      <h2 class="section-title">${t.program.overview}</h2>
      <div class="program-phases">
        ${program.phases.map(phase => `
          <div class="program-phase" style="border-inline-start-color:${intensityColors[phase.intensity] || 'var(--color-primary)'}">
            <div class="program-phase__header">
              <strong>${phase.name}</strong>
              <span class="badge badge--primary">${t.program.weekLabel} ${phase.weekStart}-${phase.weekEnd}</span>
              <span class="badge" style="background:${intensityColors[phase.intensity] || 'var(--color-primary)'}20;color:${intensityColors[phase.intensity] || 'var(--color-primary)'}">${intensityLabels[phase.intensity] || phase.intensity}</span>
            </div>
            <p class="program-phase__focus">${phase.focus}</p>
          </div>
        `).join('')}
      </div>
    ` : ''}

    <!-- Weeks -->
    <h2 class="section-title" style="margin-top:var(--space-6)">${t.program.weekLabel} ${t.program.weekLabel}</h2>
    <div class="program-weeks" id="program-weeks">
      ${(program.weeks || []).map(week => `
        <div class="program-week">
          <button type="button" class="program-week__header" data-week="${week.weekNumber}">
            <span class="program-week__title">${t.program.weekLabel} ${week.weekNumber}</span>
            <span class="program-week__theme">${week.theme || ''}</span>
            <span class="program-week__toggle">▼</span>
          </button>
          <div class="program-week__body" data-week-body="${week.weekNumber}" style="display:${week.weekNumber === 1 ? 'block' : 'none'}">
            ${(week.days || []).map(day => `
              <div class="program-day ${day.type === 'rest' ? 'program-day--rest' : day.type === 'active-recovery' ? 'program-day--recovery' : ''}">
                <div class="program-day__header">
                  <span class="program-day__name">${t.program.dayLabel} ${dayNames[day.dayNumber] || day.dayNumber}</span>
                  ${day.type === 'rest' ? `<span class="badge badge--cooldown">${t.program.restDay}</span>` :
                    day.type === 'active-recovery' ? `<span class="badge badge--warmup">שחרור פעיל</span>` : ''}
                  ${day.duration ? `<span class="meta-item">${iconClock()}<span>${day.duration} ${t.detail.minutes}</span></span>` : ''}
                </div>
                ${day.title ? `<div class="program-day__title">${day.title}</div>` : ''}
                ${day.focus ? `<div class="program-day__focus">${day.focus}</div>` : ''}
                ${day.exercises && day.exercises.length > 0 ? `
                  <div class="program-day__exercises">
                    <table class="exercise-table">
                      <thead><tr><th>תרגיל</th><th>סטים</th><th>חזרות</th><th>מנוחה</th></tr></thead>
                      <tbody>
                        ${day.exercises.map(ex => `
                          <tr>
                            <td><strong>${ex.name}</strong>${ex.notes ? `<div class="exercise-table__notes">${ex.notes}</div>` : ''}</td>
                            <td class="ltr-content">${ex.sets || ''}</td>
                            <td class="ltr-content">${ex.reps || ''}</td>
                            <td class="ltr-content">${ex.rest || ''}</td>
                          </tr>
                        `).join('')}
                      </tbody>
                    </table>
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Nutrition -->
    ${program.nutrition ? `
      <div class="card" style="margin-top:var(--space-6)"><div class="card__body">
        <h3 class="music-card__title" style="margin-bottom:var(--space-3)">🍎 <span>המלצות תזונה</span></h3>
        ${program.nutrition.calories ? `<p style="font-size:var(--text-sm);margin-bottom:var(--space-1)"><strong>קלוריות:</strong> ${program.nutrition.calories}</p>` : ''}
        ${program.nutrition.protein ? `<p style="font-size:var(--text-sm);margin-bottom:var(--space-2)"><strong>חלבון:</strong> ${program.nutrition.protein}</p>` : ''}
        ${program.nutrition.tips ? `<ul style="font-size:var(--text-sm);color:var(--color-text-secondary);padding-inline-start:var(--space-4);margin:0">${program.nutrition.tips.map(tip => `<li style="margin-bottom:var(--space-1)">${tip}</li>`).join('')}</ul>` : ''}
      </div></div>
    ` : ''}

    <!-- Tips -->
    ${program.tips && program.tips.length > 0 ? `
      <div class="card" style="margin-top:var(--space-4)"><div class="card__body">
        <h3 class="music-card__title" style="margin-bottom:var(--space-3)">💡 <span>טיפים</span></h3>
        <ul style="font-size:var(--text-sm);color:var(--color-text-secondary);padding-inline-start:var(--space-4);margin:0">${program.tips.map(tip => `<li style="margin-bottom:var(--space-1)">${tip}</li>`).join('')}</ul>
      </div></div>
    ` : ''}
  `;

  // Accordion toggle for weeks
  content.querySelectorAll('.program-week__header').forEach(header => {
    header.addEventListener('click', () => {
      const weekNum = header.dataset.week;
      const body = content.querySelector(`[data-week-body="${weekNum}"]`);
      const toggle = header.querySelector('.program-week__toggle');
      if (body.style.display === 'none') { body.style.display = 'block'; toggle.textContent = '▲'; }
      else { body.style.display = 'none'; toggle.textContent = '▼'; }
    });
  });
}

// =============================
// SETTINGS VIEW (Admin Only)
// =============================
export function renderSettings() {
  const currentKey = getApiKey();
  const isConnected = hasApiKey();

  return `
    <div class="page page-enter"><div class="container container--narrow">
      <h1 class="section-title">${t.settings.title}</h1>

      <!-- API Key -->
      <div class="card" style="margin-bottom:var(--space-4)"><div class="card__body">
        <div id="connection-status" class="settings-status ${isConnected ? 'settings-status--connected' : 'settings-status--disconnected'}">
          <div class="settings-status__dot"></div>
          <span>${isConnected ? t.settings.status.connected : t.settings.status.notConnected}</span>
        </div>
      </div></div>
      <div class="card" style="margin-bottom:var(--space-4)"><div class="card__body">
        <div class="form-group" style="margin-bottom:var(--space-4)">
          <label class="form-label">${iconKey()} ${t.settings.apiKeyLabel}</label>
          <input type="text" id="api-key-input" class="settings-input" placeholder="${t.settings.apiKeyPlaceholder}" value="${currentKey}" autocomplete="off" dir="ltr" spellcheck="false" />
          <p class="settings-help">${t.settings.apiKeyHelp} <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener">${t.settings.apiKeyLink}</a></p>
        </div>
        <div style="display:flex;gap:var(--space-2);flex-wrap:wrap">
          <button type="button" id="save-key-btn" class="btn btn--primary" style="flex:1;min-width:120px">${iconCheck()} ${t.settings.save}</button>
          <button type="button" id="test-key-btn" class="btn btn--secondary" style="flex:1;min-width:120px">${iconArrowRight()} בדוק חיבור</button>
          ${currentKey ? `<button type="button" id="clear-key-btn" class="btn btn--ghost">${iconTrash()} ${t.settings.clear}</button>` : ''}
        </div>
        <div id="test-result" style="margin-top:var(--space-3);display:none"></div>
      </div></div>

      <!-- Admin: User Management -->
      <div class="card"><div class="card__body">
        <h2 class="section-title" style="margin-bottom:var(--space-4)">${t.admin.usersTitle}</h2>
        <div id="admin-users-content">
          <div class="skeleton skeleton--text"></div>
          <div class="skeleton skeleton--text-sm"></div>
        </div>
      </div></div>
    </div></div>
  `;
}

export async function initSettings() {
  // API Key management
  const saveBtn = document.getElementById('save-key-btn');
  const testBtn = document.getElementById('test-key-btn');
  const clearBtn = document.getElementById('clear-key-btn');
  const input = document.getElementById('api-key-input');
  const testResult = document.getElementById('test-result');
  const statusEl = document.getElementById('connection-status');

  if (saveBtn && input) {
    saveBtn.addEventListener('click', async () => {
      const key = input.value.trim();
      if (key) {
        try {
          await setApiKey(key);
          showToast(t.settings.saved, 'success');
          if (statusEl) { statusEl.className = 'settings-status settings-status--connected'; statusEl.querySelector('span').textContent = t.settings.status.connected; }
        } catch (err) {
          showToast('שגיאה בשמירת המפתח', 'error');
          console.error('Save key error:', err);
        }
      }
    });
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); saveBtn.click(); } });
  }

  if (testBtn && testResult) {
    testBtn.addEventListener('click', async () => {
      const key = input.value.trim();
      if (key) {
        try { await setApiKey(key); } catch (err) { /* ignore */ }
      }
      testResult.style.display = 'block';
      testResult.innerHTML = '<div style="color:var(--color-text-secondary);font-size:var(--text-sm)">בודק חיבור...</div>';
      testBtn.disabled = true;
      const result = await testConnection();
      testBtn.disabled = false;
      if (result.ok) { testResult.innerHTML = '<div style="color:var(--color-success);font-size:var(--text-sm);font-weight:600">החיבור תקין!</div>'; if (statusEl) { statusEl.className = 'settings-status settings-status--connected'; statusEl.querySelector('span').textContent = t.settings.status.connected; } }
      else { testResult.innerHTML = '<div style="color:var(--color-error);font-size:var(--text-sm);font-weight:600">שגיאת חיבור: ' + result.error + '</div>'; }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', async () => {
      try {
        await setApiKey('');
        if (input) input.value = '';
        showToast(t.settings.cleared, 'success');
        if (statusEl) { statusEl.className = 'settings-status settings-status--disconnected'; statusEl.querySelector('span').textContent = t.settings.status.notConnected; }
      } catch (err) {
        console.error('Clear key error:', err);
      }
    });
  }

  // Admin: Load users
  await loadAdminUsers();
}

async function loadAdminUsers() {
  const container = document.getElementById('admin-users-content');
  if (!container) return;

  try {
    const users = await getAllUsers();
    const currentProfile = getProfile();

    if (users.length === 0) {
      container.innerHTML = `<p style="color:var(--color-text-secondary);font-size:var(--text-sm)">${t.admin.noUsers}</p>`;
      return;
    }

    // Get counts for each user
    const usersWithCounts = await Promise.all(users.map(async (user) => {
      const lessonsCount = await getUserLessonsCount(user.id);
      const programsCount = await getUserProgramsCount(user.id);
      return { ...user, lessonsCount, programsCount };
    }));

    container.innerHTML = `
      <div class="admin-users">
        ${usersWithCounts.map(user => `
          <div class="admin-user-card ${user.is_locked ? 'admin-user-card--locked' : ''}">
            <img src="${user.avatar_url || 'spearit_nobg.png'}" alt="${user.full_name}" class="admin-user-card__avatar" referrerpolicy="no-referrer">
            <div class="admin-user-card__info">
              <div class="admin-user-card__name">
                ${user.full_name || user.email}
                ${user.role === 'admin' ? `<span class="badge badge--primary" style="font-size:var(--text-xs);margin-inline-start:var(--space-1)">${t.admin.roleAdmin}</span>` : ''}
                ${user.is_locked ? `<span class="badge badge--cooldown" style="font-size:var(--text-xs);margin-inline-start:var(--space-1)">${t.admin.statusLocked}</span>` : ''}
              </div>
              <div class="admin-user-card__email">${user.email}</div>
              <div class="admin-user-card__stats">
                ${user.lessonsCount} ${t.admin.userLessons} · ${user.programsCount} ${t.admin.userPrograms}
              </div>
            </div>
            ${user.id !== currentProfile?.id ? `
              <div class="admin-user-card__actions">
                <button type="button" class="btn btn--ghost btn--sm admin-lock-btn" data-user-id="${user.id}" data-locked="${user.is_locked}">
                  <span class="material-symbols-outlined" style="font-size:16px">${user.is_locked ? 'lock_open' : 'lock'}</span>
                  ${user.is_locked ? t.admin.unlockUser : t.admin.lockUser}
                </button>
                <button type="button" class="btn btn--ghost btn--sm admin-delete-btn" data-user-id="${user.id}" style="color:var(--color-error)">
                  ${iconTrash()} ${t.admin.deleteUser}
                </button>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `;

    // Bind admin actions
    container.querySelectorAll('.admin-lock-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const userId = btn.dataset.userId;
        const currentlyLocked = btn.dataset.locked === 'true';
        try {
          await toggleUserLock(userId, !currentlyLocked);
          showToast(currentlyLocked ? t.admin.userUnlocked : t.admin.userLocked, 'success');
          await loadAdminUsers();
        } catch (err) {
          console.error('Lock/unlock error:', err);
        }
      });
    });

    container.querySelectorAll('.admin-delete-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm(t.admin.deleteUserConfirm)) return;
        try {
          await deleteUser(btn.dataset.userId);
          showToast(t.admin.userDeleted, 'success');
          await loadAdminUsers();
        } catch (err) {
          console.error('Delete user error:', err);
        }
      });
    });
  } catch (err) {
    container.innerHTML = `<p style="color:var(--color-error);font-size:var(--text-sm)">שגיאה בטעינת משתמשים</p>`;
    console.error('Load users error:', err);
  }
}
