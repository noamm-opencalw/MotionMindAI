import { t } from './i18n.js';
import { iconHome, iconSparkle, iconList, iconSettings, iconTarget, iconNotifications } from './icons.js';
import { initAuth, onAuthStateChange, signOut, isLoggedIn, isAdmin, isGuest, isLocked, getProfile, getFirstName, getTimeGreeting } from './auth.js';
import { loadApiKey } from './api.js';
import {
  renderHome,
  renderGenerate, initGenerate,
  renderLessons, initLessons,
  renderLessonDetail, initLessonDetail,
  renderProgramCreate, initProgramCreate,
  renderPrograms, initPrograms,
  renderProgramDetail, initProgramDetail,
  renderSettings, initSettings,
  renderLogin, initLogin,
  renderLocked,
} from './views.js';

// =============================
// ROUTER
// =============================
const routes = [
  { pattern: /^#?\/?$/, view: 'home' },
  { pattern: /^#\/generate$/, view: 'generate' },
  { pattern: /^#\/lessons$/, view: 'lessons' },
  { pattern: /^#\/lesson\/([\w-]+)$/, view: 'detail' },
  { pattern: /^#\/program$/, view: 'programCreate' },
  { pattern: /^#\/programs$/, view: 'programs' },
  { pattern: /^#\/program\/(\d+)$/, view: 'programDetail' },
  { pattern: /^#\/settings$/, view: 'settings' },
];

function matchRoute(hash) {
  const h = hash || '#/';
  for (const route of routes) {
    const match = h.match(route.pattern);
    if (match) return { view: route.view, params: match.slice(1) };
  }
  return { view: 'home', params: [] };
}

async function navigate() {
  if (!isLoggedIn()) return;

  const { view, params } = matchRoute(window.location.hash);
  const app = document.getElementById('app');

  // Settings is admin-only
  if (view === 'settings' && !isAdmin()) {
    window.location.hash = '#/';
    return;
  }

  switch (view) {
    case 'home':
      app.innerHTML = renderHome();
      break;
    case 'generate':
      app.innerHTML = renderGenerate();
      initGenerate();
      break;
    case 'lessons':
      app.innerHTML = renderLessons();
      await initLessons();
      break;
    case 'detail':
      app.innerHTML = renderLessonDetail();
      await initLessonDetail(params[0]);
      break;
    case 'programCreate':
      app.innerHTML = renderProgramCreate();
      initProgramCreate();
      break;
    case 'programs':
      app.innerHTML = renderPrograms();
      await initPrograms();
      break;
    case 'programDetail':
      app.innerHTML = renderProgramDetail();
      await initProgramDetail(params[0]);
      break;
    case 'settings':
      app.innerHTML = renderSettings();
      await initSettings();
      break;
  }

  updateNav(view);
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function updateNav(activeView) {
  document.querySelectorAll('.bottom-nav__item').forEach(item => {
    item.classList.toggle('active', item.dataset.view === activeView);
  });
  document.querySelectorAll('.header__nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.view === activeView);
  });
  const backBtn = document.querySelector('.header__back');
  if (backBtn) {
    backBtn.style.display = activeView === 'home' ? 'none' : '';
  }
}

// =============================
// APP SHELL
// =============================
function createAppShell() {
  const profile = getProfile();
  const header = document.querySelector('.header__inner');
  if (header) {
    header.innerHTML = `
      <div class="header__actions">
        <div class="header__user-menu">
          <button class="header__avatar-btn" id="user-menu-btn" type="button">
            <img src="${profile?.avatar_url || 'spearit_small.png'}" alt="${profile?.full_name || t.appName}" referrerpolicy="no-referrer">
          </button>
          <div class="header__dropdown" id="user-dropdown" style="display:none">
            <div class="header__dropdown-info">
              <div class="header__dropdown-name">${profile?.full_name || ''}</div>
              <div class="header__dropdown-email">${profile?.email || ''}</div>
            </div>
            <button type="button" class="header__dropdown-item header__dropdown-item--danger" id="logout-btn">
              <span class="material-symbols-outlined" style="font-size:18px">logout</span>
              ${t.auth.logout}
            </button>
          </div>
        </div>
      </div>
      <a href="#/" class="header__logo" style="text-decoration:none">
        <img src="spearit.png" alt="${t.appName}" style="height:28px;width:auto;">
      </a>
      <nav class="header__nav" style="display:none">
        <a href="#/" class="header__nav-item" data-view="home">${t.nav.home}</a>
        <a href="#/generate" class="header__nav-item" data-view="generate">${t.nav.generate}</a>
        <a href="#/program" class="header__nav-item" data-view="programCreate">${t.nav.program}</a>
        <a href="#/lessons" class="header__nav-item" data-view="lessons">${isGuest() ? t.nav.lessonsGuest : t.nav.lessons}</a>
        ${isAdmin() ? `<a href="#/settings" class="header__nav-item" data-view="settings">${t.settings.title}</a>` : ''}
      </nav>
      <div class="header__back">
        <span class="material-symbols-outlined">arrow_forward</span>
      </div>
    `;

    // User menu dropdown toggle
    const menuBtn = document.getElementById('user-menu-btn');
    const dropdown = document.getElementById('user-dropdown');
    if (menuBtn && dropdown) {
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
      });
      document.addEventListener('click', () => { dropdown.style.display = 'none'; });
    }

    // Logout button
    document.getElementById('logout-btn')?.addEventListener('click', () => signOut());

    // Back button
    header.querySelector('.header__back')?.addEventListener('click', () => history.back());

    const checkDesktopNav = () => {
      const nav = header.querySelector('.header__nav');
      if (nav) nav.style.display = window.innerWidth >= 1024 ? 'flex' : 'none';
    };
    checkDesktopNav();
    window.addEventListener('resize', checkDesktopNav);
  }

  const bottomNav = document.getElementById('bottom-nav');
  if (bottomNav) {
    bottomNav.innerHTML = `
      <a href="#/" class="bottom-nav__item" data-view="home">
        <span class="material-symbols-outlined">home</span>
        <span>${t.nav.home}</span>
      </a>
      <a href="#/generate" class="bottom-nav__item" data-view="generate">
        <span class="material-symbols-outlined">fitness_center</span>
        <span>${t.nav.generate}</span>
      </a>
      <a href="#/program" class="bottom-nav__item" data-view="programCreate">
        <span class="material-symbols-outlined">edit_calendar</span>
        <span>${t.nav.program}</span>
      </a>
      <a href="#/lessons" class="bottom-nav__item" data-view="lessons">
        <span class="material-symbols-outlined">layers</span>
        <span>${isGuest() ? t.nav.lessonsGuest : t.nav.lessons}</span>
      </a>
      ${isAdmin() ? `
        <a href="#/settings" class="bottom-nav__item" data-view="settings">
          <span class="material-symbols-outlined">settings</span>
          <span>${t.settings.title}</span>
        </a>
      ` : ''}
    `;
  }
}

// =============================
// SHOW LOGIN / LOCKED PAGES
// =============================
function showLoginPage() {
  document.querySelector('.header').style.display = 'none';
  document.getElementById('bottom-nav').style.display = 'none';
  const app = document.getElementById('app');
  app.innerHTML = renderLogin();
  initLogin();
}

function showLockedPage() {
  document.querySelector('.header').style.display = 'none';
  document.getElementById('bottom-nav').style.display = 'none';
  const app = document.getElementById('app');
  app.innerHTML = renderLocked();
  document.getElementById('locked-logout-btn')?.addEventListener('click', () => signOut());
}

function showApp() {
  document.querySelector('.header').style.display = '';
  document.getElementById('bottom-nav').style.display = '';
  createAppShell();
  navigate();
  window.addEventListener('hashchange', navigate);
}

// =============================
// INIT
// =============================
async function init() {
  const user = await initAuth();

  if (!user) {
    showLoginPage();
    onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN') {
        await loadApiKey();
        if (isLocked()) {
          showLockedPage();
        } else {
          showApp();
        }
      }
    });
    return;
  }

  // User is logged in
  await loadApiKey();

  if (isLocked()) {
    showLockedPage();
    return;
  }

  showApp();
}

document.addEventListener('DOMContentLoaded', init);
