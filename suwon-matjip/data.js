/* ============================================================
   수원 맛집 리스트 - 데이터 (데모용 샘플 데이터)
   ※ 실제 네이버/배달앱 실시간 연동이 아닌, 수원시 각 구를 기반으로 한
     프로토타입 데모용 예시 데이터입니다.
   ============================================================ */

const WEEK_DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const WEEK_DAY_LABELS = { mon: '월', tue: '화', wed: '수', thu: '목', fri: '금', sat: '토', sun: '일' };

function dailyHours(range) {
  const o = {};
  WEEK_DAYS.forEach(d => { o[d] = range; });
  return o;
}
function withClosed(range, closedDays) {
  const o = dailyHours(range);
  (Array.isArray(closedDays) ? closedDays : [closedDays]).forEach(d => { o[d] = '정기휴무'; });
  return o;
}

const CATEGORIES = {
  korean:      { label: '한식',      emoji: '🍚', subs: { soup: '국', tang: '탕', jjigae: '찌개', jorim: '조림', baekban: '백반' } },
  chinese:     { label: '중식',      emoji: '🥟', subs: { chinese: '중화요리', mala: '마라탕', hotpot: '훠궈' } },
  asian:       { label: '아시안',    emoji: '🍜', subs: { pho: '쌀국수', tomyum: '똠양꿍', etc: '기타(동남아)' } },
  western:     { label: '양식',      emoji: '🍝', subs: { donkatsu: '돈까스', etc: '기타' } },
  japanese:    { label: '일식',      emoji: '🍣', subs: { sashimi: '회', sushi: '초밥', udon: '우동' } },
  fastfood:    { label: '패스트푸드', emoji: '🍔', subs: { pizza: '피자', burger: '햄버거', chicken: '치킨' } },
  dessert:     { label: '디저트',    emoji: '🍰', subs: { yogurt: '요아정', coffee: '커피', cake: '케잌/빵' } },
  convenience: { label: '편의점',    emoji: '🏪', subs: { gs25: 'GS25', cu: 'CU', seven: '7ELEVEN' } },
  buffet:      { label: '무한리필',  emoji: '🍖', subs: { buffet: '뷔페', meat: '무한리필고기', donkatsu: '돈까스' } },
};

const SITUATION_TAGS = {
  senior: { label: '어르신과 동행', emoji: '👴' },
  couple: { label: '연인과 함께',   emoji: '💕' },
  friend: { label: '친구와 함께',   emoji: '👫' },
  hot:    { label: '더운 날씨',     emoji: '☀️' },
  cold:   { label: '추운 날씨',     emoji: '❄️' },
};

const RESTAURANTS = [
  // ---------------- 한식 ----------------
  { id: 1, name: '행궁동 국밥마을', category: 'korean', sub: 'soup', dong: '팔달구 행궁동',
    address: '경기 수원시 팔달구 행궁로 34', phone: '031-211-4821', rating: 4.6, reviewCount: 812,
    tags: ['senior', 'cold'], emoji: '🍚', hours: dailyHours('24시간 영업'),
    menu: [ { name: '순대국밥', price: 9000 }, { name: '뼈해장국', price: 10000 }, { name: '내장탕', price: 10000 }, { name: '수육(小)', price: 22000 } ] },
  { id: 2, name: '영통 왕갈비탕', category: 'korean', sub: 'tang', dong: '영통구 영통동',
    address: '경기 수원시 영통구 대학로 55', phone: '031-548-2230', rating: 4.5, reviewCount: 634,
    tags: ['senior', 'cold'], emoji: '🍚', hours: withClosed('10:00-22:00', 'sun'),
    menu: [ { name: '왕갈비탕', price: 13000 }, { name: '도가니탕', price: 14000 }, { name: '갈비찜', price: 28000 } ] },
  { id: 3, name: '매탄동 이모손찌개', category: 'korean', sub: 'jjigae', dong: '영통구 매탄동',
    address: '경기 수원시 영통구 매탄로 12', phone: '031-233-9081', rating: 4.4, reviewCount: 401,
    tags: ['friend', 'cold'], emoji: '🍚', hours: withClosed('10:30-21:30', 'mon'),
    menu: [ { name: '김치찌개', price: 8000 }, { name: '된장찌개', price: 8000 }, { name: '부대찌개', price: 9000 } ] },
  { id: 4, name: '권선동 고등어조림집', category: 'korean', sub: 'jorim', dong: '권선구 권선동',
    address: '경기 수원시 권선구 권선로 210', phone: '031-292-5567', rating: 4.3, reviewCount: 288,
    tags: ['senior'], emoji: '🍚', hours: withClosed('11:00-20:30', 'sun'),
    menu: [ { name: '고등어조림', price: 12000 }, { name: '갈치조림', price: 16000 }, { name: '코다리조림', price: 13000 } ] },
  { id: 5, name: '장안 한상 백반', category: 'korean', sub: 'baekban', dong: '장안구 정자동',
    address: '경기 수원시 장안구 정자로 88', phone: '031-271-3345', rating: 4.7, reviewCount: 522,
    tags: ['senior', 'friend'], emoji: '🍚', hours: dailyHours('07:00-20:00'),
    menu: [ { name: '오늘의 백반', price: 9000 }, { name: '제육백반', price: 9500 }, { name: '고등어백반', price: 10000 } ] },

  // ---------------- 중식 ----------------
  { id: 6, name: '인계동 홍콩반점', category: 'chinese', sub: 'chinese', dong: '팔달구 인계동',
    address: '경기 수원시 팔달구 인계로 77', phone: '031-244-1120', rating: 4.4, reviewCount: 701,
    tags: ['friend'], emoji: '🥟', hours: withClosed('11:00-21:00', 'mon'),
    menu: [ { name: '짜장면', price: 7000 }, { name: '짬뽕', price: 8500 }, { name: '탕수육(小)', price: 18000 } ] },
  { id: 7, name: '광교 마라킹', category: 'chinese', sub: 'mala', dong: '영통구 광교동',
    address: '경기 수원시 영통구 광교로 145', phone: '031-548-7710', rating: 4.5, reviewCount: 589,
    tags: ['friend', 'hot'], emoji: '🥟', hours: dailyHours('11:00-22:00'),
    menu: [ { name: '마라탕(1인)', price: 11000 }, { name: '마라샹궈', price: 24000 }, { name: '꿔바로우', price: 15000 } ] },
  { id: 8, name: '화서동 훠궈하우스', category: 'chinese', sub: 'hotpot', dong: '장안구 화서동',
    address: '경기 수원시 장안구 화산로 21', phone: '031-268-9034', rating: 4.6, reviewCount: 455,
    tags: ['friend', 'couple', 'cold'], emoji: '🥟', hours: withClosed('11:30-22:30', 'tue'),
    menu: [ { name: '훠궈 2인세트', price: 39000 }, { name: '양고기 추가', price: 15000 }, { name: '중국당면', price: 5000 } ] },

  // ---------------- 아시안 ----------------
  { id: 9, name: '팔달문 포베트남쌀국수', category: 'asian', sub: 'pho', dong: '팔달구 매교동',
    address: '경기 수원시 팔달구 매교로 19', phone: '031-236-5512', rating: 4.5, reviewCount: 367,
    tags: ['hot', 'couple'], emoji: '🍜', hours: dailyHours('10:00-21:00'),
    menu: [ { name: '소고기 쌀국수', price: 9500 }, { name: '분짜', price: 11000 }, { name: '월남쌈', price: 15000 } ] },
  { id: 10, name: '영통 똠양쿵타이', category: 'asian', sub: 'tomyum', dong: '영통구 이의동',
    address: '경기 수원시 영통구 이의동로 63', phone: '031-215-7788', rating: 4.3, reviewCount: 210,
    tags: ['couple', 'hot'], emoji: '🍜', hours: withClosed('11:00-21:30', 'mon'),
    menu: [ { name: '똠양꿍', price: 12000 }, { name: '팟타이', price: 10000 }, { name: '카오팟', price: 9000 } ] },
  { id: 11, name: '수원역 아시안다이닝', category: 'asian', sub: 'etc', dong: '팔달구 매산로',
    address: '경기 수원시 팔달구 매산로 5', phone: '031-247-6690', rating: 4.2, reviewCount: 178,
    tags: ['couple', 'friend'], emoji: '🍜', hours: dailyHours('11:00-22:00'),
    menu: [ { name: '나시고랭', price: 10500 }, { name: '반미샌드위치', price: 7500 }, { name: '똠얌누들', price: 11000 } ] },

  // ---------------- 양식 ----------------
  { id: 12, name: '인계동 돈까스공방', category: 'western', sub: 'donkatsu', dong: '팔달구 인계동',
    address: '경기 수원시 팔달구 인계로 120', phone: '031-244-8821', rating: 4.6, reviewCount: 690,
    tags: ['friend', 'senior'], emoji: '🍝', hours: withClosed('11:00-21:00', 'tue'),
    menu: [ { name: '등심돈까스', price: 12000 }, { name: '치즈돈까스', price: 13500 }, { name: '함박스테이크', price: 13000 } ] },
  { id: 13, name: '광교호수 파스타테라스', category: 'western', sub: 'etc', dong: '영통구 광교동',
    address: '경기 수원시 영통구 광교호수로 260', phone: '031-548-3321', rating: 4.7, reviewCount: 512,
    tags: ['couple'], emoji: '🍝', hours: dailyHours('11:00-22:00'),
    menu: [ { name: '트러플크림파스타', price: 17000 }, { name: '리조또', price: 16000 }, { name: '스테이크', price: 27000 } ] },
  { id: 14, name: '매탄 스테이크하우스', category: 'western', sub: 'etc', dong: '영통구 매탄동',
    address: '경기 수원시 영통구 매탄로 44', phone: '031-233-1298', rating: 4.4, reviewCount: 340,
    tags: ['couple', 'friend'], emoji: '🍝', hours: withClosed('11:30-22:00', 'mon'),
    menu: [ { name: '안심스테이크', price: 26000 }, { name: '알리오올리오', price: 13000 } ] },

  // ---------------- 일식 ----------------
  { id: 15, name: '인계동 스시엔', category: 'japanese', sub: 'sushi', dong: '팔달구 인계동',
    address: '경기 수원시 팔달구 인계로 45', phone: '031-244-5590', rating: 4.8, reviewCount: 903,
    tags: ['couple'], emoji: '🍣', hours: withClosed('12:00-22:00', 'sun'),
    menu: [ { name: '모듬초밥(12p)', price: 22000 }, { name: '연어초밥', price: 14000 }, { name: '우니초밥', price: 26000 } ] },
  { id: 16, name: '광교 회한접시', category: 'japanese', sub: 'sashimi', dong: '영통구 광교동',
    address: '경기 수원시 영통구 광교중앙로 88', phone: '031-548-6612', rating: 4.6, reviewCount: 421,
    tags: ['couple', 'senior'], emoji: '🍣', hours: withClosed('11:30-22:00', 'mon'),
    menu: [ { name: '모듬회(中)', price: 45000 }, { name: '광어회', price: 30000 }, { name: '매운탕', price: 12000 } ] },
  { id: 17, name: '정자동 사누키우동', category: 'japanese', sub: 'udon', dong: '장안구 정자동',
    address: '경기 수원시 장안구 정자로 150', phone: '031-271-9012', rating: 4.4, reviewCount: 266,
    tags: ['cold', 'senior'], emoji: '🍣', hours: dailyHours('10:30-21:00'),
    menu: [ { name: '가케우동', price: 8500 }, { name: '고기우동', price: 10500 }, { name: '분모기텐동', price: 11000 } ] },

  // ---------------- 패스트푸드 ----------------
  { id: 18, name: '인계동 화덕피자연구소', category: 'fastfood', sub: 'pizza', dong: '팔달구 인계동',
    address: '경기 수원시 팔달구 인계로 90', phone: '031-244-7743', rating: 4.5, reviewCount: 388,
    tags: ['friend'], emoji: '🍔', hours: dailyHours('11:00-22:00'),
    menu: [ { name: '마르게리타', price: 16000 }, { name: '고르곤졸라', price: 19000 }, { name: '페퍼로니', price: 18000 } ] },
  { id: 19, name: '영통 수제버거스탠드', category: 'fastfood', sub: 'burger', dong: '영통구 영통동',
    address: '경기 수원시 영통구 영통로 210', phone: '031-215-3390', rating: 4.4, reviewCount: 305,
    tags: ['friend'], emoji: '🍔', hours: dailyHours('10:30-21:30'),
    menu: [ { name: '시그니처버거', price: 9500 }, { name: '베이컨치즈버거', price: 10500 }, { name: '감자튀김', price: 4000 } ] },
  { id: 20, name: '권선동 옛날통닭', category: 'fastfood', sub: 'chicken', dong: '권선구 권선동',
    address: '경기 수원시 권선구 권선로 55', phone: '031-292-1177', rating: 4.6, reviewCount: 677,
    tags: ['friend', 'cold'], emoji: '🍔', hours: dailyHours('14:00-24:00'),
    menu: [ { name: '후라이드 치킨', price: 19000 }, { name: '양념치킨', price: 20000 }, { name: '반반', price: 20000 } ] },

  // ---------------- 디저트 ----------------
  { id: 21, name: '인계동 요아정', category: 'dessert', sub: 'yogurt', dong: '팔달구 인계동',
    address: '경기 수원시 팔달구 인계로 30', phone: '031-244-2201', rating: 4.5, reviewCount: 244,
    tags: ['couple', 'hot'], emoji: '🍰', hours: dailyHours('10:00-22:00'),
    menu: [ { name: '못먹어본맛', price: 7900 }, { name: '지금이순간', price: 7900 }, { name: '아919', price: 8500 } ] },
  { id: 22, name: '광교호수 카페테라스', category: 'dessert', sub: 'coffee', dong: '영통구 광교동',
    address: '경기 수원시 영통구 광교호수로 300', phone: '031-548-0192', rating: 4.7, reviewCount: 830,
    tags: ['couple', 'hot'], emoji: '🍰', hours: dailyHours('08:00-22:00'),
    menu: [ { name: '아이스아메리카노', price: 4500 }, { name: 'florida 에이드', price: 6000 }, { name: '치즈케이크', price: 7500 } ] },
  { id: 23, name: '정자동 베이커리하우스', category: 'dessert', sub: 'cake', dong: '장안구 정자동',
    address: '경기 수원시 장안구 정자로 65', phone: '031-271-4482', rating: 4.4, reviewCount: 199,
    tags: ['senior', 'couple'], emoji: '🍰', hours: withClosed('08:00-21:00', 'mon'),
    menu: [ { name: '生크림케이크', price: 32000 }, { name: '소금빵', price: 3500 }, { name: '크루아상', price: 4200 } ] },

  // ---------------- 편의점 ----------------
  { id: 24, name: 'GS25 수원행궁점', category: 'convenience', sub: 'gs25', dong: '팔달구 행궁동',
    address: '경기 수원시 팔달구 행궁로 10', phone: '031-211-0001', rating: 4.0, reviewCount: 52,
    tags: ['friend'], emoji: '🏪', hours: dailyHours('24시간 영업'),
    menu: [ { name: '삼각김밥', price: 1700 }, { name: '도시락', price: 4500 }, { name: '캔맥주', price: 3000 } ] },
  { id: 25, name: 'CU 영통역점', category: 'convenience', sub: 'cu', dong: '영통구 영통동',
    address: '경기 수원시 영통구 영통로 180', phone: '031-215-0002', rating: 4.0, reviewCount: 41,
    tags: ['friend'], emoji: '🏪', hours: dailyHours('24시간 영업'),
    menu: [ { name: '치킨마요', price: 4200 }, { name: '컵라면', price: 1500 }, { name: '아이스크림', price: 2000 } ] },
  { id: 26, name: '7ELEVEN 광교중앙점', category: 'convenience', sub: 'seven', dong: '영통구 광교동',
    address: '경기 수원시 영통구 광교중앙로 10', phone: '031-548-0003', rating: 4.1, reviewCount: 37,
    tags: ['hot'], emoji: '🏪', hours: dailyHours('24시간 영업'),
    menu: [ { name: '즉석원두커피', price: 1800 }, { name: '샌드위치', price: 3800 }, { name: '빙수컵', price: 3500 } ] },

  // ---------------- 무한리필 ----------------
  { id: 27, name: '세류동 고기무한리필', category: 'buffet', sub: 'meat', dong: '권선구 세류동',
    address: '경기 수원시 권선구 세류로 22', phone: '031-292-6650', rating: 4.5, reviewCount: 611,
    tags: ['friend'], emoji: '🍖', hours: dailyHours('11:30-23:00'),
    menu: [ { name: '삼겹살 무한리필', price: 16900 }, { name: '항정살 무한리필', price: 18900 }, { name: '냉면(추가)', price: 3000 } ] },
  { id: 28, name: '우만동 뷔페가든', category: 'buffet', sub: 'buffet', dong: '팔달구 우만동',
    address: '경기 수원시 팔달구 우만로 8', phone: '031-236-7789', rating: 4.3, reviewCount: 358,
    tags: ['senior', 'friend'], emoji: '🍖', hours: dailyHours('11:00-21:00'),
    menu: [ { name: '평일런치뷔페', price: 15900 }, { name: '주말디너뷔페', price: 22900 } ] },
  { id: 29, name: '지동 무한리필돈까스', category: 'buffet', sub: 'donkatsu', dong: '팔달구 지동',
    address: '경기 수원시 팔달구 지동로 15', phone: '031-236-1123', rating: 4.4, reviewCount: 274,
    tags: ['friend', 'senior'], emoji: '🍖', hours: withClosed('11:00-21:30', 'tue'),
    menu: [ { name: '돈까스 무한리필', price: 13900 }, { name: '스프/샐러드바', price: 0 } ] },
];
