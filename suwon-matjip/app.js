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

function getAllUsers() {
  return [DEFAULT_ACCOUNT, ...loadJSON(LS.users, [])];
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
  return RESTAURANTS.filter(r => {
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
  const r = RESTAURANTS.find(x => x.id === id);
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
    ? visits.map(v => `<li><span>${v.name}</span><span style="color:#9db8c0">${v.time}</span></li>`).join('')
    : '<li class="empty">아직 방문 기록이 없어요</li>';

  const menus = loadJSON(LS.recentMenu, []);
  const menuEl = document.getElementById('recent-menu-list');
  menuEl.innerHTML = menus.length
    ? menus.map(m => `<li><span>${m.rest} - ${m.menu}</span><span style="color:#9db8c0">${m.time}</span></li>`).join('')
    : '<li class="empty">아직 선택한 메뉴가 없어요</li>';
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

  const r = RESTAURANTS.find(x => x.id === currentRestId);
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
  const r = RESTAURANTS.find(x => x.id === currentRestId);
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

function scheduleAlarmTimeout(alarm) {
  const delay = alarm.datetime - Date.now();
  if (delay <= 0 || delay > MAX_TIMEOUT) return;
  setTimeout(() => fireAlarm(alarm.id), delay);
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

function renderReservationPanels() {
  const reservations = loadJSON(LS.reservations, []);
  const resEl = document.getElementById('reservation-list');
  resEl.innerHTML = reservations.length
    ? reservations.map(r => `
        <li>
          <span>${r.restName} (${r.date} ${r.time}, ${r.people}명)</span>
          <span class="del" data-del-res="${r.id}">삭제</span>
        </li>`).join('')
    : '<li class="empty">예약 내역이 없어요</li>';

  const alarms = loadJSON(LS.alarms, []);
  const alarmEl = document.getElementById('alarm-list');
  alarmEl.innerHTML = alarms.length
    ? alarms.map(a => `
        <li>
          <span>${a.fired ? '✅' : '⏰'} ${a.restName} (${a.date} ${a.time})</span>
          <span class="del" data-del-alarm="${a.id}">삭제</span>
        </li>`).join('')
    : '<li class="empty">설정된 알람이 없어요</li>';

  resEl.querySelectorAll('[data-del-res]').forEach(el => {
    el.addEventListener('click', () => {
      const id = Number(el.dataset.delRes);
      saveJSON(LS.reservations, loadJSON(LS.reservations, []).filter(r => r.id !== id));
      renderReservationPanels();
    });
  });
  alarmEl.querySelectorAll('[data-del-alarm]').forEach(el => {
    el.addEventListener('click', () => {
      const id = Number(el.dataset.delAlarm);
      saveJSON(LS.alarms, loadJSON(LS.alarms, []).filter(a => a.id !== id));
      renderReservationPanels();
    });
  });
}

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
