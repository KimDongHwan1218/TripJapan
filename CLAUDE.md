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

## 3. 작업 방식 (사용자와 합의된 것 — 커밋 기록에서 복원)

- **작업 단위마다 브랜치** (`fix/...`, `feat/...`, 디자인은 `search-redesign-minimal` / `-warm`처럼 **A/B 시안 브랜치 병행** 후 하나 채택) → master(또는 KDH)에 merge.
- **커밋 메시지는 한국어**, 접두어 `fix:` / `feat:` / `design:` / `chore:`. 본문에 **원인 → 수정 내용 → 검증 결과**를 구체적으로. 여러 건이면 `- 파일명: 설명` 불릿.
- **실기기 검증**: Galaxy S23을 adb로 연결해 직접 재현·수정 확인 후 커밋 본문에 "실기기에서 확인" 명시. 검증 못 했으면 못 했다고 쓴다.
- 디자인 피드백은 사용자 감각("짜쳐 보인다", "밍밍하다")으로 오므로 실루엣/레이아웃 수준에서 차별화해 반복 개선. 큰 디자인 변경은 아티팩트로 시안 비교 페이지를 만든 적 있음(「검색탭 리디자인 제안」 https://claude.ai/artifact/TVRc4R9cciw1ttzFaBzEYF).
- 화면 완성도는 1~5단계로 관리했었음 (1 미완 / 2 뼈대·mock / 3 디자인 미적용 / 4 토큰 미사용 / 5 완성). 과거 표: `git show 6040c05:SCREEN_STATUS.md`.

## 4. 현재 상태 (2026-10-01 기준)

- master 최신 커밋 `7b7605c` (2026-09-10, expo-doctor 의존성 정리). 서버 `main` 최신 `1784ea4` (2026-09-17 포맷 전 백업).
- **개발 환경 (2026-10-01 재설치)**: Node v24.19.0 LTS / npm 11 (winget `OpenJS.NodeJS.LTS`), adb 1.0.41 (winget `Google.PlatformTools`, `%LOCALAPPDATA%\Microsoft\WinGet\Packages\Google.PlatformTools_*\platform-tools`). 양쪽 저장소 `npm install` 완료. Claude의 Bash 셸에선 PATH에 안 잡혀 있을 수 있음 → `export PATH="/c/Program Files/nodejs:$PATH"`.
  실행: `npx expo start --clear` (개발 빌드는 EAS `development` 프로필, dev-client). Android Studio/JDK는 미설치(로컬 네이티브 빌드 필요 시 설치).
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
  **남은 일**: Render 환경변수에 새 키 3개 반영(사용자) → 옛 키 삭제 → dev client 재빌드(아래) → 두 브랜치 merge·push. 사용자는 force push로 히스토리 정리하는 것도 원함(포크 1개 있어 완전 삭제는 불가).
- **Maps 키 API 제한 문제 (기존부터 있던 버그)**: Directions API는 키 제한 목록에 없어서 REQUEST_DENIED, Geocoding API는 프로젝트에서 미활성. 옛 키도 똑같았음.
  → 일정 화면 이동 구간(useRouteInfo)이 실제론 항상 "-"였고, 지도 롱프레스 지명은 Nearby Search(정상)로만 동작 중. 콘솔에서 두 API 활성화 + 키 제한에 추가 필요.
  필요한 Maps API: Maps SDK for Android, Places API, Directions API, Geocoding API.
- **Maps 키는 네이티브 빌드에 박힘**: app.config의 `android.config.googleMaps.apiKey`는 AndroidManifest에 들어가므로, 키를 바꾸면 dev client/APK를 **재빌드**해야 네이티브 지도가 새 키를 씀(JS의 REST 호출은 dev 서버 재시작만으로 반영).
- OAuth가 폴링 방식(딥링크 미전환).
- `AuthContext`에 `console.log("user")` 등 디버그 로그 잔존.

## 5. 계획 / 다음 할 일

- (사용자와 새로 정하면 여기에 기록)

## 6. 작업 로그

- 2026-10-01: PC 포맷으로 로컬 채팅 기록 소실. 코드·커밋 기록을 훑어 이 CLAUDE.md를 처음 작성.
- 2026-10-01: Node/adb 재설치, 양쪽 npm install. 비밀키 코드 측 정리(`fix/secrets-cleanup`). 웹 채팅 "성능평가시스템분리구현"은 무시하기로 함.
