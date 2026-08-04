/* ============================================================
   수원 맛집 리스트 - 앱 로직
   ============================================================ */

/* ---------------- storage helpers ---------------- */
const LS = {
  users: 'smj_users',
  session: 'smj_session',
  selectedMenu: 'smj_selected_menu',
  recentVisits: 'smj_recent_visits',
  recentMenu: 'smj_recent_menu',
  reservations: 'smj_reservations',
  alarms: 'smj_alarms',
  customRestaurants: 'smj_custom_restaurants',
  restaurantOverrides: 'smj_restaurant_overrides',
  deletedRestaurants: 'smj_deleted_restaurants',
};

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

const DEFAULT_ACCOUNT = { id: 'multicampus', pw: '1234', name: '멀티캠퍼스' };
const PROVIDER_NAMES = ['카카오톡', '네이버', '구글'];

function getAllUsers() {
  const map = new Map();
  map.set(DEFAULT_ACCOUNT.id, DEFAULT_ACCOUNT);
  loadJSON(LS.users, []).forEach(u => map.set(u.id, u));
  return Array.from(map.values());
}

function upsertUser(user) {
  const stored = loadJSON(LS.users, []);
  const idx = stored.findIndex(u => u.id === user.id);
  if (idx >= 0) stored[idx] = { ...stored[idx], ...user };
  else stored.push(user);
  saveJSON(LS.users, stored);
}

function deleteUser(id) {
  saveJSON(LS.users, loadJSON(LS.users, []).filter(u => u.id !== id));
}

/* ============================================================
   맛집 데이터 CRUD (원본 data.js + localStorage 추가/수정/삭제 병합)
   ============================================================ */
function getAllRestaurants() {
  const overrides = loadJSON(LS.restaurantOverrides, {});
  const deleted = new Set(loadJSON(LS.deletedRestaurants, []));
  const seed = RESTAURANTS
    .filter(r => !deleted.has(r.id))
    .map(r => (overrides[r.id] ? { ...r, ...overrides[r.id] } : r));
  const custom = loadJSON(LS.customRestaurants, []).filter(r => !deleted.has(r.id));
  return [...seed, ...custom];
}

function getRestaurantById(id) {
  return getAllRestaurants().find(r => r.id === id);
}

function isCustomRestaurant(id) {
  return loadJSON(LS.customRestaurants, []).some(r => r.id === id);
}

function nextRestaurantId() {
  const ids = [...RESTAURANTS, ...loadJSON(LS.customRestaurants, [])].map(r => r.id);
  return Math.max(0, ...ids) + 1;
}

function createRestaurant(data) {
  const list = loadJSON(LS.customRestaurants, []);
  const r = { ...data, id: nextRestaurantId() };
  list.push(r);
  saveJSON(LS.customRestaurants, list);
  return r;
}

function updateRestaurant(id, data) {
  if (isCustomRestaurant(id)) {
    const list = loadJSON(LS.customRestaurants, []);
    const idx = list.findIndex(r => r.id === id);
    if (idx >= 0) list[idx] = { ...list[idx], ...data, id };
    saveJSON(LS.customRestaurants, list);
  } else {
    const overrides = loadJSON(LS.restaurantOverrides, {});
    overrides[id] = { ...(overrides[id] || {}), ...data };
    saveJSON(LS.restaurantOverrides, overrides);
  }
}

function deleteRestaurant(id) {
  if (isCustomRestaurant(id)) {
    saveJSON(LS.customRestaurants, loadJSON(LS.customRestaurants, []).filter(r => r.id !== id));
  } else {
    const deleted = loadJSON(LS.deletedRestaurants, []);
    if (!deleted.includes(id)) {
      deleted.push(id);
      saveJSON(LS.deletedRestaurants, deleted);
    }
  }
  const sel = loadJSON(LS.selectedMenu, {});
  delete sel[id];
  saveJSON(LS.selectedMenu, sel);
}

/* ---------------- toast ---------------- */
let toastTimer = null;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, 2600);
}

/* ============================================================
   인증 (로그인 / 회원가입)
   ============================================================ */
const viewLogin = document.getElementById('view-login');
const viewSignup = document.getElementById('view-signup');
const viewApp = document.getElementById('view-app');

function showView(view) {
  [viewLogin, viewSignup, viewApp].forEach(v => v.hidden = (v !== view));
}

document.getElementById('go-signup').addEventListener('click', (e) => {
  e.preventDefault();
  showView(viewSignup);
});
document.getElementById('go-login').addEventListener('click', (e) => {
  e.preventDefault();
  showView(viewLogin);
});

function enterApp(user) {
  saveJSON(LS.session, user);
  document.getElementById('nav-user').textContent = `👋 ${user.name}님`;
  showView(viewApp);
  initAppOnce();
}

document.getElementById('login-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('login-id').value.trim();
  const pw = document.getElementById('login-pw').value;
  const errEl = document.getElementById('login-error');
  const matched = getAllUsers().find(u => u.id === id && u.pw === pw);

  if (!matched) {
    errEl.textContent = '아이디 또는 비밀번호가 올바르지 않습니다.';
    errEl.hidden = false;
    return;
  }
  errEl.hidden = true;
  alert('테스트 페이지로 가상 승인 환경으로 넘어갑니다.');
  enterApp({ id: matched.id, name: matched.name });
});

document.querySelectorAll('.btn-social').forEach(btn => {
  btn.addEventListener('click', () => {
    const provider = btn.dataset.provider;
    alert('테스트 페이지로 가상 승인 환경으로 넘어갑니다.');
    enterApp({ id: provider, name: `${provider} 사용자` });
  });
});

document.getElementById('signup-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('signup-name').value.trim();
  const id = document.getElementById('signup-id').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const pw = document.getElementById('signup-pw').value;
  const pw2 = document.getElementById('signup-pw2').value;
  const errEl = document.getElementById('signup-error');

  if (pw !== pw2) {
    errEl.textContent = '비밀번호가 일치하지 않습니다.';
    errEl.hidden = false;
    return;
  }
  if (getAllUsers().some(u => u.id === id)) {
    errEl.textContent = '이미 사용 중인 아이디입니다.';
    errEl.hidden = false;
    return;
  }
  errEl.hidden = true;
  const users = loadJSON(LS.users, []);
  users.push({ id, pw, name, email });
  saveJSON(LS.users, users);
  alert('회원가입이 완료되었습니다! 로그인해주세요.');
  document.getElementById('signup-form').reset();
  document.getElementById('login-id').value = id;
  showView(viewLogin);
});

document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem(LS.session);
  showView(viewLogin);
});

/* ============================================================
   메인 앱
   ============================================================ */
let appInitialized = false;
let filterState = { main: 'all', sub: 'all', situation: null, search: '' };

function initAppOnce() {
  if (appInitialized) { renderCards(); return; }
  appInitialized = true;
  renderMainCats();
  renderSituationChips();
  renderCards();
  renderRecentPanels();
  renderReservationPanels();
  scheduleAllPendingAlarms();
}

/* ---------------- 카테고리 렌더링 ---------------- */
function renderMainCats() {
  const wrap = document.getElementById('main-cats');
  wrap.innerHTML = '';
  const allChip = makeChip('전체', filterState.main === 'all', () => selectMainCat('all'));
  wrap.appendChild(allChip);
  Object.entries(CATEGORIES).forEach(([key, cat]) => {
    const chip = makeChip(`${cat.emoji} ${cat.label}`, filterState.main === key, () => selectMainCat(key));
    wrap.appendChild(chip);
  });
  renderSubCats();
}

function makeChip(label, active, onClick) {
  const el = document.createElement('button');
  el.className = 'cat-chip' + (active ? ' active' : '');
  el.textContent = label;
  el.addEventListener('click', onClick);
  return el;
}

function selectMainCat(key) {
  filterState.main = key;
  filterState.sub = 'all';
  renderMainCats();
  renderCards();
}

function renderSubCats() {
  const wrap = document.getElementById('sub-cats');
  wrap.innerHTML = '';
  if (filterState.main === 'all') return;
  const cat = CATEGORIES[filterState.main];
  wrap.appendChild(makeChip(cat.label, filterState.sub === 'all', () => { filterState.sub = 'all'; renderSubCats(); renderCards(); }));
  Object.entries(cat.subs).forEach(([subKey, subLabel]) => {
    wrap.appendChild(makeChip(subLabel, filterState.sub === subKey, () => { filterState.sub = subKey; renderSubCats(); renderCards(); }));
  });
}

function renderSituationChips() {
  const wrap = document.getElementById('situation-chips');
  wrap.innerHTML = '';
  Object.entries(SITUATION_TAGS).forEach(([key, tag]) => {
    const chip = document.createElement('button');
    chip.className = 'situation-chip' + (filterState.situation === key ? ' active' : '');
    chip.textContent = `${tag.emoji} ${tag.label}`;
    chip.addEventListener('click', () => {
      filterState.situation = filterState.situation === key ? null : key;
      renderSituationChips();
      renderCards();
    });
    wrap.appendChild(chip);
  });
}

document.getElementById('search-input').addEventListener('input', (e) => {
  filterState.search = e.target.value.trim();
  renderCards();
});

/* ---------------- 카드 렌더링 ---------------- */
function getSelectedMenu(restId) {
  const all = loadJSON(LS.selectedMenu, {});
  return all[restId] || [];
}

function buildHoursHTML(hours) {
  const todayKey = WEEK_DAYS[(new Date().getDay() + 6) % 7];
  return `<ul class="hours-list">${WEEK_DAYS.map(d => `
    <li class="${d === todayKey ? 'today' : ''}"><span>${WEEK_DAY_LABELS[d]}요일</span><span>${hours[d]}</span></li>
  `).join('')}</ul>`;
}

function filteredRestaurants() {
  return getAllRestaurants().filter(r => {
    if (filterState.main !== 'all' && r.category !== filterState.main) return false;
    if (filterState.sub !== 'all' && r.sub !== filterState.sub) return false;
    if (filterState.situation && !r.tags.includes(filterState.situation)) return false;
    if (filterState.search && !r.name.includes(filterState.search)) return false;
    return true;
  });
}

function renderCards() {
  const grid = document.getElementById('card-grid');
  const emptyState = document.getElementById('empty-state');
  const list = filteredRestaurants();
  grid.innerHTML = '';
  emptyState.hidden = list.length > 0;

  list.forEach(r => {
    const card = document.createElement('article');
    card.className = 'rcard';
    const selected = getSelectedMenu(r.id);
    const cat = CATEGORIES[r.category];
    card.innerHTML = `
      <div class="rcard-top">
        <span class="rcard-emoji">${getDishIcon(r.category, r.sub)}</span>
        <div>
          <p class="rcard-name">${r.name}</p>
          <span class="rcard-dong">${r.dong}</span>
        </div>
      </div>
      <div class="rcard-badges">
        <span class="badge">${cat.emoji} ${cat.label} · ${cat.subs[r.sub]}</span>
        ${r.tags.map(t => `<span class="badge tag">${SITUATION_TAGS[t].emoji} ${SITUATION_TAGS[t].label}</span>`).join('')}
      </div>
      <div class="rcard-rating">⭐ ${r.rating.toFixed(1)} <span style="color:#7a9aa5;font-weight:400;">(${r.reviewCount})</span></div>
      <div class="rcard-addr-row">
        <span class="rcard-addr">📍 ${r.address}</span>
        <button type="button" class="hours-toggle">🕒 영업시간</button>
      </div>
      <div class="hours-panel" hidden>${buildHoursHTML(r.hours)}</div>
      ${selected.length ? `<div class="rcard-selected">✅ 선택한 메뉴 ${selected.length}개</div>` : ''}
    `;
    card.addEventListener('click', () => openModal(r.id));

    const hoursBtn = card.querySelector('.hours-toggle');
    const hoursPanel = card.querySelector('.hours-panel');
    hoursBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const willShow = hoursPanel.hidden;
      hoursPanel.hidden = !willShow;
      hoursBtn.classList.toggle('open', willShow);
    });

    grid.appendChild(card);
  });
}

/* ============================================================
   상세 모달
   ============================================================ */
let currentRestId = null;

function openModal(id) {
  currentRestId = id;
  const r = getRestaurantById(id);
  const cat = CATEGORIES[r.category];

  document.getElementById('modal-emoji').innerHTML = getDishIcon(r.category, r.sub);
  document.getElementById('modal-name').textContent = r.name;
  document.getElementById('modal-cat-badge').textContent = `${cat.emoji} ${cat.label} · ${cat.subs[r.sub]}`;

  document.querySelector('.panel-sub-info').textContent = `${r.dong} · ⭐ ${r.rating.toFixed(1)} (${r.reviewCount}건)`;
  document.getElementById('panel-address').textContent = r.address;
  document.getElementById('panel-map-link').href = `https://map.naver.com/v5/search/${encodeURIComponent(r.address)}`;
  document.getElementById('panel-phone').textContent = r.phone;
  document.getElementById('panel-call-link').href = `tel:${r.phone.replace(/-/g, '')}`;

  renderRatingPanel(r);
  renderMenuPanel(r);
  renderSelectedMenuPanel(r);

  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === 'info'));
  document.querySelectorAll('.tab-panel').forEach(p => p.hidden = p.dataset.panel !== 'info');
  document.getElementById('reserve-form').hidden = true;
  document.getElementById('alarm-form').hidden = true;

  document.getElementById('detail-modal').hidden = false;
  logRecentVisit(r);
}

document.getElementById('modal-close').addEventListener('click', () => {
  document.getElementById('detail-modal').hidden = true;
  currentRestId = null;
});
document.getElementById('detail-modal').addEventListener('click', (e) => {
  if (e.target.id === 'detail-modal') {
    document.getElementById('detail-modal').hidden = true;
    currentRestId = null;
  }
});

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tab-panel').forEach(p => p.hidden = p.dataset.panel !== btn.dataset.tab);
  });
});

function renderRatingPanel(r) {
  document.getElementById('panel-rating-num').textContent = r.rating.toFixed(1);
  const fullStars = Math.round(r.rating);
  document.getElementById('panel-stars').textContent = '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
  document.getElementById('panel-review-count').textContent = `리뷰 ${r.reviewCount}건 기준`;

  let dist;
  if (r.rating >= 4.6) dist = [72, 20, 5, 2, 1];
  else if (r.rating >= 4.3) dist = [55, 30, 10, 3, 2];
  else if (r.rating >= 4.0) dist = [42, 33, 15, 6, 4];
  else dist = [30, 30, 20, 12, 8];

  const barsEl = document.getElementById('rating-bars');
  barsEl.innerHTML = dist.map((pct, i) => `
    <div class="rbar-row">
      <span>${5 - i}★</span>
      <div class="rbar-track"><div class="rbar-fill" style="width:${pct}%"></div></div>
      <span>${pct}%</span>
    </div>
  `).join('');
}

function renderMenuPanel(r) {
  const selected = getSelectedMenu(r.id);
  const listEl = document.getElementById('panel-menu-list');
  listEl.innerHTML = r.menu.map(item => `
    <li>
      <label>
        <span>
          <input type="checkbox" data-menu-name="${item.name}" ${selected.includes(item.name) ? 'checked' : ''}>
          ${item.name}
        </span>
        <span class="menu-price">${item.price ? item.price.toLocaleString() + '원' : '무료'}</span>
      </label>
    </li>
  `).join('');

  listEl.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => toggleMenuSelection(r, cb.dataset.menuName, cb.checked));
  });
}

function toggleMenuSelection(r, menuName, checked) {
  const all = loadJSON(LS.selectedMenu, {});
  const cur = new Set(all[r.id] || []);
  if (checked) {
    cur.add(menuName);
    logRecentMenu(r, menuName);
  } else {
    cur.delete(menuName);
  }
  all[r.id] = Array.from(cur);
  saveJSON(LS.selectedMenu, all);
  renderSelectedMenuPanel(r);
  renderCards();
}

function renderSelectedMenuPanel(r) {
  const selected = getSelectedMenu(r.id);
  const listEl = document.getElementById('selected-menu-list');
  if (!selected.length) {
    listEl.innerHTML = '<li class="empty">체크한 메뉴가 여기에 표시돼요</li>';
    return;
  }
  listEl.innerHTML = selected.map(name => {
    const item = r.menu.find(m => m.name === name);
    return `<li><span>${name}</span><span>${item ? item.price.toLocaleString() + '원' : ''}</span></li>`;
  }).join('');
}

/* ============================================================
   최근 방문 / 최근 메뉴
   ============================================================ */
function logRecentVisit(r) {
  const list = loadJSON(LS.recentVisits, []);
  const filtered = list.filter(v => v.id !== r.id);
  filtered.unshift({ id: r.id, name: r.name, time: nowLabel() });
  saveJSON(LS.recentVisits, filtered.slice(0, 8));
  renderRecentPanels();
}

function logRecentMenu(r, menuName) {
  const list = loadJSON(LS.recentMenu, []);
  list.unshift({ rest: r.name, menu: menuName, time: nowLabel() });
  saveJSON(LS.recentMenu, list.slice(0, 8));
  renderRecentPanels();
}

function nowLabel() {
  const d = new Date();
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function renderRecentPanels() {
  const visits = loadJSON(LS.recentVisits, []);
  const visitEl = document.getElementById('recent-visits-list');
  visitEl.innerHTML = visits.length
    ? visits.map((v, i) => `
        <li>
          <span>${v.name}</span>
          <span class="recent-meta"><span style="color:#9db8c0">${v.time}</span><span class="del" data-del-visit="${i}">✕</span></span>
        </li>`).join('')
    : '<li class="empty">아직 방문 기록이 없어요</li>';

  const menus = loadJSON(LS.recentMenu, []);
  const menuEl = document.getElementById('recent-menu-list');
  menuEl.innerHTML = menus.length
    ? menus.map((m, i) => `
        <li>
          <span>${m.rest} - ${m.menu}</span>
          <span class="recent-meta"><span style="color:#9db8c0">${m.time}</span><span class="del" data-del-menu="${i}">✕</span></span>
        </li>`).join('')
    : '<li class="empty">아직 선택한 메뉴가 없어요</li>';

  visitEl.querySelectorAll('[data-del-visit]').forEach(el => {
    el.addEventListener('click', () => {
      const idx = Number(el.dataset.delVisit);
      const list = loadJSON(LS.recentVisits, []);
      list.splice(idx, 1);
      saveJSON(LS.recentVisits, list);
      renderRecentPanels();
    });
  });
  menuEl.querySelectorAll('[data-del-menu]').forEach(el => {
    el.addEventListener('click', () => {
      const idx = Number(el.dataset.delMenu);
      const list = loadJSON(LS.recentMenu, []);
      list.splice(idx, 1);
      saveJSON(LS.recentMenu, list);
      renderRecentPanels();
    });
  });
}

document.getElementById('recent-toggle').addEventListener('click', (e) => {
  e.currentTarget.classList.toggle('open');
  document.getElementById('reservation-toggle').classList.remove('open');
});
document.getElementById('reservation-toggle').addEventListener('click', (e) => {
  e.currentTarget.classList.toggle('open');
  document.getElementById('recent-toggle').classList.remove('open');
});
document.addEventListener('click', (e) => {
  if (!e.target.closest('#recent-toggle')) document.getElementById('recent-toggle').classList.remove('open');
  if (!e.target.closest('#reservation-toggle')) document.getElementById('reservation-toggle').classList.remove('open');
});

/* ============================================================
   방문 예약 / 방문일 알람
   ============================================================ */
document.getElementById('reserve-btn').addEventListener('click', () => {
  document.getElementById('alarm-form').hidden = true;
  document.getElementById('reserve-form').hidden = !document.getElementById('reserve-form').hidden;
});
document.getElementById('alarm-btn').addEventListener('click', () => {
  document.getElementById('reserve-form').hidden = true;
  document.getElementById('alarm-form').hidden = !document.getElementById('alarm-form').hidden;
  if (!document.getElementById('alarm-form').hidden && 'Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
});

document.getElementById('reserve-confirm').addEventListener('click', () => {
  const date = document.getElementById('reserve-date').value;
  const time = document.getElementById('reserve-time').value;
  const people = document.getElementById('reserve-people').value;
  if (!date || !time) { showToast('날짜와 시간을 입력해주세요'); return; }

  const r = getRestaurantById(currentRestId);
  const list = loadJSON(LS.reservations, []);
  list.unshift({ id: Date.now(), restId: r.id, restName: r.name, date, time, people });
  saveJSON(LS.reservations, list);
  renderReservationPanels();
  document.getElementById('reserve-form').hidden = true;
  showToast(`📌 ${r.name} 방문 예약이 완료되었습니다`);
});

document.getElementById('alarm-confirm').addEventListener('click', () => {
  const date = document.getElementById('alarm-date').value;
  const time = document.getElementById('alarm-time').value;
  if (!date || !time) { showToast('날짜와 시간을 입력해주세요'); return; }

  const target = new Date(`${date}T${time}:00`);
  if (isNaN(target.getTime()) || target.getTime() <= Date.now()) {
    showToast('미래 시점의 날짜/시간을 선택해주세요');
    return;
  }
  const r = getRestaurantById(currentRestId);
  const alarm = { id: Date.now(), restId: r.id, restName: r.name, date, time, datetime: target.getTime(), fired: false };
  const list = loadJSON(LS.alarms, []);
  list.unshift(alarm);
  saveJSON(LS.alarms, list);
  renderReservationPanels();
  scheduleAlarmTimeout(alarm);
  document.getElementById('alarm-form').hidden = true;
  showToast(`🔔 ${r.name} 방문일 알람이 설정되었습니다`);
});

const MAX_TIMEOUT = 2147483647; // setTimeout 최대값 (~24.8일)
const alarmTimers = new Map();

function clearAlarmTimeout(id) {
  if (alarmTimers.has(id)) {
    clearTimeout(alarmTimers.get(id));
    alarmTimers.delete(id);
  }
}

function scheduleAlarmTimeout(alarm) {
  clearAlarmTimeout(alarm.id);
  const delay = alarm.datetime - Date.now();
  if (delay <= 0 || delay > MAX_TIMEOUT) return;
  alarmTimers.set(alarm.id, setTimeout(() => fireAlarm(alarm.id), delay));
}

function scheduleAllPendingAlarms() {
  const list = loadJSON(LS.alarms, []);
  list.forEach(a => {
    if (!a.fired && a.datetime > Date.now()) scheduleAlarmTimeout(a);
  });
}

function fireAlarm(alarmId) {
  const list = loadJSON(LS.alarms, []);
  const alarm = list.find(a => a.id === alarmId);
  if (!alarm || alarm.fired) return;
  alarm.fired = true;
  saveJSON(LS.alarms, list);

  const msg = `🔔 오늘은 [${alarm.restName}] 방문 예정일이에요!`;
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('먹GO', { body: msg });
  } else {
    showToast(msg);
  }
  renderReservationPanels();
}

let editingReservationId = null;
let editingAlarmId = null;

function renderReservationPanels() {
  const reservations = loadJSON(LS.reservations, []);
  const resEl = document.getElementById('reservation-list');
  resEl.innerHTML = reservations.length
    ? reservations.map(r => r.id === editingReservationId ? `
        <li class="edit-row">
          <input type="date" class="edit-date" value="${r.date}">
          <input type="time" class="edit-time" value="${r.time}">
          <input type="number" class="edit-people" min="1" value="${r.people}">
          <span class="row-actions">
            <span class="edit" data-save-res="${r.id}">저장</span>
            <span class="del" data-cancel-res="${r.id}">취소</span>
          </span>
        </li>` : `
        <li>
          <span>${r.restName} (${r.date} ${r.time}, ${r.people}명)</span>
          <span class="row-actions">
            <span class="edit" data-edit-res="${r.id}">수정</span>
            <span class="del" data-del-res="${r.id}">삭제</span>
          </span>
        </li>`).join('')
    : '<li class="empty">예약 내역이 없어요</li>';

  const alarms = loadJSON(LS.alarms, []);
  const alarmEl = document.getElementById('alarm-list');
  alarmEl.innerHTML = alarms.length
    ? alarms.map(a => a.id === editingAlarmId ? `
        <li class="edit-row">
          <input type="date" class="edit-date" value="${a.date}">
          <input type="time" class="edit-time" value="${a.time}">
          <span class="row-actions">
            <span class="edit" data-save-alarm="${a.id}">저장</span>
            <span class="del" data-cancel-alarm="${a.id}">취소</span>
          </span>
        </li>` : `
        <li>
          <span>${a.fired ? '✅' : '⏰'} ${a.restName} (${a.date} ${a.time})</span>
          <span class="row-actions">
            <span class="edit" data-edit-alarm="${a.id}">수정</span>
            <span class="del" data-del-alarm="${a.id}">삭제</span>
          </span>
        </li>`).join('')
    : '<li class="empty">설정된 알람이 없어요</li>';

  resEl.querySelectorAll('[data-edit-res]').forEach(el => {
    el.addEventListener('click', () => { editingReservationId = Number(el.dataset.editRes); renderReservationPanels(); });
  });
  resEl.querySelectorAll('[data-cancel-res]').forEach(el => {
    el.addEventListener('click', () => { editingReservationId = null; renderReservationPanels(); });
  });
  resEl.querySelectorAll('[data-save-res]').forEach(el => {
    el.addEventListener('click', () => {
      const id = Number(el.dataset.saveRes);
      const li = el.closest('li');
      const date = li.querySelector('.edit-date').value;
      const time = li.querySelector('.edit-time').value;
      const people = li.querySelector('.edit-people').value;
      if (!date || !time || !people) { showToast('모든 값을 입력해주세요'); return; }
      const list = loadJSON(LS.reservations, []);
      const idx = list.findIndex(r => r.id === id);
      if (idx >= 0) { list[idx] = { ...list[idx], date, time, people }; saveJSON(LS.reservations, list); }
      editingReservationId = null;
      renderReservationPanels();
      showToast('예약이 수정되었습니다');
    });
  });
  resEl.querySelectorAll('[data-del-res]').forEach(el => {
    el.addEventListener('click', () => {
      const id = Number(el.dataset.delRes);
      saveJSON(LS.reservations, loadJSON(LS.reservations, []).filter(r => r.id !== id));
      renderReservationPanels();
    });
  });

  alarmEl.querySelectorAll('[data-edit-alarm]').forEach(el => {
    el.addEventListener('click', () => { editingAlarmId = Number(el.dataset.editAlarm); renderReservationPanels(); });
  });
  alarmEl.querySelectorAll('[data-cancel-alarm]').forEach(el => {
    el.addEventListener('click', () => { editingAlarmId = null; renderReservationPanels(); });
  });
  alarmEl.querySelectorAll('[data-save-alarm]').forEach(el => {
    el.addEventListener('click', () => {
      const id = Number(el.dataset.saveAlarm);
      const li = el.closest('li');
      const date = li.querySelector('.edit-date').value;
      const time = li.querySelector('.edit-time').value;
      const target = new Date(`${date}T${time}:00`);
      if (!date || !time || isNaN(target.getTime()) || target.getTime() <= Date.now()) {
        showToast('미래 시점의 날짜/시간을 선택해주세요');
        return;
      }
      const list = loadJSON(LS.alarms, []);
      const idx = list.findIndex(a => a.id === id);
      if (idx >= 0) {
        list[idx] = { ...list[idx], date, time, datetime: target.getTime(), fired: false };
        saveJSON(LS.alarms, list);
        scheduleAlarmTimeout(list[idx]);
      }
      editingAlarmId = null;
      renderReservationPanels();
      showToast('알람이 수정되었습니다');
    });
  });
  alarmEl.querySelectorAll('[data-del-alarm]').forEach(el => {
    el.addEventListener('click', () => {
      const id = Number(el.dataset.delAlarm);
      clearAlarmTimeout(id);
      saveJSON(LS.alarms, loadJSON(LS.alarms, []).filter(a => a.id !== id));
      renderReservationPanels();
    });
  });
}

/* ============================================================
   맛집 관리 모달 (Create / Update / Delete)
   ============================================================ */
const manageModal = document.getElementById('manage-modal');
const manageListView = document.getElementById('manage-list-view');
const manageFormView = document.getElementById('manage-form-view');

document.getElementById('manage-open-btn').addEventListener('click', () => {
  showManageList();
  manageModal.hidden = false;
});
document.getElementById('manage-close').addEventListener('click', () => { manageModal.hidden = true; });
manageModal.addEventListener('click', (e) => { if (e.target === manageModal) manageModal.hidden = true; });

function showManageList() {
  manageFormView.hidden = true;
  manageListView.hidden = false;
  renderManageList();
}

function renderManageList() {
  const listEl = document.getElementById('manage-list');
  const all = getAllRestaurants();
  listEl.innerHTML = all.map(r => `
    <li>
      <span class="manage-list-icon">${getDishIcon(r.category, r.sub)}</span>
      <span class="manage-list-info">
        <b>${r.name}</b>
        <span>${CATEGORIES[r.category].label} · ${CATEGORIES[r.category].subs[r.sub]} · ${r.dong}</span>
      </span>
      <span class="row-actions">
        <span class="edit" data-manage-edit="${r.id}">수정</span>
        <span class="del" data-manage-del="${r.id}">삭제</span>
      </span>
    </li>
  `).join('');

  listEl.querySelectorAll('[data-manage-edit]').forEach(el => {
    el.addEventListener('click', () => openManageForm(Number(el.dataset.manageEdit)));
  });
  listEl.querySelectorAll('[data-manage-del]').forEach(el => {
    el.addEventListener('click', () => {
      if (el.dataset.confirm !== '1') {
        el.dataset.confirm = '1';
        el.textContent = '정말 삭제?';
        setTimeout(() => { el.dataset.confirm = '0'; el.textContent = '삭제'; }, 3000);
        return;
      }
      const id = Number(el.dataset.manageDel);
      deleteRestaurant(id);
      renderManageList();
      renderCards();
      showToast('맛집이 삭제되었습니다');
    });
  });
}

function populateCategorySelect(selected) {
  const sel = document.getElementById('manage-category');
  sel.innerHTML = Object.entries(CATEGORIES).map(([key, c]) => `<option value="${key}">${c.emoji} ${c.label}</option>`).join('');
  sel.value = selected || Object.keys(CATEGORIES)[0];
}
function populateSubSelect(categoryKey, selected) {
  const sel = document.getElementById('manage-sub');
  const subs = CATEGORIES[categoryKey].subs;
  sel.innerHTML = Object.entries(subs).map(([key, label]) => `<option value="${key}">${label}</option>`).join('');
  if (selected) sel.value = selected;
}
document.getElementById('manage-category').addEventListener('change', (e) => populateSubSelect(e.target.value));

function populateTagCheckboxes(selectedTags) {
  const wrap = document.getElementById('manage-tags');
  wrap.innerHTML = Object.entries(SITUATION_TAGS).map(([key, t]) => `
    <label class="manage-tag-chip">
      <input type="checkbox" value="${key}" ${(selectedTags || []).includes(key) ? 'checked' : ''}> ${t.emoji} ${t.label}
    </label>
  `).join('');
}

function populateClosedDayCheckboxes(hours) {
  const wrap = document.getElementById('manage-closed-days');
  wrap.innerHTML = WEEK_DAYS.map(d => `
    <label class="manage-tag-chip">
      <input type="checkbox" value="${d}" ${hours && hours[d] === '정기휴무' ? 'checked' : ''}> ${WEEK_DAY_LABELS[d]}
    </label>
  `).join('');
}

function addMenuRow(name, price) {
  const wrap = document.getElementById('manage-menu-rows');
  const row = document.createElement('div');
  row.className = 'manage-menu-row';
  row.innerHTML = `
    <input type="text" placeholder="메뉴명" class="menu-row-name" value="${name || ''}">
    <input type="number" placeholder="가격" class="menu-row-price" min="0" value="${price != null ? price : ''}">
    <button type="button" class="menu-row-remove">✕</button>
  `;
  row.querySelector('.menu-row-remove').addEventListener('click', () => row.remove());
  wrap.appendChild(row);
}
document.getElementById('manage-menu-add').addEventListener('click', () => addMenuRow());

function openManageForm(id) {
  manageListView.hidden = true;
  manageFormView.hidden = false;

  const r = id != null ? getRestaurantById(id) : null;
  document.getElementById('manage-form-title').textContent = r ? '맛집 정보 수정' : '새 맛집 추가';
  document.getElementById('manage-form-id').value = r ? r.id : '';
  document.getElementById('manage-name').value = r ? r.name : '';

  populateCategorySelect(r ? r.category : null);
  populateSubSelect(document.getElementById('manage-category').value, r ? r.sub : null);

  document.getElementById('manage-dong').value = r ? r.dong : '';
  document.getElementById('manage-address').value = r ? r.address : '';
  document.getElementById('manage-phone').value = r ? r.phone : '';
  document.getElementById('manage-rating').value = r ? r.rating : 4.5;
  document.getElementById('manage-review-count').value = r ? r.reviewCount : 0;
  populateTagCheckboxes(r ? r.tags : []);
  populateClosedDayCheckboxes(r ? r.hours : null);
  document.getElementById('manage-hours-range').value = r
    ? (WEEK_DAYS.map(d => r.hours[d]).find(v => v !== '정기휴무') || '10:00-22:00')
    : '10:00-22:00';

  document.getElementById('manage-menu-rows').innerHTML = '';
  if (r && r.menu.length) r.menu.forEach(m => addMenuRow(m.name, m.price));
  else addMenuRow();
}

document.getElementById('manage-add-btn').addEventListener('click', () => openManageForm(null));
document.getElementById('manage-cancel').addEventListener('click', showManageList);

document.getElementById('manage-form-view').addEventListener('submit', (e) => {
  e.preventDefault();
  const idVal = document.getElementById('manage-form-id').value;
  const id = idVal ? Number(idVal) : null;

  const name = document.getElementById('manage-name').value.trim();
  const category = document.getElementById('manage-category').value;
  const sub = document.getElementById('manage-sub').value;
  const dong = document.getElementById('manage-dong').value.trim();
  const address = document.getElementById('manage-address').value.trim();
  const phone = document.getElementById('manage-phone').value.trim();
  const rating = parseFloat(document.getElementById('manage-rating').value);
  const reviewCount = parseInt(document.getElementById('manage-review-count').value, 10) || 0;
  const tags = Array.from(document.querySelectorAll('#manage-tags input:checked')).map(cb => cb.value);
  const closedDays = Array.from(document.querySelectorAll('#manage-closed-days input:checked')).map(cb => cb.value);
  const hoursRange = document.getElementById('manage-hours-range').value.trim() || '10:00-22:00';
  const hours = withClosed(hoursRange, closedDays);
  const menu = Array.from(document.querySelectorAll('.manage-menu-row')).map(row => ({
    name: row.querySelector('.menu-row-name').value.trim(),
    price: parseInt(row.querySelector('.menu-row-price').value, 10) || 0,
  })).filter(m => m.name);

  if (!name || !address || !phone || !menu.length || isNaN(rating)) {
    showToast('필수 항목을 모두 입력해주세요');
    return;
  }

  const data = { name, category, sub, dong, address, phone, rating, reviewCount, tags, hours, menu, emoji: CATEGORIES[category].emoji };

  if (id != null) {
    updateRestaurant(id, data);
    showToast('맛집 정보가 수정되었습니다');
  } else {
    createRestaurant(data);
    showToast('새 맛집이 등록되었습니다');
  }
  showManageList();
  renderCards();
});

/* ============================================================
   내 정보 관리 (Update / 회원 탈퇴)
   ============================================================ */
document.getElementById('nav-user').addEventListener('click', openProfileModal);

function openProfileModal() {
  const session = loadJSON(LS.session, null);
  if (!session) return;
  const isProvider = PROVIDER_NAMES.includes(session.id);
  const stored = getAllUsers().find(u => u.id === session.id);

  document.getElementById('profile-name').value = session.name;
  document.getElementById('profile-email-label').hidden = isProvider;
  document.getElementById('profile-pw-label').hidden = isProvider;
  document.getElementById('profile-email').value = stored ? (stored.email || '') : '';
  document.getElementById('profile-pw').value = '';
  document.getElementById('profile-hint').textContent = isProvider
    ? `${session.id} 로그인 계정은 표시 이름만 수정할 수 있어요.`
    : '비밀번호는 변경할 때만 입력하세요.';
  const delBtn = document.getElementById('profile-delete-btn');
  delBtn.dataset.confirm = '0';
  delBtn.textContent = '회원 탈퇴';
  document.getElementById('profile-modal').hidden = false;
}
document.getElementById('profile-close').addEventListener('click', () => { document.getElementById('profile-modal').hidden = true; });
document.getElementById('profile-modal').addEventListener('click', (e) => {
  if (e.target.id === 'profile-modal') document.getElementById('profile-modal').hidden = true;
});

document.getElementById('profile-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const session = loadJSON(LS.session, null);
  if (!session) return;
  const isProvider = PROVIDER_NAMES.includes(session.id);
  const name = document.getElementById('profile-name').value.trim();
  if (!name) { showToast('이름을 입력해주세요'); return; }

  if (isProvider) {
    session.name = name;
  } else {
    const email = document.getElementById('profile-email').value.trim();
    const pw = document.getElementById('profile-pw').value;
    const existing = getAllUsers().find(u => u.id === session.id) || {};
    upsertUser({ id: session.id, name, email, pw: pw || existing.pw || '' });
    session.name = name;
  }
  saveJSON(LS.session, session);
  document.getElementById('nav-user').textContent = `👋 ${name}님`;
  document.getElementById('profile-modal').hidden = true;
  showToast('내 정보가 저장되었습니다');
});

document.getElementById('profile-delete-btn').addEventListener('click', (e) => {
  const btn = e.currentTarget;
  if (btn.dataset.confirm !== '1') {
    btn.dataset.confirm = '1';
    btn.textContent = '정말 탈퇴하시겠어요? (다시 클릭)';
    setTimeout(() => { btn.dataset.confirm = '0'; btn.textContent = '회원 탈퇴'; }, 3000);
    return;
  }
  const session = loadJSON(LS.session, null);
  if (session && !PROVIDER_NAMES.includes(session.id)) {
    deleteUser(session.id);
  }
  localStorage.removeItem(LS.session);
  document.getElementById('profile-modal').hidden = true;
  showToast('회원 탈퇴가 처리되었습니다');
  showView(viewLogin);
});

/* ============================================================
   초기 진입: 세션 있으면 바로 앱 화면
   ============================================================ */
(function bootstrap() {
  const session = loadJSON(LS.session, null);
  if (session) {
    document.getElementById('nav-user').textContent = `👋 ${session.name}님`;
    showView(viewApp);
    initAppOnce();
  } else {
    showView(viewLogin);
  }
})();
