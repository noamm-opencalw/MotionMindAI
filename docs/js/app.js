import { t } from './i18n.js';
import { logoIcon, iconHome, iconSparkle, iconList, iconSettings } from './icons.js';
import {
  renderHome,
  renderGenerate, initGenerate,
  renderLessons, initLessons,
  renderLessonDetail, initLessonDetail,
  renderSettings, initSettings,
} from './views.js';

// =============================
// ROUTER
// =============================
const routes = [
  { pattern: /^#?\/?$/, view: 'home' },
  { pattern: /^#\/generate$/, view: 'generate' },
  { pattern: /^#\/lessons$/, view: 'lessons' },
  { pattern: /^#\/lesson\/(\d+)$/, view: 'detail' },
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
  const { view, params } = matchRoute(window.location.hash);
  const app = document.getElementById('app');

  // Render view HTML
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
      initLessons();
      break;
    case 'detail':
      app.innerHTML = renderLessonDetail();
      initLessonDetail(params[0]);
      break;
    case 'settings':
      app.innerHTML = renderSettings();
      initSettings();
      break;
  }

  // Update active nav item
  updateNav(view);

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function updateNav(activeView) {
  // Bottom nav
  document.querySelectorAll('.bottom-nav__item').forEach(item => {
    item.classList.toggle('active', item.dataset.view === activeView);
  });

  // Desktop nav
  document.querySelectorAll('.header__nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.view === activeView);
  });
}

// =============================
// APP SHELL
// =============================
function createAppShell() {
  // Header
  const header = document.querySelector('.header__inner');
  if (header) {
    header.innerHTML = `
      <a href="#/" class="header__logo">
        ${logoIcon()}
        <span class="header__title">${t.appName}</span>
      </a>
      <nav class="header__nav" style="display:none">
        <a href="#/" class="header__nav-item" data-view="home">${t.nav.home}</a>
        <a href="#/generate" class="header__nav-item" data-view="generate">${t.nav.generate}</a>
        <a href="#/lessons" class="header__nav-item" data-view="lessons">${t.nav.lessons}</a>
        <a href="#/settings" class="header__nav-item" data-view="settings">${t.settings.title}</a>
      </nav>
      <div class="header__status">
        <span class="header__status-dot"></span>
        <span>${t.appTagline}</span>
      </div>
    `;

    // Show desktop nav on larger screens
    const checkDesktopNav = () => {
      const nav = header.querySelector('.header__nav');
      if (nav) nav.style.display = window.innerWidth >= 1024 ? 'flex' : 'none';
    };
    checkDesktopNav();
    window.addEventListener('resize', checkDesktopNav);
  }

  // Bottom nav
  const bottomNav = document.getElementById('bottom-nav');
  if (bottomNav) {
    bottomNav.innerHTML = `
      <a href="#/" class="bottom-nav__item" data-view="home">
        ${iconHome()}
        <span>${t.nav.home}</span>
      </a>
      <a href="#/generate" class="bottom-nav__item" data-view="generate">
        ${iconSparkle()}
        <span>${t.nav.generate}</span>
      </a>
      <a href="#/lessons" class="bottom-nav__item" data-view="lessons">
        ${iconList()}
        <span>${t.nav.lessons}</span>
      </a>
      <a href="#/settings" class="bottom-nav__item" data-view="settings">
        ${iconSettings()}
        <span>${t.settings.title}</span>
      </a>
    `;
  }
}

// =============================
// INIT
// =============================
function init() {
  createAppShell();
  navigate();
  window.addEventListener('hashchange', navigate);
}

document.addEventListener('DOMContentLoaded', init);
