// ============================================================
// GRAMMARVERSE - APP LOGIC (Vanilla JS, no build step needed)
// ============================================================

// ---------- STATE & STORAGE ----------
const STORAGE_KEY = 'grammarverse_state_v1';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore corrupt storage */ }
  return {
    xp: 0,
    streakDays: 0,
    lastActiveDate: null,
    themeMode: 'light', // light | dark
    fontScale: 1,
    activeLanguage: null, // 'ms' | 'en'
    progress: {}, // topicId -> { status, bestScore, attempts }
    bookmarks: [], // topicId[]
    recentActivity: [], // { topicId, label, timestamp }
  };
}

let STATE = loadState();

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(STATE));
}

function applyTheme() {
  document.body.classList.toggle('dark-mode', STATE.themeMode === 'dark');
}

function touchStreak() {
  const today = new Date().toISOString().slice(0, 10);
  if (STATE.lastActiveDate === today) return;
  if (STATE.lastActiveDate) {
    const diffDays = Math.round((new Date(today) - new Date(STATE.lastActiveDate)) / 86400000);
    STATE.streakDays = diffDays === 1 ? STATE.streakDays + 1 : 1;
  } else {
    STATE.streakDays = 1;
  }
  STATE.lastActiveDate = today;
  saveState();
}

function addXp(amount) {
  STATE.xp += amount;
  saveState();
}

function getLevel(xp) {
  const levels = [
    { name: 'Beginner', min: 0 },
    { name: 'Explorer', min: 500 },
    { name: 'Achiever', min: 1500 },
    { name: 'Master', min: 3500 },
  ];
  let cur = levels[0];
  for (const l of levels) if (xp >= l.min) cur = l;
  return cur.name;
}

function getTopicProgress(topicId) {
  return STATE.progress[topicId] || { status: 'not-started', bestScore: 0, attempts: 0 };
}

function setTopicProgress(topicId, patch) {
  const cur = getTopicProgress(topicId);
  STATE.progress[topicId] = { ...cur, ...patch };
  saveState();
}

function completeTopic(topicId, scorePercent) {
  const cur = getTopicProgress(topicId);
  setTopicProgress(topicId, {
    status: scorePercent >= 90 ? 'mastered' : 'completed',
    bestScore: Math.max(cur.bestScore, scorePercent),
    attempts: cur.attempts + 1,
  });
  addXp(50);
  logActivity(topicId, TOPICS[topicId].title);
}

function logActivity(topicId, label) {
  STATE.recentActivity.unshift({ topicId, label, timestamp: Date.now() });
  STATE.recentActivity = STATE.recentActivity.slice(0, 8);
  saveState();
}

function toggleBookmark(topicId) {
  const idx = STATE.bookmarks.indexOf(topicId);
  if (idx >= 0) STATE.bookmarks.splice(idx, 1);
  else STATE.bookmarks.push(topicId);
  saveState();
  return idx < 0;
}

function isBookmarked(topicId) {
  return STATE.bookmarks.includes(topicId);
}

function setLanguage(lang) {
  STATE.activeLanguage = lang;
  saveState();
  applyAccent(lang);
}

function applyAccent(lang) {
  const root = document.documentElement;
  if (lang === 'en') {
    root.style.setProperty('--accent', 'var(--english)');
    root.style.setProperty('--accent-dark', 'var(--english-dark)');
    root.style.setProperty('--accent-50', 'var(--english-50)');
  } else {
    root.style.setProperty('--accent', 'var(--melayu)');
    root.style.setProperty('--accent-dark', 'var(--melayu-dark)');
    root.style.setProperty('--accent-50', 'var(--melayu-50)');
  }
}

function toast(msg) {
  const root = document.getElementById('toast-root');
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  root.appendChild(el);
  setTimeout(() => el.remove(), 2500);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ---------- ROUTER ----------
let ROUTE = { page: 'splash', params: {} };

function navigate(page, params = {}) {
  ROUTE = { page, params };
  window.scrollTo(0, 0);
  render();
}

function getTopicsForLang(lang) {
  return Object.values(TOPICS).filter((t) => t.lang === lang);
}

// ---------- ICONS (inline SVG, no external deps) ----------
const ICONS = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  dumbbell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6.5 6.5l11 11M21 21l-1-1M3 3l1 1M18 6l-2-2-4 4 2 2zM8 16l-4 4M20 8l-4 4M6 18l4-4M2 22l4-4"/></svg>',
  gamepad: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><circle cx="15" cy="13" r="1"/><circle cx="18" cy="11" r="1"/><rect x="2" y="6" width="20" height="12" rx="4"/></svg>',
  trend: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  flame: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
  sparkle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2z"/></svg>',
  trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 4H3v2a4 4 0 0 0 4 4M17 4h4v2a4 4 0 0 1-4 4"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  bookmark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>',
  bookmarkFilled: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  circle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  printer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>',
  award: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>',
  target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
  volume: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>',
};
function icon(name) { return ICONS[name] || ''; }

// ---------- NAV CONFIG ----------
const NAV_ITEMS = [
  { page: 'dashboard', label: 'Home', icon: 'home' },
  { page: 'topics', label: 'Topics', icon: 'book' },
  { page: 'practice', label: 'Practice', icon: 'dumbbell' },
  { page: 'games', label: 'Games', icon: 'gamepad' },
  { page: 'settings', label: 'Settings', icon: 'settings' },
];

// ---------- MAIN RENDER ----------
function render() {
  const app = document.getElementById('app');

  if (ROUTE.page === 'splash') {
    app.innerHTML = renderSplash();
    setTimeout(() => navigate(STATE.activeLanguage ? 'dashboard' : 'home'), 900);
    return;
  }

  if (ROUTE.page === 'home') {
    app.innerHTML = renderHome();
    bindHomeEvents();
    return;
  }

  // All other pages use the app shell (header + bottom nav)
  const body = renderPageBody();
  app.innerHTML = `
    ${renderHeader()}
    <div class="container fade-in" style="padding-top:20px; padding-bottom:20px;">${body}</div>
    ${renderBottomNav()}
  `;
  bindShellEvents();
  bindPageEvents();
}

function renderHeader() {
  const lang = STATE.activeLanguage;
  const dotColor = lang === 'en' ? 'var(--english)' : 'var(--melayu)';
  return `
    <header class="app-header">
      <div class="brand"><span class="brand-dot" style="background:${dotColor}"></span> GrammarVerse</div>
      <div class="header-actions">
        <button class="icon-btn" data-nav="search" aria-label="Cari">${icon('search')}</button>
        <button class="icon-btn" id="theme-toggle" aria-label="Tema">${icon(STATE.themeMode === 'dark' ? 'sun' : 'moon')}</button>
      </div>
    </header>
  `;
}

function renderBottomNav() {
  return `
    <nav class="bottom-nav">
      ${NAV_ITEMS.map(item => `
        <button class="nav-item ${ROUTE.page === item.page ? 'active' : ''}" data-nav="${item.page}">
          ${icon(item.icon)}
          <span>${item.label}</span>
        </button>
      `).join('')}
    </nav>
  `;
}

function bindShellEvents() {
  document.querySelectorAll('[data-nav]').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.nav));
  });
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      STATE.themeMode = STATE.themeMode === 'dark' ? 'light' : 'dark';
      saveState();
      applyTheme();
      render();
    });
  }
}

function renderPageBody() {
  switch (ROUTE.page) {
    case 'dashboard': return renderDashboard();
    case 'topics': return renderTopicsList();
    case 'topic-detail': return renderTopicDetail(ROUTE.params.topicId);
    case 'practice': return renderPractice();
    case 'games': return renderGames();
    case 'game-play': return renderGamePlay(ROUTE.params.topicId, ROUTE.params.gameType);
    case 'worksheets': return renderWorksheets();
    case 'assessment': return renderAssessment();
    case 'assessment-run': return renderAssessmentRun(ROUTE.params.topicId);
    case 'progress': return renderProgress();
    case 'achievements': return renderAchievements();
    case 'search': return renderSearch();
    case 'settings': return renderSettings();
    default: return renderNotFound();
  }
}

function bindPageEvents() {
  switch (ROUTE.page) {
    case 'dashboard': return bindDashboardEvents();
    case 'topics': return bindTopicsListEvents();
    case 'topic-detail': return bindTopicDetailEvents(ROUTE.params.topicId);
    case 'practice': return bindPracticeEvents();
    case 'games': return bindGamesEvents();
    case 'game-play': return bindGamePlayEvents(ROUTE.params.topicId, ROUTE.params.gameType);
    case 'worksheets': return bindWorksheetsEvents();
    case 'assessment': return bindAssessmentEvents();
    case 'assessment-run': return bindAssessmentRunEvents(ROUTE.params.topicId);
    case 'progress': return bindProgressEvents();
    case 'achievements': return bindAchievementsEvents();
    case 'search': return bindSearchEvents();
    case 'settings': return bindSettingsEvents();
  }
}

// ============================================================
// PAGE: SPLASH
// ============================================================
function renderSplash() {
  return `
    <div style="min-height:100vh; display:flex; align-items:center; justify-content:center; background:var(--ink); flex-direction:column; gap:16px;">
      <svg width="64" height="64" viewBox="0 0 72 72">
        <line x1="10" y1="62" x2="62" y2="10" stroke="url(#g)" stroke-width="4" stroke-linecap="round"/>
        <circle cx="10" cy="62" r="6" fill="#C1440E"/>
        <circle cx="62" cy="10" r="6" fill="#2A6F97"/>
        <defs><linearGradient id="g" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#C1440E"/><stop offset="1" stop-color="#2A6F97"/></linearGradient></defs>
      </svg>
      <h1 style="color:var(--paper); font-size:1.8rem; font-weight:600;">GrammarVerse</h1>
      <p style="color:var(--ink-100); font-size:0.85rem;">Satu aplikasi. Dua bahasa, dikuasai penuh.</p>
    </div>
  `;
}

// ============================================================
// PAGE: HOME (language selection)
// ============================================================
function renderHome() {
  const completedCount = Object.values(STATE.progress).filter(p => p.status === 'completed' || p.status === 'mastered').length;
  return `
    <div class="container" style="padding-top:24px;">
      <div class="brand" style="margin-bottom:32px;"><span class="brand-dot"></span> GrammarVerse</div>

      <div style="text-align:center; margin-bottom:40px;">
        <p class="eyebrow" style="text-align:center;">Pusat Pembelajaran Tatabahasa</p>
        <h1 style="font-size:2.1rem; font-weight:600; line-height:1.2; margin-bottom:10px;">
          Satu aplikasi.<br/>
          <span style="background:linear-gradient(90deg,var(--melayu),var(--english)); -webkit-background-clip:text; background-clip:text; color:transparent;">Dua bahasa, dikuasai penuh.</span>
        </h1>
        <p style="color:var(--ink-400); font-size:0.9rem;">Pilih laluan pembelajaran anda untuk bermula.</p>
      </div>

      <div class="lang-grid">
        <button class="lang-card ms" data-lang="ms">
          <div>
            <span class="lang-emoji">🇲🇾</span>
            <div class="lang-title">Tatabahasa Bahasa Melayu</div>
            <div class="lang-desc">Dari asas huruf hingga peribahasa lanjutan — kuasai tatabahasa Melayu langkah demi langkah.</div>
          </div>
          <span class="lang-cta">Mula belajar ${icon('chevron')}</span>
        </button>
        <button class="lang-card en" data-lang="en">
          <div>
            <span class="lang-emoji">🇬🇧</span>
            <div class="lang-title">Learn English Grammar</div>
            <div class="lang-desc">From the basics to advanced structures — master English grammar step by step.</div>
          </div>
          <span class="lang-cta">Start learning ${icon('chevron')}</span>
        </button>
      </div>

      <div class="stat-grid">
        <div class="card stat-box"><div class="stat-num">${completedCount}</div><div class="stat-label">Topik Selesai</div></div>
        <div class="card stat-box"><div class="stat-num">${getLevel(STATE.xp)}</div><div class="stat-label">Tahap Semasa</div></div>
        <div class="card stat-box"><div class="stat-num">${STATE.streakDays}</div><div class="stat-label">Hari Berturutan</div></div>
      </div>
    </div>
  `;
}

function bindHomeEvents() {
  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => {
      setLanguage(btn.dataset.lang);
      navigate('dashboard');
    });
  });
}

// ============================================================
// PAGE: DASHBOARD
// ============================================================
function progressRingSvg(percent, size = 84, color = 'var(--accent)') {
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, percent)) / 100) * c;
  return `
    <div class="ring-wrap" style="width:${size}px;height:${size}px;">
      <svg width="${size}" height="${size}" style="transform:rotate(-90deg);">
        <circle cx="${size/2}" cy="${size/2}" r="${r}" stroke-width="${stroke}" fill="none" stroke="var(--ink-50)"/>
        <circle cx="${size/2}" cy="${size/2}" r="${r}" stroke-width="${stroke}" fill="none" stroke="${color}"
          stroke-dasharray="${c}" stroke-dashoffset="${offset}" stroke-linecap="round"/>
      </svg>
      <div class="ring-label"><div class="ring-num">${Math.round(percent)}%</div></div>
    </div>
  `;
}

function renderDashboard() {
  if (!STATE.activeLanguage) { navigate('home'); return ''; }
  const lang = STATE.activeLanguage;
  const topics = getTopicsForLang(lang);
  const completed = topics.filter(t => ['completed', 'mastered'].includes(getTopicProgress(t.id).status));
  const overallPct = topics.length ? (completed.length / topics.length) * 100 : 0;
  const recommended = topics.find(t => getTopicProgress(t.id).status !== 'completed' && getTopicProgress(t.id).status !== 'mastered');
  const modules = MODULES_BY_LANG[lang];

  return `
    <p class="eyebrow">${lang === 'ms' ? 'Tatabahasa Bahasa Melayu' : 'English Grammar'}</p>
    <h1 style="font-size:1.7rem; font-weight:600; margin-bottom:6px;">Selamat kembali! 👋</h1>
    <p style="color:var(--ink-400); font-size:0.9rem; margin-bottom:24px;">Teruskan pembelajaran anda hari ini.</p>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:20px;">
      <div class="card card-pad" style="display:flex; align-items:center; gap:14px; grid-column:1/-1;">
        ${progressRingSvg(overallPct)}
        <div>
          <p style="font-size:0.8rem; color:var(--ink-400); margin-bottom:2px;">Kemajuan Keseluruhan</p>
          <p style="font-weight:600; font-family:'Fraunces',serif; font-size:1.05rem;">${completed.length} / ${topics.length} topik</p>
        </div>
      </div>
      <div class="card card-pad" style="display:flex; align-items:center; gap:10px;">
        <div style="padding:10px;border-radius:50%;background:var(--warning-50);color:var(--warning);">${icon('flame')}</div>
        <div><p style="font-family:'Fraunces',serif;font-size:1.3rem;font-weight:600;">${STATE.streakDays}</p><p style="font-size:0.7rem;color:var(--ink-400);">Hari Streak</p></div>
      </div>
      <div class="card card-pad" style="display:flex; align-items:center; gap:10px;">
        <div style="padding:10px;border-radius:50%;background:var(--accent-50);color:var(--accent);">${icon('sparkle')}</div>
        <div><p style="font-family:'Fraunces',serif;font-size:1.3rem;font-weight:600;">${STATE.xp}</p><p style="font-size:0.7rem;color:var(--ink-400);">${getLevel(STATE.xp)} · XP</p></div>
      </div>
    </div>

    ${recommended ? `
      <div class="card card-pad" style="border-left:4px solid var(--accent); margin-bottom:24px;">
        <span class="pill pill-accent" style="margin-bottom:8px;">${icon('sparkle')} Dicadangkan</span>
        <h3 style="font-size:1.15rem; margin-bottom:6px;">${escapeHtml(recommended.title)}</h3>
        <p style="font-size:0.85rem; color:var(--ink-400); margin-bottom:14px;">${escapeHtml(recommended.desc)}</p>
        <button class="btn btn-accent btn-sm" data-goto-topic="${recommended.id}">Teruskan ${icon('chevron')}</button>
      </div>
    ` : ''}

    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;">
      <h2 style="font-size:1.2rem; font-weight:600;">Modul Pembelajaran</h2>
      <button class="btn btn-ghost btn-sm" data-nav="topics">Lihat semua ${icon('chevron')}</button>
    </div>
    <div style="display:grid; gap:10px; margin-bottom:24px;">
      ${modules.map(mod => {
        const modTopics = topics.filter(t => t.module === mod);
        const modDone = modTopics.filter(t => ['completed','mastered'].includes(getTopicProgress(t.id).status)).length;
        return `
          <button class="card card-hover card-pad" data-nav="topics" style="text-align:left; display:flex; justify-content:space-between; align-items:center; width:100%; border:1px solid var(--ink-50);">
            <div>
              <p style="font-weight:600; margin-bottom:2px;">${escapeHtml(mod)}</p>
              <p style="font-size:0.75rem; color:var(--ink-400);">${modDone}/${modTopics.length} topik selesai</p>
            </div>
            ${icon('chevron')}
          </button>
        `;
      }).join('')}
    </div>

    ${STATE.recentActivity.length ? `
      <h2 style="font-size:1.2rem; font-weight:600; margin-bottom:12px;">Aktiviti Terkini</h2>
      <div class="card">
        ${STATE.recentActivity.slice(0,5).map(a => `
          <div class="topic-row" style="cursor:default;">
            <span style="font-size:0.85rem;">${escapeHtml(a.label)}</span>
            <span style="font-size:0.72rem; color:var(--ink-400);">${new Date(a.timestamp).toLocaleDateString()}</span>
          </div>
        `).join('')}
      </div>
    ` : ''}
  `;
}

function bindDashboardEvents() {
  document.querySelectorAll('[data-goto-topic]').forEach(btn => {
    btn.addEventListener('click', () => navigate('topic-detail', { topicId: btn.dataset.gotoTopic }));
  });
}

// ============================================================
// PAGE: TOPICS LIST
// ============================================================
function renderTopicsList() {
  if (!STATE.activeLanguage) { navigate('home'); return ''; }
  const lang = STATE.activeLanguage;
  const topics = getTopicsForLang(lang);
  const modules = MODULES_BY_LANG[lang];

  return `
    <p class="eyebrow">${lang === 'ms' ? 'Tatabahasa Bahasa Melayu' : 'English Grammar'}</p>
    <h1 style="font-size:1.6rem; font-weight:600; margin-bottom:24px;">Semua Topik</h1>
    ${modules.map(mod => {
      const modTopics = topics.filter(t => t.module === mod);
      if (!modTopics.length) return '';
      return `
        <div style="margin-bottom:24px;">
          <h2 style="font-size:1.05rem; font-weight:600; margin-bottom:10px;">${escapeHtml(mod)}</h2>
          <div class="card">
            ${modTopics.map(t => {
              const p = getTopicProgress(t.id);
              const isDone = p.status === 'completed' || p.status === 'mastered';
              const statusIcon = isDone ? icon('check') : icon('circle');
              const statusColor = isDone ? 'var(--accent)' : 'var(--ink-100)';
              return `
                <div class="topic-row" data-goto-topic="${t.id}">
                  <div class="topic-row-left">
                    <span style="width:16px;height:16px;color:${statusColor};">${statusIcon}</span>
                    <span style="font-size:0.88rem; font-weight:500;">${escapeHtml(t.title)}</span>
                  </div>
                  <div style="display:flex; align-items:center; gap:8px;">
                    ${p.bestScore > 0 ? `<span style="font-size:0.72rem; color:var(--ink-400);">${p.bestScore}%</span>` : ''}
                    <span style="width:16px;height:16px; color:var(--ink-100);">${icon('chevron')}</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }).join('')}
  `;
}

function bindTopicsListEvents() {
  document.querySelectorAll('[data-goto-topic]').forEach(el => {
    el.addEventListener('click', () => navigate('topic-detail', { topicId: el.dataset.gotoTopic }));
  });
}

// ============================================================
// PAGE: TOPIC DETAIL
// ============================================================
function renderTopicDetail(topicId) {
  const t = TOPICS[topicId];
  if (!t) return renderNotFound();
  const bookmarked = isBookmarked(topicId);
  const p = getTopicProgress(topicId);

  return `
    <button class="btn btn-ghost btn-sm" data-nav="topics" style="margin-bottom:12px; padding-left:4px;">${icon('back')} Kembali</button>

    <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px; margin-bottom:8px;">
      <div>
        <div style="display:flex; gap:6px; margin-bottom:10px;">
          <span class="pill pill-accent">${escapeHtml(t.module)}</span>
          <span class="pill pill-neutral">${escapeHtml(t.level)}</span>
        </div>
        <h1 style="font-size:1.7rem; font-weight:600;">${escapeHtml(t.title)}</h1>
      </div>
      <button class="icon-btn" id="bookmark-btn" style="color:${bookmarked ? 'var(--accent)' : 'var(--ink-400)'}; background:${bookmarked ? 'var(--accent-50)' : 'transparent'};">
        ${icon(bookmarked ? 'bookmarkFilled' : 'bookmark')}
      </button>
    </div>

    ${p.bestScore > 0 ? `<p style="font-size:0.8rem; color:var(--ink-400); margin-bottom:14px; display:flex; align-items:center; gap:6px;"><span style="width:14px;">${icon('trophy')}</span> Skor terbaik: ${p.bestScore}%</p>` : ''}

    <p style="color:var(--ink-600); line-height:1.6; margin-bottom:16px; font-size:0.92rem;">${escapeHtml(t.intro)}</p>

    <div class="card card-pad" style="background:var(--ink-50); border:none; margin-bottom:20px;">
      <p style="font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--ink-400); margin-bottom:4px;">Objektif Pembelajaran</p>
      <p style="font-size:0.88rem;">${escapeHtml(t.objective)}</p>
    </div>

    <div class="section-nav">
      <a href="#sec-notes">Nota</a>
      <a href="#sec-examples">Contoh</a>
      <a href="#sec-mistakes">Kesalahan</a>
      <a href="#sec-exercises">Latihan</a>
      <a href="#sec-summary">Ringkasan</a>
    </div>

    <section class="topic-section" id="sec-notes">
      <span class="eyebrow">01 · Fahami Konsep</span>
      <h2 style="font-size:1.3rem; margin-bottom:16px;">Nota Pembelajaran</h2>
      ${t.notes.map(n => `
        <div class="note-box"><h4>${escapeHtml(n.h)}</h4><p>${escapeHtml(n.b)}</p></div>
      `).join('')}
    </section>

    ${t.mnemonics && t.mnemonics.length ? `
      <section class="topic-section">
        <span class="eyebrow">02 · Trik & Mnemonic</span>
        <h2 style="font-size:1.3rem; margin-bottom:16px;">Formula Mudah Ingat</h2>
        ${t.mnemonics.map(m => `
          <div class="note-box" style="background:var(--accent-50);"><h4>${escapeHtml(m.t)}</h4><p>${escapeHtml(m.tip)}</p></div>
        `).join('')}
      </section>
    ` : ''}

    <section class="topic-section" id="sec-examples">
      <span class="eyebrow">03 · Lihat Contoh</span>
      <h2 style="font-size:1.3rem; margin-bottom:16px;">Contoh Ayat (${t.examples.length})</h2>
      <div class="example-grid">
        ${t.examples.map((ex, i) => `
          <div class="card example-card" data-toggle-example="${i}">
            <p class="txt">${escapeHtml(ex.t)}</p>
            <span class="pill pill-neutral">${escapeHtml(ex.c)}</span>
            <p class="exp">${escapeHtml(ex.e)}</p>
          </div>
        `).join('')}
      </div>
    </section>

    <section class="topic-section" id="sec-mistakes">
      <span class="eyebrow">04 · Elak Kesilapan</span>
      <h2 style="font-size:1.3rem; margin-bottom:16px;">Kesalahan Lazim</h2>
      ${t.mistakes.map(m => `
        <div class="card mistake-card">
          <div class="mistake-line"><span style="color:var(--danger); flex-shrink:0; width:14px; margin-top:2px;">${icon('x')}</span><span class="mistake-wrong">${escapeHtml(m.w)}</span></div>
          <div class="mistake-line"><span style="color:var(--success); flex-shrink:0; width:14px; margin-top:2px;">${icon('check')}</span><span class="mistake-correct">${escapeHtml(m.c)}</span></div>
          <p class="mistake-reason">${escapeHtml(m.r)}</p>
        </div>
      `).join('')}
    </section>

    <section class="topic-section" id="sec-exercises">
      <span class="eyebrow">05 · Berlatih</span>
      <h2 style="font-size:1.3rem; margin-bottom:16px;">Latihan Interaktif</h2>
      <div id="exercise-mount"></div>
    </section>

    <section class="topic-section" id="sec-summary">
      <span class="eyebrow">06 · Kekalkan Ingatan</span>
      <h2 style="font-size:1.3rem; margin-bottom:16px;">Ringkasan Topik</h2>
      <div class="card card-pad" style="background:var(--ink); color:var(--paper);">
        <p style="font-family:'Fraunces',serif; font-size:1.1rem; font-weight:600;">${escapeHtml(t.summary)}</p>
      </div>
    </section>
  `;
}

function bindTopicDetailEvents(topicId) {
  const t = TOPICS[topicId];
  if (!t) return;

  document.querySelectorAll('[data-nav]').forEach(btn => btn.addEventListener('click', () => navigate(btn.dataset.nav)));

  const bookmarkBtn = document.getElementById('bookmark-btn');
  if (bookmarkBtn) {
    bookmarkBtn.addEventListener('click', () => {
      const now = toggleBookmark(topicId);
      toast(now ? 'Ditambah ke bookmark' : 'Dibuang dari bookmark');
      render();
    });
  }

  document.querySelectorAll('[data-toggle-example]').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('open'));
  });

  mountExerciseRunner('exercise-mount', t.exercises, (percent) => {
    completeTopic(topicId, percent);
  });
}

// ============================================================
// EXERCISE RUNNER (reusable across Topic Detail & Assessment)
// ============================================================
function mountExerciseRunner(mountId, exercises, onComplete) {
  const mount = document.getElementById(mountId);
  if (!mount) return;

  let idx = 0;
  let selected = null;
  let checked = false;
  const results = [];

  function renderRunner() {
    const cur = exercises[idx];
    const isLast = idx === exercises.length - 1;

    let optionsHtml = '';
    if (cur.type === 'mcq') {
      optionsHtml = cur.opts.map(opt => {
        const isSel = selected === opt;
        const isCorrect = checked && opt === cur.a;
        const isWrong = checked && isSel && !isCorrect;
        return `<button class="opt-btn ${isSel && !checked ? 'selected' : ''} ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}" data-opt="${escapeHtml(opt)}" ${checked ? 'disabled' : ''}>
          <span style="display:flex; justify-content:space-between; align-items:center;">${escapeHtml(opt)} ${isCorrect ? `<span style="width:16px;">${icon('check')}</span>` : ''}${isWrong ? `<span style="width:16px;">${icon('x')}</span>` : ''}</span>
        </button>`;
      }).join('');
    } else if (cur.type === 'tf') {
      optionsHtml = `<div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">` +
        ['Betul', 'Salah'].map(opt => {
          const isSel = selected === opt;
          const isCorrect = checked && opt === cur.a;
          const isWrong = checked && isSel && !isCorrect;
          return `<button class="opt-btn ${isSel && !checked ? 'selected' : ''} ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}" data-opt="${opt}" ${checked ? 'disabled' : ''} style="text-align:center;">${opt}</button>`;
        }).join('') + `</div>`;
    }

    mount.innerHTML = `
      <div class="card card-pad exercise-box">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;">
          <span style="font-size:0.72rem; font-family:'JetBrains Mono',monospace; color:var(--ink-400);">Soalan ${idx+1} / ${exercises.length}</span>
          <button id="restart-ex" class="icon-btn" style="width:30px;height:30px;" aria-label="Mula semula"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg></button>
        </div>
        <div class="exercise-progress">
          ${exercises.map((_, i) => `<div class="exercise-dot ${i < idx ? 'done' : i === idx ? 'active' : ''}"></div>`).join('')}
        </div>
        <p class="exercise-q">${escapeHtml(cur.q)}</p>
        ${optionsHtml}
        ${checked ? `
          <div class="feedback-box ${results[results.length-1] ? 'correct' : 'incorrect'}">
            <strong>${results[results.length-1] ? '✓ Betul!' : '✗ Cuba lagi lain kali'}</strong>
            <p class="exp-text">${escapeHtml(cur.e)}</p>
          </div>
        ` : ''}
        <div style="display:flex; justify-content:flex-end; margin-top:16px;">
          ${!checked
            ? `<button class="btn btn-accent" id="check-ans" ${!selected ? 'disabled' : ''}>Semak Jawapan</button>`
            : `<button class="btn btn-accent" id="next-q">${isLast ? 'Selesai' : 'Soalan Seterusnya'} ${icon('chevron')}</button>`
          }
        </div>
      </div>
    `;

    mount.querySelectorAll('[data-opt]').forEach(btn => {
      btn.addEventListener('click', () => { selected = btn.dataset.opt; renderRunner(); });
    });
    const checkBtn = document.getElementById('check-ans');
    if (checkBtn) checkBtn.addEventListener('click', () => {
      const correct = selected === cur.a;
      results.push(correct);
      checked = true;
      renderRunner();
    });
    const nextBtn = document.getElementById('next-q');
    if (nextBtn) nextBtn.addEventListener('click', () => {
      if (isLast) {
        const correctCount = results.filter(Boolean).length;
        const percent = Math.round((correctCount / exercises.length) * 100);
        mount.innerHTML = `
          <div class="card card-pad exercise-box" style="text-align:center;">
            <div style="width:40px; height:40px; margin:0 auto 12px; color:var(--accent);">${icon('trophy')}</div>
            <p style="font-family:'Fraunces',serif; font-size:2rem; font-weight:600;">${percent}%</p>
            <p style="color:var(--ink-400); margin-bottom:20px;">${percent >= 90 ? 'Cemerlang! Anda sudah menguasai topik ini.' : percent >= 60 ? 'Bagus! Teruskan berlatih.' : 'Jangan risau, cuba lagi untuk perbaiki markah anda.'}</p>
            <button class="btn btn-outline" id="retry-ex">Cuba Lagi</button>
          </div>
        `;
        document.getElementById('retry-ex').addEventListener('click', () => {
          idx = 0; selected = null; checked = false; results.length = 0;
          renderRunner();
        });
        onComplete(percent);
        return;
      }
      idx++; selected = null; checked = false;
      renderRunner();
    });
    const restartBtn = document.getElementById('restart-ex');
    if (restartBtn) restartBtn.addEventListener('click', () => {
      idx = 0; selected = null; checked = false; results.length = 0;
      renderRunner();
    });
  }

  renderRunner();
}

// ============================================================
// PAGE: PRACTICE
// ============================================================
function renderPractice() {
  if (!STATE.activeLanguage) { navigate('home'); return ''; }
  const topics = getTopicsForLang(STATE.activeLanguage);
  return `
    <p class="eyebrow">Latihan Interaktif</p>
    <h1 style="font-size:1.6rem; font-weight:600; margin-bottom:24px; display:flex; align-items:center; gap:10px;"><span style="width:24px;">${icon('dumbbell')}</span> Practice</h1>
    <div style="display:grid; gap:12px;">
      ${topics.map(t => `
        <div class="card card-pad card-hover" data-goto-topic="${t.id}" style="cursor:pointer;">
          <span class="pill pill-accent" style="margin-bottom:8px;">${t.exercises.length} soalan</span>
          <h3 style="font-size:1rem; margin-bottom:4px;">${escapeHtml(t.title)}</h3>
          <p style="font-size:0.82rem; color:var(--ink-400);">${escapeHtml(t.desc)}</p>
        </div>
      `).join('')}
    </div>
  `;
}
function bindPracticeEvents() {
  document.querySelectorAll('[data-goto-topic]').forEach(el => {
    el.addEventListener('click', () => navigate('topic-detail', { topicId: el.dataset.gotoTopic }));
  });
}

// ============================================================
// PAGE: GAMES
// ============================================================
function renderGames() {
  if (!STATE.activeLanguage) { navigate('home'); return ''; }
  const topics = getTopicsForLang(STATE.activeLanguage);
  return `
    <p class="eyebrow">Permainan Interaktif</p>
    <h1 style="font-size:1.6rem; font-weight:600; margin-bottom:24px; display:flex; align-items:center; gap:10px;"><span style="width:24px;">${icon('gamepad')}</span> Games</h1>
    ${topics.map(t => `
      <div style="margin-bottom:20px;">
        <h2 style="font-size:1rem; font-weight:600; margin-bottom:10px;">${escapeHtml(t.title)}</h2>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          <button class="card card-hover card-pad" data-play="${t.id}|flashcard" style="text-align:left;">
            <p style="font-weight:600; font-size:0.88rem; margin-bottom:4px;">Kad Imbas</p>
            <span class="pill pill-neutral">flashcard</span>
          </button>
          <button class="card card-hover card-pad" data-play="${t.id}|memory" style="text-align:left;">
            <p style="font-weight:600; font-size:0.88rem; margin-bottom:4px;">Padanan Ingatan</p>
            <span class="pill pill-neutral">memory</span>
          </button>
        </div>
      </div>
    `).join('')}
  `;
}
function bindGamesEvents() {
  document.querySelectorAll('[data-play]').forEach(btn => {
    btn.addEventListener('click', () => {
      const [topicId, gameType] = btn.dataset.play.split('|');
      navigate('game-play', { topicId, gameType });
    });
  });
}

// ============================================================
// PAGE: GAME PLAY (flashcard / memory)
// ============================================================
function renderGamePlay(topicId, gameType) {
  const t = TOPICS[topicId];
  if (!t) return renderNotFound();
  return `
    <button class="btn btn-ghost btn-sm" data-nav="games" style="margin-bottom:16px; padding-left:4px;">${icon('back')} Kembali ke Games</button>
    <h1 style="font-size:1.4rem; font-weight:600; text-align:center; margin-bottom:20px;">${escapeHtml(t.title)}</h1>
    <div id="game-mount"></div>
  `;
}

function bindGamePlayEvents(topicId, gameType) {
  const t = TOPICS[topicId];
  if (!t) return;
  document.querySelectorAll('[data-nav]').forEach(btn => btn.addEventListener('click', () => navigate(btn.dataset.nav)));

  if (gameType === 'flashcard') mountFlashcardGame('game-mount', t);
  else if (gameType === 'memory') mountMemoryGame('game-mount', t);
}

function mountFlashcardGame(mountId, topic) {
  const mount = document.getElementById(mountId);
  // Build flashcards from topic notes (heading = front, body = back)
  const cards = topic.notes.map(n => ({ front: n.h, back: n.b }));
  let idx = 0, flipped = false;

  function renderCard() {
    const c = cards[idx];
    mount.innerHTML = `
      <div class="flashcard-wrap">
        <p style="text-align:center; font-size:0.72rem; font-family:'JetBrains Mono',monospace; color:var(--ink-400); margin-bottom:12px;">${idx+1} / ${cards.length}</p>
        <div class="flashcard ${flipped ? 'flipped' : ''}" id="fc">
          <div class="flashcard-inner">
            <div class="flashcard-face flashcard-front"><p style="font-family:'Fraunces',serif; font-size:1.3rem; font-weight:600;">${escapeHtml(c.front)}</p></div>
            <div class="flashcard-face flashcard-back"><p style="font-size:0.88rem; line-height:1.5;">${escapeHtml(c.back)}</p></div>
          </div>
        </div>
        <div style="display:flex; justify-content:center; gap:10px;">
          <button class="btn btn-ghost btn-sm" id="fc-prev">${icon('back')} Sebelum</button>
          <button class="btn btn-outline btn-sm" id="fc-flip">Terbalik</button>
          <button class="btn btn-ghost btn-sm" id="fc-next">Seterus ${icon('chevron')}</button>
        </div>
      </div>
    `;
    document.getElementById('fc').addEventListener('click', () => { flipped = !flipped; renderCard(); });
    document.getElementById('fc-flip').addEventListener('click', (e) => { e.stopPropagation(); flipped = !flipped; renderCard(); });
    document.getElementById('fc-prev').addEventListener('click', (e) => { e.stopPropagation(); idx = (idx - 1 + cards.length) % cards.length; flipped = false; renderCard(); });
    document.getElementById('fc-next').addEventListener('click', (e) => { e.stopPropagation(); idx = (idx + 1) % cards.length; flipped = false; renderCard(); });
  }
  renderCard();
}

function mountMemoryGame(mountId, topic) {
  const mount = document.getElementById(mountId);
  // Build pairs from examples: category <-> example category label
  const pairs = topic.examples.slice(0, 4).map((ex, i) => ({ id: 'p'+i, a: ex.c, b: ex.t.split(' ').slice(0,3).join(' ') + '…' }));
  let cards = [];
  pairs.forEach(p => { cards.push({ key: p.id+'a', pairId: p.id, text: p.a }); cards.push({ key: p.id+'b', pairId: p.id, text: p.b }); });
  cards = cards.sort(() => Math.random() - 0.5);

  let flipped = [];
  let matched = new Set();
  let moves = 0;
  let lock = false;

  function renderGrid() {
    const allMatched = matched.size === pairs.length;
    if (allMatched) {
      mount.innerHTML = `
        <div class="card card-pad" style="text-align:center;">
          <div style="width:36px;height:36px;margin:0 auto 10px;color:var(--accent);">${icon('sparkle')}</div>
          <p style="font-family:'Fraunces',serif; font-size:1.3rem; font-weight:600;">Tahniah!</p>
          <p style="color:var(--ink-400);">Anda selesai dalam ${moves} gerakan.</p>
        </div>
      `;
      return;
    }
    mount.innerHTML = `
      <div style="display:flex; justify-content:space-between; font-size:0.82rem; margin-bottom:14px;">
        <span style="color:var(--ink-400);">Gerakan: ${moves}</span>
        <span style="color:var(--ink-400);">${matched.size} / ${pairs.length} pasangan</span>
      </div>
      <div class="memory-grid">
        ${cards.map(c => {
          const isFlipped = flipped.includes(c.key) || matched.has(c.pairId);
          const isMatched = matched.has(c.pairId);
          return `<button class="memory-card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}" data-key="${c.key}" ${isMatched ? 'disabled' : ''}>${isFlipped ? escapeHtml(c.text) : '?'}</button>`;
        }).join('')}
      </div>
    `;
    mount.querySelectorAll('[data-key]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (lock) return;
        const key = btn.dataset.key;
        if (flipped.includes(key)) return;
        if (flipped.length === 2) return;
        flipped.push(key);
        renderGrid();
        if (flipped.length === 2) {
          lock = true;
          moves++;
          const [k1, k2] = flipped;
          const c1 = cards.find(c => c.key === k1);
          const c2 = cards.find(c => c.key === k2);
          if (c1.pairId === c2.pairId) {
            setTimeout(() => { matched.add(c1.pairId); flipped = []; lock = false; renderGrid(); }, 500);
          } else {
            setTimeout(() => { flipped = []; lock = false; renderGrid(); }, 900);
          }
        }
      });
    });
  }
  renderGrid();
}

// ============================================================
// PAGE: WORKSHEETS
// ============================================================
function renderWorksheets() {
  if (!STATE.activeLanguage) { navigate('home'); return ''; }
  const topics = getTopicsForLang(STATE.activeLanguage);
  return `
    <p class="eyebrow">Jana Worksheet</p>
    <h1 style="font-size:1.6rem; font-weight:600; margin-bottom:24px; display:flex; align-items:center; gap:10px;"><span style="width:24px;">${icon('book')}</span> Worksheets</h1>
    <div style="display:grid; gap:12px;">
      ${topics.map(t => `
        <div class="card card-pad">
          <span class="pill pill-accent" style="margin-bottom:8px;">${t.exercises.length} soalan</span>
          <h3 style="font-size:1rem; margin-bottom:4px;">${escapeHtml(t.title)}</h3>
          <p style="font-size:0.82rem; color:var(--ink-400); margin-bottom:14px;">${escapeHtml(t.desc)}</p>
          <button class="btn btn-outline btn-sm" data-print="${t.id}">${icon('printer')} Cetak</button>
        </div>
      `).join('')}
    </div>
  `;
}
function bindWorksheetsEvents() {
  document.querySelectorAll('[data-print]').forEach(btn => {
    btn.addEventListener('click', () => printWorksheet(TOPICS[btn.dataset.print]));
  });
}
function printWorksheet(t) {
  const win = window.open('', '_blank');
  if (!win) { toast('Sila benarkan pop-up untuk mencetak.'); return; }
  const rows = t.exercises.map((ex, i) => `
    <div style="margin-bottom:20px; padding-bottom:16px; border-bottom:1px solid #eee;">
      <p style="font-weight:600; margin-bottom:8px;">${i+1}. ${escapeHtml(ex.q)}</p>
      ${ex.opts
        ? `<div style="display:flex; flex-direction:column; gap:6px; margin-left:16px;">${ex.opts.map(o => `<label style="font-size:14px;"><input type="checkbox" style="margin-right:8px;"/>${escapeHtml(o)}</label>`).join('')}</div>`
        : `<div style="border-bottom:1px solid #333; width:60%; height:24px; margin-left:16px;"></div>`
      }
    </div>
  `).join('');
  win.document.write(`
    <html><head><title>${escapeHtml(t.title)} - Worksheet</title>
    <style>body{font-family:Georgia,serif;padding:40px;max-width:700px;margin:0 auto;color:#14213D;}
    h1{font-size:22px;border-bottom:3px solid #C1440E;padding-bottom:12px;}
    .meta{font-size:12px;color:#888;margin-bottom:24px;}</style></head>
    <body><h1>${escapeHtml(t.title)}</h1>
    <p class="meta">Nama: _________________________  &nbsp;&nbsp; Tarikh: _______________</p>
    ${rows}</body></html>
  `);
  win.document.close();
  win.focus();
  win.print();
}

// ============================================================
// PAGE: ASSESSMENT
// ============================================================
function renderAssessment() {
  if (!STATE.activeLanguage) { navigate('home'); return ''; }
  const topics = getTopicsForLang(STATE.activeLanguage);
  return `
    <p class="eyebrow">Penilaian Kefahaman</p>
    <h1 style="font-size:1.6rem; font-weight:600; margin-bottom:24px;">Assessment</h1>
    <div style="display:grid; gap:12px;">
      ${topics.map(t => `
        <div class="card card-pad">
          <span class="pill pill-accent" style="margin-bottom:8px;">Topic Test</span>
          <h3 style="font-size:1rem; margin-bottom:4px;">${escapeHtml(t.title)}</h3>
          <p style="font-size:0.82rem; color:var(--ink-400); margin-bottom:14px;">${escapeHtml(t.desc)}</p>
          <button class="btn btn-accent btn-sm" data-start-test="${t.id}">Mula Ujian</button>
        </div>
      `).join('')}
    </div>
  `;
}
function bindAssessmentEvents() {
  document.querySelectorAll('[data-start-test]').forEach(btn => {
    btn.addEventListener('click', () => navigate('assessment-run', { topicId: btn.dataset.startTest }));
  });
}
function renderAssessmentRun(topicId) {
  const t = TOPICS[topicId];
  if (!t) return renderNotFound();
  return `
    <button class="btn btn-ghost btn-sm" data-nav="assessment" style="margin-bottom:16px; padding-left:4px;">${icon('back')} Kembali</button>
    <div id="assessment-mount"></div>
  `;
}
function bindAssessmentRunEvents(topicId) {
  const t = TOPICS[topicId];
  if (!t) return;
  document.querySelectorAll('[data-nav]').forEach(btn => btn.addEventListener('click', () => navigate(btn.dataset.nav)));
  mountExerciseRunner('assessment-mount', t.exercises, (percent) => {
    completeTopic(topicId, percent);
  });
}

// ============================================================
// PAGE: PROGRESS
// ============================================================
function renderProgress() {
  const allProgress = Object.entries(STATE.progress).map(([id, p]) => ({ id, ...p }));
  const completed = allProgress.filter(p => ['completed','mastered'].includes(p.status));
  const avgScore = allProgress.length ? Math.round(allProgress.reduce((s,p) => s + p.bestScore, 0) / allProgress.length) : 0;
  const msTopics = getTopicsForLang('ms');
  const enTopics = getTopicsForLang('en');
  const msStarted = msTopics.filter(t => STATE.progress[t.id] && STATE.progress[t.id].status !== 'not-started').length;
  const enStarted = enTopics.filter(t => STATE.progress[t.id] && STATE.progress[t.id].status !== 'not-started').length;

  const weak = [...allProgress].filter(p => p.attempts > 0).sort((a,b) => a.bestScore - b.bestScore).slice(0,3);
  const strong = [...allProgress].filter(p => p.bestScore >= 80).sort((a,b) => b.bestScore - a.bestScore).slice(0,3);

  return `
    <p class="eyebrow">Statistik Pembelajaran</p>
    <h1 style="font-size:1.6rem; font-weight:600; margin-bottom:24px; display:flex; align-items:center; gap:10px;"><span style="width:24px;">${icon('trend')}</span> Progress</h1>

    <div style="display:grid; grid-template-columns:repeat(2,1fr); gap:10px; margin-bottom:20px;">
      <div class="card card-pad" style="text-align:center;"><p style="font-family:'Fraunces',serif; font-size:1.5rem; font-weight:600;">${completed.length}</p><p style="font-size:0.72rem; color:var(--ink-400);">Topik Selesai</p></div>
      <div class="card card-pad" style="text-align:center;"><p style="font-family:'Fraunces',serif; font-size:1.5rem; font-weight:600;">${avgScore}%</p><p style="font-size:0.72rem; color:var(--ink-400);">Purata Skor</p></div>
      <div class="card card-pad" style="text-align:center;"><p style="font-family:'Fraunces',serif; font-size:1.5rem; font-weight:600;">${STATE.xp}</p><p style="font-size:0.72rem; color:var(--ink-400);">Jumlah XP</p></div>
      <div class="card card-pad" style="text-align:center;"><p style="font-family:'Fraunces',serif; font-size:1.5rem; font-weight:600;">${getLevel(STATE.xp)}</p><p style="font-size:0.72rem; color:var(--ink-400);">Tahap</p></div>
    </div>

    <div style="display:grid; gap:10px; margin-bottom:20px;">
      <div class="card card-pad" style="display:flex; align-items:center; gap:14px;">
        ${progressRingSvg(msTopics.length ? (msStarted/msTopics.length)*100 : 0, 64, 'var(--melayu)')}
        <div><p style="font-weight:600;">🇲🇾 Bahasa Melayu</p><p style="font-size:0.82rem; color:var(--ink-400);">${msStarted} topik dimulakan</p></div>
      </div>
      <div class="card card-pad" style="display:flex; align-items:center; gap:14px;">
        ${progressRingSvg(enTopics.length ? (enStarted/enTopics.length)*100 : 0, 64, 'var(--english)')}
        <div><p style="font-weight:600;">🇬🇧 English Grammar</p><p style="font-size:0.82rem; color:var(--ink-400);">${enStarted} topics started</p></div>
      </div>
    </div>

    <div style="display:grid; gap:20px;">
      <div>
        <h2 style="font-size:0.95rem; font-weight:600; margin-bottom:10px; display:flex; align-items:center; gap:6px;"><span style="width:16px; color:var(--danger);">${icon('target')}</span> Topik Lemah</h2>
        ${weak.length === 0 ? '<p style="font-size:0.85rem; color:var(--ink-400);">Belum ada data.</p>' :
          weak.map(w => `<div class="card card-pad" style="display:flex; justify-content:space-between; margin-bottom:8px;"><span style="font-size:0.85rem;">${escapeHtml(TOPICS[w.id]?.title || w.id)}</span><span class="pill pill-danger">${w.bestScore}%</span></div>`).join('')}
      </div>
      <div>
        <h2 style="font-size:0.95rem; font-weight:600; margin-bottom:10px; display:flex; align-items:center; gap:6px;"><span style="width:16px; color:var(--success);">${icon('award')}</span> Topik Kuat</h2>
        ${strong.length === 0 ? '<p style="font-size:0.85rem; color:var(--ink-400);">Belum ada data.</p>' :
          strong.map(w => `<div class="card card-pad" style="display:flex; justify-content:space-between; margin-bottom:8px;"><span style="font-size:0.85rem;">${escapeHtml(TOPICS[w.id]?.title || w.id)}</span><span class="pill pill-success">${w.bestScore}%</span></div>`).join('')}
      </div>
    </div>
  `;
}
function bindProgressEvents() {}

// ============================================================
// PAGE: ACHIEVEMENTS
// ============================================================
const ACHIEVEMENTS = [
  { id: 'first-lesson', title: 'First Lesson', desc: 'Mulakan topik pertama anda.', icon: '🌱', check: (s, p) => p.some(x => x.status !== 'not-started') },
  { id: 'grammar-starter', title: 'Grammar Starter', desc: 'Selesaikan topik pertama anda.', icon: '📘', check: (s, p) => p.some(x => x.status === 'completed' || x.status === 'mastered') },
  { id: 'practice-champion', title: 'Practice Champion', desc: 'Cuba latihan 3 kali.', icon: '🏋️', check: (s, p) => p.reduce((sum, x) => sum + x.attempts, 0) >= 3 },
  { id: 'perfect-score', title: 'Perfect Score', desc: 'Dapatkan skor 100%.', icon: '💯', check: (s, p) => p.some(x => x.bestScore === 100) },
  { id: 'streak-3', title: '3 Days Streak', desc: 'Belajar 3 hari berturutan.', icon: '🔥', check: (s) => s.streakDays >= 3 },
  { id: 'xp-200', title: 'Explorer', desc: 'Kumpul 200 XP.', icon: '⭐', check: (s) => s.xp >= 200 },
];
function renderAchievements() {
  const progressArr = Object.values(STATE.progress);
  const unlocked = new Set(ACHIEVEMENTS.filter(a => a.check(STATE, progressArr)).map(a => a.id));
  return `
    <p class="eyebrow">Pencapaian Anda</p>
    <h1 style="font-size:1.6rem; font-weight:600; margin-bottom:4px; display:flex; align-items:center; gap:10px;"><span style="width:24px;">${icon('award')}</span> Achievements</h1>
    <p style="color:var(--ink-400); font-size:0.85rem; margin-bottom:24px;">${unlocked.size} / ${ACHIEVEMENTS.length} lencana dibuka</p>
    <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:10px;">
      ${ACHIEVEMENTS.map(a => `
        <div class="card card-pad" style="text-align:center; ${unlocked.has(a.id) ? '' : 'opacity:0.45;'}">
          <div style="font-size:2rem; margin-bottom:8px;">${unlocked.has(a.id) ? a.icon : '🔒'}</div>
          <p style="font-weight:600; font-size:0.78rem; margin-bottom:2px;">${escapeHtml(a.title)}</p>
          <p style="font-size:0.68rem; color:var(--ink-400);">${escapeHtml(a.desc)}</p>
        </div>
      `).join('')}
    </div>
  `;
}
function bindAchievementsEvents() {}

// ============================================================
// PAGE: SEARCH
// ============================================================
function renderSearch() {
  return `
    <h1 style="font-size:1.5rem; font-weight:600; margin-bottom:20px;">Carian</h1>
    <div style="position:relative; margin-bottom:20px;">
      <span style="position:absolute; left:16px; top:50%; transform:translateY(-50%); width:16px; color:var(--ink-100);">${icon('search')}</span>
      <input type="text" id="search-input" placeholder="Cari topik, tatabahasa, grammar…" style="width:100%; padding:13px 16px 13px 42px; border-radius:999px; border:2px solid var(--ink-50); background:transparent; font-size:0.88rem; outline:none;">
    </div>
    <div id="search-results"></div>
  `;
}
function bindSearchEvents() {
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  input.focus();
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { results.innerHTML = '<p style="text-align:center; color:var(--ink-400); padding:40px 0; font-size:0.85rem;">Mula menaip untuk mencari topik.</p>'; return; }
    const matches = Object.values(TOPICS).filter(t =>
      t.title.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q) || t.module.toLowerCase().includes(q)
    );
    if (!matches.length) { results.innerHTML = `<p style="text-align:center; color:var(--ink-400); padding:40px 0; font-size:0.85rem;">Tiada hasil untuk "${escapeHtml(input.value)}".</p>`; return; }
    results.innerHTML = `<div class="card">${matches.map(t => `
      <div class="topic-row" data-goto-topic="${t.id}">
        <div class="topic-row-left"><span style="font-weight:500; font-size:0.88rem;">${escapeHtml(t.title)}</span></div>
        <span class="pill ${t.lang === 'ms' ? 'pill-accent' : 'pill-neutral'}">${t.lang === 'ms' ? '🇲🇾' : '🇬🇧'}</span>
      </div>
    `).join('')}</div>`;
    results.querySelectorAll('[data-goto-topic]').forEach(el => {
      el.addEventListener('click', () => navigate('topic-detail', { topicId: el.dataset.gotoTopic }));
    });
  });
}

// ============================================================
// PAGE: SETTINGS
// ============================================================
function renderSettings() {
  return `
    <h1 style="font-size:1.6rem; font-weight:600; margin-bottom:24px;">Settings</h1>

    <div class="card card-pad" style="margin-bottom:14px;">
      <h2 style="font-weight:600; margin-bottom:12px; font-size:0.95rem;">Tema</h2>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
        <button class="btn ${STATE.themeMode==='light'?'btn-primary':'btn-outline'} btn-sm" data-set-theme="light">${icon('sun')} Terang</button>
        <button class="btn ${STATE.themeMode==='dark'?'btn-primary':'btn-outline'} btn-sm" data-set-theme="dark">${icon('moon')} Gelap</button>
      </div>
    </div>

    <div class="card card-pad" style="margin-bottom:14px;">
      <h2 style="font-weight:600; margin-bottom:4px; font-size:0.95rem;">Bahasa Pembelajaran Aktif</h2>
      <p style="font-size:0.8rem; color:var(--ink-400); margin-bottom:12px;">Tukar antara Bahasa Melayu dan English.</p>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
        <button class="btn ${STATE.activeLanguage==='ms'?'btn-primary':'btn-outline'} btn-sm" data-set-lang="ms">🇲🇾 Melayu</button>
        <button class="btn ${STATE.activeLanguage==='en'?'btn-primary':'btn-outline'} btn-sm" data-set-lang="en">🇬🇧 English</button>
      </div>
    </div>

    <div class="card card-pad" style="border-color:var(--danger);">
      <h2 style="font-weight:600; margin-bottom:4px; font-size:0.95rem; color:var(--danger);">Zon Bahaya</h2>
      <p style="font-size:0.8rem; color:var(--ink-400); margin-bottom:12px;">Tindakan ini tidak boleh dibatalkan.</p>
      <button class="btn btn-outline btn-sm" id="reset-btn">Reset Semua Progress</button>
    </div>
  `;
}
function bindSettingsEvents() {
  document.querySelectorAll('[data-set-theme]').forEach(btn => {
    btn.addEventListener('click', () => { STATE.themeMode = btn.dataset.setTheme; saveState(); applyTheme(); render(); });
  });
  document.querySelectorAll('[data-set-lang]').forEach(btn => {
    btn.addEventListener('click', () => { setLanguage(btn.dataset.setLang); render(); });
  });
  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) resetBtn.addEventListener('click', () => {
    if (confirm('Anda pasti mahu reset semua progress? Tindakan ini tidak boleh dibatalkan.')) {
      const lang = STATE.activeLanguage;
      const theme = STATE.themeMode;
      STATE = { xp:0, streakDays:0, lastActiveDate:null, themeMode:theme, fontScale:1, activeLanguage:lang, progress:{}, bookmarks:[], recentActivity:[] };
      saveState();
      toast('Progress telah direset.');
      navigate('dashboard');
    }
  });
}

// ============================================================
// PAGE: NOT FOUND
// ============================================================
function renderNotFound() {
  return `
    <div class="empty-state">
      <h2 style="font-size:1.2rem; margin-bottom:8px;">Halaman tidak ditemui</h2>
      <p style="margin-bottom:16px;">Laluan yang anda cari tidak wujud.</p>
      <button class="btn btn-primary" data-nav="dashboard">Kembali ke Laman Utama</button>
    </div>
  `;
}

// ============================================================
// INIT
// ============================================================
touchStreak();
applyAccent(STATE.activeLanguage);
applyTheme();
navigate(STATE.activeLanguage ? 'dashboard' : 'splash');
