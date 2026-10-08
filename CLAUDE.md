# CLAUDE.md — Tabi(TripJapan) 장기 기억

> **이 파일이 Claude의 장기 기억이다.** 채팅 기록은 언제든 사라질 수 있다(2026-09 PC 포맷으로 실제로 전부 날아감).
> - 세션 시작 시 이 파일을 먼저 읽고 맥락을 복원한다.
> - 사용자와 정한 규칙·계획·결정, 작업 결과, 새로 알게 된 함정은 **그때그때 이 파일에 반영**한다.
> - 맨 아래 "작업 로그"에 날짜와 함께 한 줄씩 남긴다. 오래된/틀린 내용은 지우거나 고친다.
> - 이 파일은 git에 커밋한다(`.claude/`는 gitignore라 거기 두면 또 날아간다).

---

## 1. 프로젝트 개요

- **앱**: 타비(Tabi / 타비료코) — 일본 여행을 준비하는 한국인용 올인원 여행 앱. 1인 개발(김동환, GitHub `KimDongHwan1218`).
- **프론트**: 이 저장소 `TripJapan` — Expo SDK 54 / React Native 0.81 / React 19 / TypeScript 5.9, New Architecture 켜짐.
- **백엔드**: 옆 폴더 `../TripJapan_Server` (구 이름 Tavi_Server) — Node/Express 5(ESM), Supabase(Postgres) 사용, Render 무료 티어 배포
  (`https://tavi-server.onrender.com`, 슬립 → 콜드스타트 30~60초). 백엔드 변경은 **그 저장소에 별도 커밋**한다.
- **DB/스토리지**: Supabase `wwmdmngncknalzfcpejn`. 마이그레이션은 양쪽 `supabase/migrations/`에 있음(대부분 서버 쪽).
- **Android 패키지/번들 ID**: `com.hwan1218.tripjapan`, EAS projectId `0c7d183b-...`.

### 탭 구성 (MainTabNavigator, 탭 이름이 한글)
| 탭 | 스택 | 주요 내용 |
|---|---|---|
| 홈 | HomeStack | 히어로배너, 내 여행 카드(TomyTrip), 퀵액션(번역/날씨/환율/여행경보/타비톡), 타비PICK, 특가배너, 타비톡 미리보기, 여행지 슬라이드. 하위: 번역(텍스트/이미지/음성), 날씨·환율·여행경보 상세, Flight/Hotel/Tour 스택 |
| 일정 | ScheduleStack | 여행 생성(도시+날짜), Day별 일정, 드래그 재정렬, 지도 경로/이동 구간, 지난 여행, 리뷰 작성 |
| 타비톡 | CommunityStack | 커뮤니티(게시판, 인기글, 댓글, 좋아요, 내 글, 여행후기 작성) |
| 검색 | SearchStack | **허브형 IA**: SearchHub(타일) → CategoryScreen(관광지/맛집/카페/쇼핑, 지역필터) / 애니성지 / 편의점(준비중) / 즐겨찾기 → DetailScreen |
| 설정 | SettingsStack | 프로필 편집, 공지, 알림설정, 약관, 문의, 비상연락처 |

## 2. 아키텍처 & 코드 규칙

- **화면 = container + view 분리**: `XxxScreen.tsx`(re-export 1줄) / `.container.tsx`(데이터·네비게이션) / `.view.tsx`(순수 UI, props만). 새 화면도 이 패턴을 따른다. 화면 전용 훅은 `screens/<탭>/hooks/`, 컴포넌트는 `screens/<탭>/components/`.
- **전역 상태 = Context** (`contexts/`): Auth, Trip, Community, Favorites, Toast, UI. App.tsx에서 이 순서로 중첩.
- **도메인 로직은 `domain/`** 에 순수 함수로 (tripPhase, schedule, scheduleStatus …). 화면에 로직 중복 금지 — 여러 곳에서 쓰는 건 공통 훅/`constants/`로 끌어올린다.
- **도시 정보는 `constants/cities.ts`의 `CITY_META`가 단일 출처** (TripCity 15개, ko/en/ja 라벨, 좌표, 이미지). 다른 곳에 도시 좌표 테이블을 하드코딩하지 말 것(과거 버그 원인).
- **디자인 토큰 `/styles`** (colors/spacing/radius/typography/shadows/layout) 사용, 하드코딩 금지. 브랜드 컬러 Primary Red `#E30003`. 디자인 기준은 Figma.
- **API 호출**: `ENV.API_BASE_URL`(config/env.ts) + fetch/axios 혼용. 인증 필요한 엔드포인트는 `Authorization: Bearer ${accessToken}` 필수(빠뜨려서 401 났던 전례 — PastTripScreen).
  일부는 Supabase 클라이언트 직접 조회(usePlaces의 `youtuber_places`, 이미지 업로드 등).
- **캐싱**: `hooks/useCachedQuery.ts` — key별 메모리 캐시 + 처음 보는 key는 즉시 스켈레톤.
- **인증**: Kakao/Google OAuth를 서버 프록시 방식으로(`/auth/session/init` → 브라우저 → `/auth/session/status` 폴링 → `consume`). accessToken 7일, `/auth/refresh`로 재발급. 시작 시 저장된 토큰으로 바로 진입하고 갱신은 백그라운드.
- 경로 alias: `@/` = 프로젝트 루트.
- 주석은 한국어, "왜 이렇게 했는지(과거 버그)"를 남기는 스타일.

### 데이터 규모/특이사항
- `places` 13만 건+ (OSM 일괄 임포트) → 반드시 페이지네이션(`limit/offset`, PAGE_SIZE 30). `name_ko` 번역 필드 있음.
- 애니 성지순례: `/anime-pilgrimage/titles`, `/titles/:id/spots`. 원본 데이터 `tabi_anime_seichi_master_v1_2480.csv`(2480 스팟).
- 유튜버 추천 장소: Supabase `youtuber_places` 테이블(배지 `YOUTUBER_PICK`).
- 리뷰: 장소당 1인 1개, 작성 후 7일 이내만 수정/삭제.

## 3. 작업 방식 (사용자와 합의된 것)

### 기본 루프 (2026-10-01 사용자가 직접 정의)
1. 사용자가 준 **거시 목표**에 맞춰 앱 탐색 계획을 세운다.
2. 계획대로 실기기에서 **스크린샷 찍고 화면 조작(탭/스와이프/뒤로)으로 이동**을 반복한다.
3. 스크린샷을 근거로 문제점·수정사항·알아봐야 할 것을 뽑는다.
   **동의가 필요 없는 사소하거나 당연한 것, 지시받은 것은 바로 수정**한다. 기획/디자인 방향이 걸린 큰 변경은 보고 후 결정.
4. 사용자에게 보고하고 진행상황을 이 파일(5. 계획 / 6. 작업 로그)에 기록한다.
5. 사용자가 다음 거시 목표를 정해준다 → 1로.

### 실기기 연결 (Galaxy S23, Wi-Fi 무선 디버깅)
- adb 경로: `"$LOCALAPPDATA/Microsoft/WinGet/Packages/Google.PlatformTools_Microsoft.Winget.Source_8wekyb3d8bbwe/platform-tools/adb.exe"` (Bash에서 PATH에 없을 수 있음).
- 최초 1회 페어링: 폰 개발자 옵션 → 무선 디버깅 → "페어링 코드로 기기 페어링"의 IP:포트·코드로 `adb pair IP:PORT CODE`. 이후엔 무선 디버깅 메인 화면의 IP:포트로 `adb connect IP:PORT` (포트는 켤 때마다 바뀜).
- **스크린샷은 단계별 버전으로 보관(2026-10-08 사용자 요청)**: `bash scripts/device.sh version vNNN_YYYY-MM-DD_단계명` → `bash scripts/device.sh snap 설명` → `screenshots/vNNN_.../NN_설명.png`. `screenshots/`는 gitignore(실명·게시글 아이 사진 등 개인정보, 공개 저장소), 목록만 `docs/SCREENSHOTS.md`에 커밋. 작업 단계(탐색/수정/검증)마다 새 버전 폴더.
- **빠른 탐색(2026-10-08)**: 폰 애니메이션 **꺼둔 상태**(`device.sh anim off`, 되돌리기 `anim on`). 고정 sleep 대신 `device.sh waitfor "글자" [초]` / `tapw "글자"`(나타나면 탭). 화면 구조 조회 1회 2~3초라 왕복 ~9초.
- **Maestro 2.11**(정해진 경로 반복 순회용): `bash scripts/maestro.sh maestro/flows/tour.yaml` → 7화면 71초(JVM 기동 ~15초 포함), 스크린샷은 현재 버전 폴더로 복사됨. Java 17(`C:/Program Files/Microsoft/jdk-17*`), 한글 셀렉터는 `JAVA_TOOL_OPTIONS=-Dfile.encoding=UTF-8` 필수(래퍼에 있음).
  ⚠️ 하단 탭은 글자("홈")로 누르면 **안드로이드 시스템 홈 버튼**이 눌림 → `id: "tab-home|schedule|talk|search|settings"`(MainTabNavigator tabBarButtonTestID)로 누를 것. 정규식의 `\?`는 파싱 에러 → `.` 사용. 딥링크는 안 쓰기로 함(사용자).
- 폰 조작 스크립트: `scripts/device.sh` (tap/tapt 글자탭/swipe/back/ui/snap/launch/focus). 연결 기기는 자동 감지(페어링된 mdns 이름이라 포트가 바뀌어도 됨). 연결이 끊기면 `adb devices`/`adb mdns services`로 확인.
- 스크린샷 `adb exec-out screencap -p > shot.png`(Read로 확인), 조작 `adb shell input tap X Y` / `input swipe` / `input keyevent 4`(뒤로), 요소 좌표는 `adb shell uiautomator dump` 활용. 한글 텍스트 입력은 adb `input text`로 안 됨.
- 앱 실행: `npx expo start`(--go 없이) → 폰의 **dev build 앱(com.hwan1218.tripjapan, 2026-07-21 설치)**이 dev 서버에 붙음. 사용자는 "Expo Go"라고 부르지만 실제론 dev client. 코드 반영 안 되면 `adb shell input keyevent 82` → Reload. 앱이 꺼지면 `adb shell monkey -p com.hwan1218.tripjapan -c android.intent.category.LAUNCHER 1`.
- 이 dev build엔 옛 Maps 키(삭제됨)가 박혀 있음 — 즐겨찾기 지도 타일은 정상으로 떠서 당장 영향은 확인 안 됨. 지도 이상하면 dev build 재빌드(EAS development, `eas env`에 새 키 등록) 고려.
- PowerShell에서 `npx`가 막히면 실행 정책 문제 → `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`(2026-10-01 적용함).

### 화면별 디자인 시안 비교 (2026-10-08 사용자 요청)
- 여러 디자인안을 코드에 함께 두고 실기기에서 바로 바꿔 비교한다. **전역 모드가 아니라 화면 단위** — 화면마다 시안 개수가 다르고(홈 2개, 공지사항은 완성이라 0개), 시안이 2개 이상인 화면에서만 **우상단(헤더 아래) 플로팅 버튼**(`components/DesignVariantPicker`, 글자 A/B…)이 나타나 펼쳐서 고른다. 개발 빌드 전용(배포 빌드에선 항상 A).
- 사용: 화면/컨테이너에서 `const v = useScreenVariant("화면key", ["현재", "시안 이름", ...])` → 0=A(현재), 1=B… 고른 값은 화면 key별로 AsyncStorage 저장.
- 규칙: **A(0) = 현재 디자인, A 코드는 수정하지 않는다**(언제든 되돌아갈 수 있게). 큰 차이는 `*.view.v2.tsx` 별도 파일, 작은 차이는 분기. 공용 컴포넌트엔 기본값이 기존 동작인 선택 prop만 추가. 채택되면 그 시안을 A로 승격하고 나머지 분기 삭제.
- 탭바 숨김 같은 네비게이터 수준 시안은 `MainTabNavigator`의 `TABBAR_HIDE_VARIANT`(화면 route → 시안 key) 방식.
- 스크린샷은 같은 화면 A/B를 나란히 찍어 버전 폴더에 남긴다(예: v007).
- 등록된 시안(2026-10-08): home(현재/상황별 홈), search.category(현재/행 목록 + 아이콘), translate.select·text·voice·image(헤더 제목 + 언어 바), weather·exchange(헤더 제목), community.postCreate·review.write·schedule.edit(탭바 숨김).

### 커밋/브랜치 습관 (커밋 기록에서 복원)

- **작업 단위마다 브랜치** (`fix/...`, `feat/...`, 디자인은 `search-redesign-minimal` / `-warm`처럼 **A/B 시안 브랜치 병행** 후 하나 채택) → master(또는 KDH)에 merge.
- **커밋 메시지는 한국어**, 접두어 `fix:` / `feat:` / `design:` / `chore:`. 본문에 **원인 → 수정 내용 → 검증 결과**를 구체적으로. 여러 건이면 `- 파일명: 설명` 불릿.
- **실기기 검증**: Galaxy S23을 adb로 연결해 직접 재현·수정 확인 후 커밋 본문에 "실기기에서 확인" 명시. 검증 못 했으면 못 했다고 쓴다.
- 디자인 피드백은 사용자 감각("짜쳐 보인다", "밍밍하다")으로 오므로 실루엣/레이아웃 수준에서 차별화해 반복 개선. 큰 디자인 변경은 아티팩트로 시안 비교 페이지를 만든 적 있음(「검색탭 리디자인 제안」 https://claude.ai/artifact/TVRc4R9cciw1ttzFaBzEYF).
- 화면 완성도는 1~5단계로 관리했었음 (1 미완 / 2 뼈대·mock / 3 디자인 미적용 / 4 토큰 미사용 / 5 완성). 과거 표: `git show 6040c05:SCREEN_STATUS.md`.

## 4. 현재 상태 (2026-10-01 기준)

- master 최신 커밋 `7b7605c` (2026-09-10, expo-doctor 의존성 정리). 서버 `main` 최신 `1784ea4` (2026-09-17 포맷 전 백업).
- **개발 환경 (2026-10-01 재설치)**: Node v24.19.0 LTS / npm 11 (winget `OpenJS.NodeJS.LTS`), adb 1.0.41 (winget `Google.PlatformTools`, `%LOCALAPPDATA%\Microsoft\WinGet\Packages\Google.PlatformTools_*\platform-tools`). 양쪽 저장소 `npm install` 완료. Claude의 Bash 셸에선 PATH에 안 잡혀 있을 수 있음 → `export PATH="/c/Program Files/nodejs:$PATH"`.
  **디버깅 방식**: dev build 앱 + `npx expo start` (아래 '실기기 연결' 참고). 코드엔 Expo Go 비호환 네이티브 모듈 import가 없어서 Expo Go(`--go`, SDK 54용)로도 실행 가능.
  EAS dev build(`development` 프로필)는 커스텀 네이티브 모듈이 필요할 때만. Android Studio/JDK는 미설치(로컬 네이티브 빌드 필요 시 설치).
  npm 11의 allow-scripts 때문에 sharp/supabase CLI 등의 install 스크립트가 실행 안 됐음 — 문제 생기면 `npm approve-scripts`.
- **환경변수**: 앱 `.env`는 git 미추적, 형식은 `.env.example`. Supabase는 `EXPO_PUBLIC_SUPABASE_URL/ANON_KEY`, 지도는 `MAPS_PLATFORM_API_KEY`(app.config extra). EAS 클라우드 빌드엔 `eas env:create`로 따로 등록해야 함.
- 아직 mock/미완: 홈 SpecialBanner·커뮤니티 BoardPromoBanner(MOCK 배지), Hotel/Tour 홈(WebView URL·위젯 TODO), 편의점 화면(스켈레톤만), FlightDetail mock 폴백, 공지 mock 폴백.
- 빈 파일(0바이트) 다수: `components/ui/Card.tsx`, `components/Header/constants.ts|styles.ts`, `types/*.ts`, `utils/date.ts`, `domain/booking.ts` 등 — 정리 대상.
- 상세 과제 목록은 [IMPROVEMENTS.md](IMPROVEMENTS.md) (FN-080~093 신규 기능 예정 포함), 인수인계는 [ONBOARDING.md](ONBOARDING.md)(일부 오래됨).

### 알려진 위험/부채
- **비밀키 노출 (진행 중)**: `TripJapan`은 **공개 저장소**, `TripJapan_Server`는 비공개.
  공개 저장소 히스토리에 노출된 것: Google Cloud 키(Translation/STT/Vision/Maps — Maps=Embed 같은 키), Travelpayouts API 키, Kakao REST/Native 키, 키스토어 비밀번호(credentials.json; .jks 파일 자체는 노출 안 됨), Supabase anon 키(공개 전제라 RLS만 확인).
  JWT_SECRET·Supabase 서비스 롤 키·ADMIN_PASSWORD는 공개 저장소에 올라간 적 없음(서버 `.env`는 비공개 저장소에만).
  코드 측 정리는 앱 브랜치 `fix/secrets-cleanup`, 서버 브랜치 `fix/untrack-env`(서버 .env 추적 해제 — Render는 대시보드 환경변수 사용 확인됨).
  2026-10-01 Google 키 4개 순환 완료, 로컬 .env 양쪽 반영 + API 호출로 동작 확인. Travelpayouts/Kakao/키스토어는 위험 낮아 재발급 안 하기로 함(스토어 미출시).
  서버의 `Google_Maps_Embed_API_KEY`는 코드에서 안 쓰여 서버 .env에서 삭제함.
  Render 환경변수 교체 + 옛 키 삭제 완료(사용자), 운영 `/translate` 호출로 새 키 동작 확인.
  **남은 일**: Maps 콘솔 설정(아래) → 두 브랜치 merge·push. 사용자는 force push로 히스토리 정리하는 것도 원함(포크 1개 있어 완전 삭제는 불가).
- **Maps 키 API 제한 문제 (기존부터 있던 버그)**: Directions API는 키 제한 목록에 없어서 REQUEST_DENIED, Geocoding API는 프로젝트에서 미활성. 옛 키도 똑같았음.
  → 일정 화면 이동 구간(useRouteInfo)이 실제론 항상 "-"였고, 지도 롱프레스 지명은 Nearby Search(정상)로만 동작 중. 콘솔에서 두 API 활성화 + 키 제한에 추가 필요.
  필요한 Maps API: Maps SDK for Android, Places API, Directions API, Geocoding API.
- **Maps 키는 네이티브 빌드에 박힘**: app.config의 `android.config.googleMaps.apiKey`는 AndroidManifest에 들어가므로, 키를 바꾸면 dev client/APK를 **재빌드**해야 네이티브 지도가 새 키를 씀(JS의 REST 호출은 dev 서버 재시작만으로 반영).
- OAuth가 폴링 방식(딥링크 미전환).
- `AuthContext`에 `console.log("user")` 등 디버그 로그 잔존.

## 5. 계획 / 다음 할 일

- **유저플로우 지도 & 버그 현황: [docs/USERFLOW.md](docs/USERFLOW.md)** — 탐색할 때마다 갱신.
- 1차 거시 목표(2026-10-01) "앱 전체 탐색으로 유저플로우 이해" 완료. 명백한 버그 9건 수정(`fix/userflow-bugs` 42874e9).
- 2차 거시 목표(2026-10-01, 사용자 결정 반영) 완료: 제목칸 복구·글 수정, 서버 커뮤니티 API(user_id/limit/offset, liked)·STT, 대중교통 토글 제거, 항공/호텔/투어 제거, 타비톡 섹션 덩어리 링크(인기글/내 글/실시간 전체)·피드 5개, 즐겨찾기 지도 중심=첫 즐겨찾기. 애니성지 지도 원인 = 옛 Maps 키(dev build).
- 사용자 결정 사항(2026-10-01):
  - 장소 데이터 품질(더미/정렬/name_ko/썸네일/도쿄타워 누락), 테스트 데이터·더미 정리는 **"일단 둬"** — 문제로 기록만(USERFLOW.md ⚠️).
  - 대중교통: 일단 뺌(제거 완료). 항공/호텔/투어: 일단 뺌(제거 완료, 파일은 남김).
- 3차(2026-10-02) 완료: 커뮤니티 API 인증/소유자 확인(서버 8245121), 앱 토큰 첨부·인기글 "실시간"·Day 지도 자동 fit(00b1dc7), refresh 401 시 로그아웃(7905dbe). 서버 main / 앱 master에 merge·push 완료, Render 자동배포 확인(push 후 ~20초).
- **2026-10-02 사고: Render 환경변수에서 JWT_SECRET이 빠진 채 재배포** → 토큰 발급/검증 전부 실패(카카오 콜백 detail "secretOrPrivateKey must have a value"로 확정). 새 랜덤 값으로 다시 넣으라고 안내(기존 세션은 어차피 무효). 재발 방지: 서버가 필수 env(JWT_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) 없으면 시작 실패(7e0d525) → Render가 이전 버전 유지. 사용자 재로그인 필요. 로컬 서버 .env의 JWT_SECRET은 Render와 다름(로컬에서 운영용 토큰 위조 불가 — 정상).
- **EAS**: 계정 hwan1218. 환경변수(development/preview): EXPO_PUBLIC_SUPABASE_URL/ANON_KEY(plaintext), MAPS_PLATFORM_API_KEY(secret, 새 키로 갱신), KAKAO_*/GOOGLE_WEB_CLIENT_ID(옛 값, 현재 미사용). eas.json 프로필별 environment 명시. Android 서명은 EAS 원격 keystore(credentials.json 경로의 로컬 jks는 없음).
  dev build: `npx eas-cli@latest build -p android --profile development --non-interactive --no-wait` (무료 플랜 대기열 김).
- 2026-10-08: 새 dev build(EAS faeef47f, 새 Maps 키) 설치 — 애니성지 지도 타일 정상·핀 탭 정보시트 정상(옛 키가 원인이었음 확정). 사용자 재로그인 완료(JWT_SECRET 복구됨).
- **디자인 시스템 v1.0 확정(2026-10-08)**: 아티팩트 「타비 디자인 시스템」 https://claude.ai/artifact/Eoq3W9fvq33AuSe1Hd37xp , 원본 `docs/design-system.html`(수정 후 같은 파일 경로로 Artifact publish — url 지정). 사용자 결정: **D1 뒤로가기 iOS형 chevron-back**, **D2 색 채우기 최소화 — 정말 강조할 버튼만 채우고 약한 강조는 테두리·글자만(레드 외 색에도 적용)**, **D7 큰 숫자 40/48 예외 허용**, 나머지 제안 전부 확정.
  적용(b7c0028, 브랜치 design/system-v1): Pretendard 4굵기 탑재 + `components/ui/Text`(fontWeight→굵기별 파일. 새 화면은 react-native Text 대신 이걸 import), 토큰(radius 5단계+continuousCurve, spacing.gutter, textTertiary #6E7277, info/fall/successText, typography.type), 코드모드 `scripts/codemods/design-v1.js`로 93파일 일괄. 남은 것: 헤더 2종 통합 등 → 진단 문서 로드맵.
- **화면별 시안 장치 + 진단 추천안 B 시안 1차(2026-10-08, 브랜치 design/mode-v2)** — 위 "화면별 디자인 시안 비교" 참고. 사용자 비교·채택 대기.
- **사용성·미감 진단(2026-10-08, 코드 변경 없음)**: 아티팩트 「타비 사용성·미감 진단」 https://claude.ai/artifact/CrS4bsr6Twqx7J3zud9oGb , 원본 `docs/ux-audit.html`. 근거 screenshots/v006 52장. 발견 34건·대안 71개, 로드맵 6묶음(뼈대 통일 → 빈 상태 → 홈 재구성 → 목록·카드 → 지도 → 다듬기). **사용자 대안 선택 대기.**
- **남은 일 / 대기**:
  1. Day 지도 fit, 음성 번역 실기기 확인.
  2. ⚠️ 그대로 두기로 한 것: 장소 데이터 품질, 테스트 데이터·더미(USERFLOW.md ⚠️).
- 브랜치: 작업 브랜치는 전부 master/main에 fast-forward 완료.
- ⚠️ Claude 주의: 이 PC에서 `.env`가 추적되던 커밋 → 추적 해제 커밋으로 merge/checkout하면 git이 작업폴더의 .env를 지움(2026-10-02 앱·서버 둘 다 발생, 기록에서 복구함). 브랜치 전환 후 .env 존재 확인할 것.
- ⚠️ Claude 주의: Metro를 백그라운드로 띄울 때 `CI=1`이면 파일 변경 감시가 꺼져 수정이 반영 안 됨 → CI 없이 `npx expo start --port 8081`. 종료는 8081 포트 PID로만.
- ⚠️ Claude 주의: 로컬 서버 테스트 후 `taskkill //IM node.exe`로 끄면 사용자 Metro까지 죽음(2026-10-01 실제로 발생). PID로만 종료할 것.

## 6. 작업 로그

- 2026-10-08: 탐색 속도 개선 — 폰 애니메이션 끔, device.sh waitfor/tapw/anim, Maestro 도입(tour 흐름 7화면 71초, v008), 하단 탭 testID 추가.

- 2026-10-08: 화면별 디자인 시안 장치(우상단 선택 버튼) + 진단 추천안을 B 시안으로 추가(홈 상황별 홈·카테고리 행 목록·번역 헤더/언어 바·날씨/환율 헤더 제목·작성 화면 탭바 숨김), 실기기 A/B 확인(v007). ⚠️ 진단 때 만든 테스트 여행이 실제로는 안 지워져 있었음(앱 화면만 보고 삭제 확인한 실수) → 서버 API로 삭제·확인. 이후 테스트 데이터 정리는 서버에서 확인할 것. 화면 전환 시 시안 등록이 지워지던 경쟁 상태 수정.

- 2026-10-08: 디자인 시스템 v1 확정·적용(v005 스냅), 사용성·미감 진단 문서 게시(v006 스냅 52장, 진단용 테스트 여행 생성 후 삭제). 퀵액션 상자 padding 회귀(4pt 스냅이 16을 만들어 내용 잘림) 발견·수정.

- 2026-10-08: 무선 adb 재페어링(192.168.1.60:42305). 스크린샷 57장을 v000~v003 버전 폴더로 보관 + 스냅 규칙·scripts/device.sh. 새 dev build 설치·애니성지 지도 검증. 디자인 시스템 v0.1 아티팩트 게시.

- 2026-10-02: 3차 — 커뮤니티 API 보안, 배포(서버/앱 push), expo-doctor 18/18 통과, EAS env 정리 후 dev build 요청. JWT_SECRET 변경으로 세션 무효 → 앱이 refresh 401 시 로그아웃하도록 수정.

- 2026-10-01: 2차 작업 — 사용자 결정 반영 수정(앱 8381acb, 서버 fef2f20), 애니성지 지도 원인(옛 Maps 키 Authorization failure) 확인, 커뮤니티 API 무인증 발견. Metro를 실수로 종료 → CI 모드로 재기동함.

- 2026-10-01: PC 포맷으로 로컬 채팅 기록 소실. 코드·커밋 기록을 훑어 이 CLAUDE.md를 처음 작성.
- 2026-10-01: Node/adb 재설치, 양쪽 npm install. 비밀키 코드 측 정리(`fix/secrets-cleanup`). 웹 채팅 "성능평가시스템분리구현"은 무시하기로 함.
- 2026-10-01: 실기기 무선 adb 재페어링(192.168.1.60). 폰에서 쓰는 건 Expo Go가 아니라 **dev build 앱(com.hwan1218.tripjapan)**. 앱 전체 탐색 → docs/USERFLOW.md 작성, 명백한 버그 9건 수정·실기기 검증. 테스트 여행(도쿄 10/1~3)은 만들었다가 삭제함.
- 2026-10-01: Google 키 4개 순환·Render 반영 완료. PowerShell 실행 정책 해제, Expo Go 실행 확인(사용자). 탐색→스크린샷→수정→보고 루프를 작업 방식으로 확정, 무선 디버깅 재페어링 대기.
