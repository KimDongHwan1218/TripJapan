# Tabi 유저플로우 지도 & 탐색 결과

> 2026-10-01 실기기(Galaxy S23, dev build) 전수 탐색 + 코드 대조 결과. 이후 탐색할 때마다 갱신한다.
> 표기: ✅ 정상 · 🔧 수정됨(42874e9, 8381acb / 서버 fef2f20) · ❌ 미해결 버그 · ⚠️ 기획/데이터 이슈(사용자: "일단 둬봐") · 💤 진입 경로 없음 · 🗑️ 제거함

## 0. 앱 진입
- 🔧 refreshToken이 401로 거절되면 로그아웃 → 로그인 화면(7905dbe). 예전엔 무효 토큰으로 로그인된 척 남아 인증 요청이 조용히 실패.
- 스플래시 → `AuthContext`가 저장된 토큰으로 바로 로그인 상태 복원(최소 1.2초 인트로) → `MainTabs`. 비로그인이면 Intro → Login(카카오/구글, 서버 프록시+폴링).
- 하단 탭 5개: 홈 / 일정 / 타비톡 / 검색 / 설정. 탭 단일 탭 = 그 탭의 마지막 화면 유지, 같은 탭 재탭 = 스택 루트로(스크롤 맨 위로는 안 감).

## 1. 홈 (HomeStack)
| 영역 | 동작 | 상태 |
|---|---|---|
| 히어로배너 (`/banners`) | 자동 슬라이드, 탭 불가(onPress 미전달) | ⚠️ 현재 테스트 이미지("ㅇㅅㅇ jingipapashop") |
| 내 여행 카드(TomyTrip) | 여행 없음: "현재 예정된 여행이 없어요" + 여행 일정 보러가기 → 일정 탭 / 여행 중: "N일차 ○○ 여행중!" + 오늘 일정 보기 | 🔧 도시명 한글화 |
| 퀵액션 일본 날씨 | → WeatherDetail(활성 여행 도시, 기본 도쿄), 도시 칩 전환 | 🔧 칩 15개(도쿄 포함), 죽은 "그외" 칩 제거 |
| 퀵액션 지금 환율 | 타일 "862¥ / 변동폭" → ExchangeRateDetail(1엔당 원화 + 계산기) | 🔧 변동폭 0 고정 버그. ⚠️ 타일 "862¥"는 실제로 100엔당 원화인데 ¥ 표기(Figma 그대로) |
| 퀵액션 타비 번역 | → TranslationSelect → 텍스트/이미지/음성 | 🔧 텍스트·이미지 API 계약 수정. 🔧 음성: AMR-WB/WAV 녹음 → 서버 `/translate/stt`(서버 배포 필요, 녹음은 실기기 미검증) |
| 퀵액션 여행 경보 | → TravelAlertDetail(외교부 API) → TravelAlertItem | ✅ (날짜 미표시) |
| 퀵액션 타비톡 | → 타비톡 탭 | ✅ |
| 타비 PICK | 칩(전체/관광/맛집/카페/쇼핑) → `/places` 앞 5개, 항목 → 검색탭 DetailScreen, 모두보기 | 🔧 모두보기 → 해당 카테고리. ⚠️ 큐레이션 아님: 시드 더미("Ikebukuro Spot 2")가 노출 |
| 특가 배너 | "준비 중입니다" Alert | ⚠️ MOCK 배지 노출 |
| 실시간 타비톡 미리보기 | 최신 3개, 카드 → 글 상세, 바로가기 → 타비톡 탭 | 🔧 카드 → 해당 글 |
| 슬라이드 (`/slides`) | 탭 → 외부 브라우저 | ⚠️ 1장, 섹션 제목 없음. `/tips`는 받아만 두고 미사용 |
| 🗑️ 항공/호텔/투어 스택 | 진입 버튼이 없던 미완성 기능 → 라우트·props 제거(화면 파일은 남김) | 제거 |

## 2. 일정 (ScheduleStack)
- 여행 없음: 이미지 + "새로운 여행 떠나기"(AddTripModal) + "지난 여행 보기".
- 여행 만들기: 도시 15개 → 날짜 범위(달력) → 완료 → 활성 여행 Day 화면. ⚠️ 문구 "김동환님으로 여행을 떠나시나요?" 어색, 달력 영어(October/Sun).
- Day 화면(SchedulingScreen): 헤더 "오늘 ○○ 여행 N일차", 지도+경로선, Day 페이저(스와이프), 도보 구간 "🚶 47분 · 3.3 km", 일정 편집 →
  - TripEdit: 상단 검색(자체 DB `/places/search`) → 장소 선택 → 일정 추가, 드래그 재정렬, 삭제, 지도 롱프레스 추가(역지오코딩), 편집 완료.
  - 🗑️ 대중교통 토글 제거: Google Directions가 일본 transit을 제공하지 않음(ZERO_RESULTS). 다시 넣으려면 외부 앱 딥링크 등 다른 방식 필요.
  - ⚠️ 검색이 자체 DB만 → "Tokyo Tower"/"東京タワー" 0건, "sensoji"는 육각당 1건. 추가 시 시간 입력 없음. Day 화면 일정 항목 탭 무반응. 🔧 Day 지도는 그날 장소 전체에 자동 fit(00b1dc7, 실기기 미검증).
- 지난 여행 보기(TripHistory): 진행 중 여행도 "현재 여행" 배지로 포함, 오래된 순 정렬, 카드 → PastTrip(읽기 전용), 휴지통 → 확인 후 삭제 ✅. ⚠️ 날짜에 연도 없음, 명칭 "지난/이전 여행 보기" 혼용.
- 여행 종료 7일 이내면 빈 화면에 "방문한 곳 리뷰 쓰기" 노출(onWriteVisitedReview → ReviewWrite) — 이번엔 대상 여행이 없어 미검증.

## 3. 타비톡 (CommunityStack)
- 메인: 헤더(로고·프로필 칩·글쓰기), 이번주 인기글 가로 카드, 게시판 아이콘 6개(자유/여행후기/질문 Q&A/맛집 추천/애니 성지/쇼핑 성지), 내 글 보기, 실시간 피드 5개.
  - 🔧 세 섹션 제목 덩어리 전체가 링크(›): 인기글 → HotPostsScreen, 내 글 보기 → MyPosts, 실시간 타비톡 → BoardScreen(all, 무한 스크롤).
  - 🔧 내 글 보기는 작성자 필터(useMyPosts)로.
  - ⚠️ 헤더 프로필 칩 탭 무반응. 🔧 인기글 명칭 "실시간 인기글"로 통일(사용자 결정, 집계는 불러온 글의 좋아요·댓글·조회수 점수).
- 게시판(BoardScreen): 🔧 게시판별 API + 무한 스크롤(예전엔 "전체" 첫 페이지를 앱에서 필터). MOCK 프로모 배너, 글쓰기 버튼이 헤더+FAB 중복, 글 → 상세.
- 글 상세: 내 글이면 수정/삭제, 남의 글이면 신고, 댓글 작성/내 댓글 삭제, 좋아요. 🔧 카테고리 "free" 노출.
  - 🔧 좋아요 초기 상태: likes-count?user_id=로 liked 조회(서버 배포 필요).
  - 🔧 "수정"이 빈 작성 화면을 열어 새 글이 생기던 것 → 기존 내용 채우고 PATCH.
- 글쓰기(PostCreate): 게시판 드롭다운, 🔧 제목칸 복구(없어서 등록 불가였음), 본문, 이미지 10장. 여행후기를 고르면 TripReviewCompose(종료 7일 이내 여행의 장소 리뷰 묶음)로 전환.
- 내가 쓴 글(MyPosts): 🔧 남의 글 섞임/카운트 0/카테고리 오표기. 🔧 서버 user_id·limit·offset 필터(fef2f20, 배포 필요).
- 🔧 보안: 커뮤니티 쓰기 API 전부 requireAuth + 작성자는 토큰 기준 + 수정/삭제 소유자 확인(서버 8245121, 운영 배포됨). 앱은 쓰기 요청에 토큰 첨부(00b1dc7).

## 4. 검색 (SearchStack)
- 허브: 타일 6개(관광지/맛집/카페/쇼핑/애니성지/편의점) + 즐겨찾기 미리보기 + 헤더 즐겨찾기·검색 아이콘.
- CategoryScreen: 지역 필터 바텀시트(15개 도시), 무한 스크롤, 행 즐겨찾기 별. 맛집=세로 포토카드, 쇼핑=2열 그리드.
  - ⚠️ "지역 전체"면 시드 더미가 맨 위. 정렬 기준 없음(교토 관광지 1위가 대학 자료관). `name_ko` 오역 다수(京都芸術大学芸術館→"교토대학"). 썸네일 거의 없음 → 맛집은 큰 회색 박스 나열. 카테고리 이동 시 지역 필터 초기화.
- 통합 검색(허브 돋보기): CategoryScreen 전체 모드, 자동 포커스 ✅.
- DetailScreen: 히어로 이미지, 카테고리·평점, 주소, 소개, 리뷰 목록, 리뷰 작성(내 리뷰 없을 때), 내 리뷰 수정/삭제(7일 이내), 남 리뷰 신고, 즐겨찾기. ⚠️ 테스트 이미지(실존 인물 사진), 리뷰 본문 끝 빈 줄 trim 안 함.
- 애니성지: 작품 그리드(표지+성지 수) ✅ → 작품 지도. 🔧 2026-10-08 새 dev build(새 Maps 키)로 타일 정상·핀 탭 시 정보시트(경로 찾기/Google 지도에서 열기) 정상 확인. (이전: ❌ 바탕 지도 타일 안 그려짐 — **원인 확인: dev build에 박힌 옛 Maps 키(삭제됨) → logcat "Google Android Maps SDK: Authorization failure"**(앱 실행당 1회만 찍힘). 다른 지도는 예전 타일 캐시라 보였던 것. → 새 키로 dev build 재빌드 필요. 핀 탭 무반응은 재빌드 후 재확인.
- 편의점: "준비 중" + 스켈레톤(의도된 상태).
- 즐겨찾기: 목록/지도 토글. 🔧 지도 중심 = 첫 번째 즐겨찾기(예전엔 좌표 평균이라 도시 사이 산간이 떠서 마커가 안 보였음).

## 5. 설정 (SettingsStack)
- 프로필 카드 → 프로필 편집(닉네임/이메일/전화/소개) ✅, 알림 설정(마스터+3종) ✅, 공지사항(⚠️ 테스트 글 "ㅇㅅㅇ?" 1건) → 상세, 약관/개인정보 탭 ✅, 고객센터(⚠️ 더미 연락처 support@tavi.app / 010-1234-5678), 긴급 연락처 ✅, 로그아웃·회원 탈퇴(미실행).

## 6. 코드상 미사용(어디서도 import 안 됨)
CommunityTopTabs, TaviTalkPostCreateView, FlightList, HotelList, JapanMap, Popupads, SectionHeader, FlightHotDeals, CalendarFullModal, CitySelectModal, ScheduleDetailModal, ScheduleList, TripPickerModal, useTripEdit, SchedulingScreen.styles, ProfileCard, SettingSwitchRow, Center, ScreenWrapper, ImageWithFallback, IconSymbol(.ios), TabBarBackground(.ios), useAsyncState, useCachedQuery, useDebounce, useScheduleDays, useScheduleMap, domain/scheduleStatus, domain/trip, utils/authEnv, utils/getPublicUrl, utils/pickImage, constants/languages·routes·time, 0바이트 파일들.
(정리 여부는 사용자 결정 — 일부는 향후 쓰려고 남긴 것일 수 있음)
