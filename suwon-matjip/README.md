# 먹GO — 수원 맛집 리스트

## 한줄정의

수원시 전역의 맛집을 대분류·소분류 카테고리와 상황(어르신/연인/친구/날씨)별로 탐색하고, 메뉴를 체크해 방문 예약과 방문일 알림까지 한 번에 관리할 수 있는 여름 테마의 반응형 맛집 리스트 관리 웹앱.

---

## 테이블 설계

> 이 앱은 별도 백엔드 서버 없이 브라우저 **localStorage**를 데이터 저장소로 사용하는 프론트엔드 전용 데모입니다.
> 아래는 실제 저장 구조를 relational schema 형태로 정리한 논리 테이블 설계이며, 추후 서버 DB로 확장할 때 그대로 참고할 수 있도록 작성했습니다.

### 1. restaurants (맛집 정보) — `data.js` 정적 데이터

| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | INT (PK) | 맛집 고유 ID |
| name | VARCHAR | 상호명 |
| category | VARCHAR (FK → categories.key) | 대분류 키 |
| sub | VARCHAR (FK → sub_categories.key) | 소분류 키 |
| dong | VARCHAR | 소재 동(표시용) |
| address | VARCHAR | 도로명 주소 |
| phone | VARCHAR | 전화번호 |
| rating | DECIMAL(2,1) | 평균 별점 |
| review_count | INT | 리뷰 수 |
| tags | VARCHAR[] (FK → situation_tags.key, N:M) | 상황 추천 태그 배열 |
| hours | JSON | 요일별(월~일) 영업시간 · 정기휴무 정보 |
| menu | JSON | 메뉴명·가격 배열 |

### 2. categories / sub_categories (카테고리 정의)

| 컬럼 | 타입 | 설명 |
|---|---|---|
| category_key | VARCHAR (PK) | 대분류 키 (예: korean, japanese) |
| label | VARCHAR | 대분류 표시명 (한식, 일식 등) |
| emoji | VARCHAR | 카테고리 아이콘 이모지 |

| 컬럼 | 타입 | 설명 |
|---|---|---|
| sub_key | VARCHAR (PK) | 소분류 키 (예: soup, sushi) |
| category_key | VARCHAR (FK → categories.category_key) | 상위 대분류 |
| label | VARCHAR | 소분류 표시명 (국, 초밥 등) |

### 3. situation_tags (맞춤 추천 태그)

| 컬럼 | 타입 | 설명 |
|---|---|---|
| key | VARCHAR (PK) | 태그 키 (senior, couple, friend, hot, cold) |
| label | VARCHAR | 표시명 (어르신과 동행 등) |
| emoji | VARCHAR | 태그 아이콘 |

### 4. users (회원) — localStorage key: `smj_users`

| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | VARCHAR (PK) | 로그인 아이디 |
| pw | VARCHAR | 비밀번호 (평문 데모, 실서비스 시 해시 필요) |
| name | VARCHAR | 이름 |
| email | VARCHAR | 이메일 |

> 기본 테스트 계정(`multicampus` / `1234`)은 코드에 하드코딩되어 있으며, 회원가입 시 이 테이블에 추가됩니다.

### 5. session (로그인 세션) — localStorage key: `smj_session`

| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | VARCHAR | 로그인 아이디 또는 소셜 provider명(카카오톡/네이버/구글) |
| name | VARCHAR | 표시 이름 |

### 6. selected_menu (선택한 메뉴, N:M) — localStorage key: `smj_selected_menu`

| 컬럼 | 타입 | 설명 |
|---|---|---|
| restaurant_id | INT (FK → restaurants.id) | 맛집 ID |
| menu_name | VARCHAR | 체크한 메뉴명 (한 맛집당 여러 개 가능) |

### 7. recent_visits (최근 방문) — localStorage key: `smj_recent_visits`

| 컬럼 | 타입 | 설명 |
|---|---|---|
| restaurant_id | INT (FK → restaurants.id) | 방문(카드 클릭)한 맛집 ID |
| name | VARCHAR | 맛집 이름 (스냅샷) |
| visited_at | VARCHAR | 방문 시각 (M/D HH:mm) — 최근 8건 유지 |

### 8. recent_menu_selections (최근 선택 메뉴) — localStorage key: `smj_recent_menu`

| 컬럼 | 타입 | 설명 |
|---|---|---|
| restaurant_name | VARCHAR | 맛집 이름 |
| menu_name | VARCHAR | 선택한 메뉴명 |
| selected_at | VARCHAR | 선택 시각 — 최근 8건 유지 |

### 9. reservations (방문 예약) — localStorage key: `smj_reservations`

| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | BIGINT (PK, timestamp) | 예약 고유 ID |
| restaurant_id | INT (FK → restaurants.id) | 예약 맛집 ID |
| restaurant_name | VARCHAR | 맛집 이름 (스냅샷) |
| date | DATE | 방문 예정일 |
| time | TIME | 방문 예정 시간 |
| people | INT | 방문 인원 |

### 10. alarms (방문일 알람) — localStorage key: `smj_alarms`

| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | BIGINT (PK, timestamp) | 알람 고유 ID |
| restaurant_id | INT (FK → restaurants.id) | 대상 맛집 ID |
| restaurant_name | VARCHAR | 맛집 이름 (스냅샷) |
| date | DATE | 알람 날짜 |
| time | TIME | 알람 시간 |
| datetime | BIGINT | 알람 발동 시각 (epoch ms) |
| fired | BOOLEAN | 알람 발동 여부 (Notification API로 발송) |

### ER 관계 요약

```
categories 1─N sub_categories
restaurants N─1 categories / sub_categories
restaurants N─M situation_tags
restaurants 1─N selected_menu / recent_visits / reservations / alarms
users 1─1 session (로그인 시)
```

---

## 화면구성

### 화면 흐름

```
[로그인 화면] ──(ID/PW 또는 카카오톡/네이버/구글)──▶ 가상 승인 알림 ──▶ [메인 화면]
     │
     └──(회원가입 링크)──▶ [회원가입 화면] ──(가입 완료)──▶ [로그인 화면]

[메인 화면] ──(카드 클릭)──▶ [상세 모달] ──(방문예약/방문일설정)──▶ 인라인 폼 ──▶ 토스트 알림
```

### 1. 로그인 화면 (`#view-login`)

- 브랜드 로고 "먹GO" (여름 이모지 + 로고 마크)
- 아이디 / 비밀번호 입력 + 로그인 버튼 (테스트 계정: `multicampus` / `1234`)
- 소셜 로그인 3종: 카카오톡 / 네이버 / 구글 (브랜드 컬러 버튼)
- 모든 로그인 방식 공통: 성공 시 **"테스트 페이지로 가상 승인 환경으로 넘어갑니다."** 알림 후 메인 화면 진입
- 하단 회원가입 링크, 테스트 계정 안내 문구

### 2. 회원가입 화면 (`#view-signup`)

- 이름 / 아이디 / 이메일 / 비밀번호 / 비밀번호 확인 입력
- 비밀번호 일치 검증, 아이디 중복 검증
- 가입 완료 시 로그인 화면으로 전환 + 아이디 자동 입력

### 3. 메인 화면 (`#view-app`)

| 영역 | 구성 요소 |
|---|---|
| 상단 네비게이션 | 로고, **최근 방문** 드롭다운(최근 방문 가게·최근 선택 메뉴), **내 예약/알람** 드롭다운(방문 예약·방문일 알람 목록), 사용자명, 로그아웃 |
| 검색 & 카테고리 바 | 상호명 검색창, 대분류 칩(전체/한식/중식/아시안/양식/일식/패스트푸드/디저트/편의점/무한리필), 대분류 선택 시 하위 소분류 칩(첫 칩은 해당 대분류명으로 표시) |
| 맞춤 추천 바 | 상황별 칩 5종(어르신과 동행/연인과 함께/친구와 함께/더운 날씨/추운 날씨) — 토글 필터 |
| 맛집 카드 그리드 | 요리별 테마 SVG 아이콘, 상호명·동, 카테고리·상황 배지, 별점·리뷰수, 주소 + **영업시간 토글**(클릭 시 카드 내에서 월~일 영업시간 펼침, 오늘 요일 강조), 체크된 메뉴 개수 표시 |

### 4. 상세 모달 (`#detail-modal`, 카드 클릭 시)

- 헤더: 요리 테마 아이콘, 상호명, 카테고리·소분류 배지
- 탭 5종:
  - **상호**: 위치·별점 요약, 체크한 메뉴 목록
  - **주소**: 전체 주소, 네이버 지도 바로가기
  - **전화번호**: 전화번호, 전화 걸기(tel:) 링크
  - **별점**: 평균 별점, 별점 분포 바 차트
  - **메뉴**: 메뉴별 체크박스 + 가격 (체크 시 상호 탭·카드에 즉시 반영)
- 하단 액션: **방문 예약**(날짜·시간·인원 입력 → 예약 목록에 추가), **방문일 설정**(날짜·시간 입력 → 브라우저 알림(Notification API)으로 예정일 알림)

### 5. 공통 UI

- 토스트 알림: 예약/알람 완료, 검색 결과 없음 등 하단 중앙에 짧게 표시
- 배경 장식: 여름 하늘색 그라데이션, 해·구름·파도 애니메이션

### 반응형 브레이크포인트

| 구간 | 대상 | 주요 변화 |
|---|---|---|
| ~480px | 모바일 | 카드 1열, 네비게이션 아이템 줄바꿈, 드롭다운 화면 중앙 고정, 모달 하단 시트(bottom-sheet)화 |
| 481~768px | 태블릿 | 카드 다열(자동 채움, 최소 200px), 드롭다운 화면 중앙 고정 |
| 769~1399px | 일반 데스크톱 | 기본 레이아웃 |
| 1400px~ | 초광폭 데스크톱 | 콘텐츠 최대 폭 1400px로 중앙 정렬, 좌우 여백 자동 확장 |
