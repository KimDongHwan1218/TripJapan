# Tabi 개발 인수인계

앱 이름: TripJapan / tabi
일본 여행을 준비하는 한국인을 위한 올인원 여행 앱.


## 앱 구성

탭 5개로 구성된다.

1. 홈 - 날씨, 환율, 번역, 여행경보 퀵 액션 / 여행지 슬라이드 / 타비톡 미리보기
2. 일정 - 여행 생성(도시+날짜), 장소 검색 및 추가, 드래그 재정렬, 지도 경로
3. 타비톡 - 커뮤니티 (게시판, 인기글, 댓글, 좋아요)
4. 검색 - 장소 검색 및 상세 페이지
5. 설정 - 프로필 편집, 공지, 알림, 이용약관, 문의


## 환경 설정

사전 요구사항:
- Node 20 이상
- npm 10 이상
- Android Studio 또는 Xcode

설치 및 실행:

```
git clone https://github.com/KimDongHwan1218/TripJapan.git
cd TripJapan
npm install
npx expo start --clear
```


## 기술 스택

- Expo SDK 54 / React Native 0.81 / React 19
- TypeScript 5.9
- EAS Build (배포 빌드용)

서비스 및 API (변경될 수 있음):
- 백엔드 서버: https://tavi-server.onrender.com (Render 무료 티어, 비활성 시 슬립 있음)
- DB: Supabase - https://wwmdmngncknalzfcpejn.supabase.co
- 지도: Google Maps Platform (MAPS_PLATFORM_API_KEY 필요)
- 인증: Kakao / Google OAuth (서버 프록시 방식)
- 날씨: Open-Meteo (무료, 키 불필요)
- 환율: Frankfurter (무료, 키 불필요)
- 번역: 자체 서버 /translate 엔드포인트


## 프로젝트 구조

```
TripJapan/
  index.js                   진입점
  App.tsx                    Context Provider 조합
  app.config.js              Expo 설정 (번들ID, 플러그인, 환경변수)
  config/env.ts              API 서버 주소, Supabase, Google Maps 키
  metro.config.js            Metro 번들러 설정

  navigation/
    RootStackNavigator       로그인 여부에 따라 Intro/Login vs MainTabs 분기
    MainTabNavigator         하단 탭 5개
    HomeStackNavigator       홈 하위 (번역, 날씨, 환율, 여행경보, 항공, 호텔, 투어)
    CommunityStackNavigator  타비톡 하위

  contexts/
    AuthContext              로그인 상태, 유저 정보, updateProfile
    TripContext              여행 목록, activeTrip, 일정 CRUD, createTrip
    CommunityContext         게시글 캐시, fetch, refresh
    UIContext                모달 상태

  screens/
    auth/                   Intro, Login, KakaoLogin, GoogleLogin
    home/                   홈 화면 + 날씨/환율/여행경보/번역 상세
      translation/          TranslationSelect, TextTranslation, ImageTranslation, VoiceTranslation
      flight/               Skyscanner WebView 기반 항공 검색
      Hotel/, Tour/         WebView 링크 (URL 미설정 상태)
    community/              타비톡 메인, 게시판, 글쓰기, 글 상세(redesign/ 폴더 사용)
    schedules/              일정 관리 전체
    search/                 장소 검색 및 상세
    settings/               설정 전체

  styles/
    colors.ts               디자인 토큰 (컬러)
    spacing.ts, radius.ts, typography.ts, shadows.ts
```


## 아키텍처 요약

인증 흐름:
1. LoginScreen에서 카카오 또는 구글 선택
2. 브라우저 열림 (expo-web-browser)
3. 서버가 OAuth 처리 후 DB에 토큰 저장
4. 앱에서 3초 간격으로 폴링 (최대 5분)
5. 토큰 수신 시 AsyncStorage에 저장, AuthContext.user 세팅
6. RootStackNavigator가 MainTabs로 전환

여행 데이터:
- TripContext가 /trips, /trips/:id/days, /tripdays/:id/schedules를 관리
- activeTrip은 trips 중 오늘 날짜가 포함된 여행으로 자동 설정

커뮤니티 데이터:
- CommunityContext가 카테고리별로 게시글을 캐싱
- 글 상세는 usePostDetail 훅이 직접 API 호출


## API 엔드포인트

Base URL: https://tavi-server.onrender.com

여행:
- GET    /trips
- POST   /trips
- GET    /trips/:id/days
- GET    /tripdays/:id/schedules
- POST   /tripdays/:id/schedules
- PATCH  /schedules/:id
- DELETE /schedules/:id

커뮤니티:
- GET    /community/posts?category=전체
- GET    /community/posts/:id
- POST   /community/posts
- DELETE /community/posts/:id
- GET    /community/posts/:id/comments
- POST   /community/comments
- DELETE /community/comments/:id
- POST   /community/posts/:id/like-toggle
- GET    /community/posts/:id/likes-count
- POST   /community/posts/:id/report

기타:
- POST   /auth/kakao
- POST   /auth/google
- GET    /translate
- GET    /places


## 현재 이슈 목록

미구현:
- 회원 탈퇴 API 미연결 (SettingsSection.tsx onPress 빈 함수)
- 음성 번역 STT 미구현 (VoiceTranslationScreen - UI만 있음)
- 호텔, 투어 WebView URL 미설정
- 리뷰 작성 화면이 장소 상세에서 연결 안 됨

OAuth 관련:
- 폴링 방식이라 브라우저 로그인이 5분 넘으면 타임아웃
- 브라우저 로그인 후 앱으로 자동 복귀 안 됨, 수동 전환 필요

데이터:
- 서버에 /slides, /tips 엔드포인트 없어서 홈 슬라이드가 fallback으로 표시됨
- 커뮤니티 무한 스크롤 없음 (50개 초과 게시글 표시 불가)
- 좋아요 optimistic update 없음

기타 UX:
- 검색 디바운스 없음 (타이핑마다 API 호출)
- 오프라인 상태에서 에러 없이 빈 화면 표시
- 게시글 보고 뒤로가면 리스트 처음으로 이동
