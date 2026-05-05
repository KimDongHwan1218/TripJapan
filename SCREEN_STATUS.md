# TripJapan 화면 상태 분류

> 마지막 업데이트: 2026-04-30 (3단계 작업 반영)
> 기준 브랜치: KDH

---

## 분류 기준

| 단계 | 설명 |
|------|------|
| **1 - 미완** | 기능 구현 자체가 되지 않은 상태 (스텁, TODO, 빈 껍데기) |
| **2 - 뼈대** | UI 구조는 있으나 실제 API 연동 없이 mock 데이터만 사용 |
| **3 - 디자인 미적용** | 실제 데이터 연동은 되나, Figma 스타일 반영 없이 기본 UI |
| **4 - 토큰 미사용** | 디자인은 구현됐으나 `/styles` 토큰 대신 하드코딩된 값 사용 |
| **5 - 완성** | 실제 데이터 연동 + Figma 디자인 + `/styles` 토큰 모두 적용 |

---

## 인증 (auth)

| 파일 | 단계 | 메모 |
|------|------|------|
| `screens/auth/IntroScreen.tsx` | 5 | 완성 |
| `screens/auth/LoginScreen.tsx` | 5 | Kakao/Google OAuth 구현 완료 |
| `screens/auth/SignupScreen.tsx` | 1 | 불필요 — Kakao/Google OAuth로 자동 가입 |
| `screens/auth/components/KakaoLogin.tsx` | 5 | Linking + 서버 프록시 방식 |
| `screens/auth/components/GoogleLogin.tsx` | 5 | Linking + 서버 프록시 방식 |

---

## 홈 (home)

| 파일 | 단계 | 메모 |
|------|------|------|
| `screens/home/HomeScreen.container.tsx` | 5 | 완성 |
| `screens/home/HomeScreen.view.tsx` | 5 | HeroBanner, TaviPick, TaviTalkPreview 등 포함 |
| `screens/home/components/HeroBanner.tsx` | 5 | |
| `screens/home/components/SpecialBanner.tsx` | 5 | |
| `screens/home/components/TaviPick.tsx` | 5 | |
| `screens/home/components/TaviTalkPreview.tsx` | 5 | |
| `screens/home/components/QuickActions.tsx` | 5 | |
| `screens/home/components/Tomytrip.tsx` | 5 | |
| `screens/home/components/InfoWidgetGrid.tsx` | 2 | mock 데이터 사용 |
| `screens/home/components/Tips.tsx` | 2 | mock 데이터 사용 |
| `screens/home/components/JapanMap.tsx` | 2 | 정적 지도 이미지 |
| `screens/home/components/Popupads.tsx` | 2 | mock 광고 데이터 |
| `screens/home/components/Slides.tsx` | 2 | mock 슬라이드 |
| `screens/home/components/FlightList.tsx` | 2 | mock 항공편 |
| `screens/home/components/HotelList.tsx` | 2 | mock 호텔 |
| `screens/home/components/SectionHeader.tsx` | 5 | |
| `screens/home/ReviewWriteScreen.tsx` | 5 | |
| `screens/home/TravelInfoScreen.tsx` | 5 | 실제 API 연동, 토큰 사용 완료 |
| `screens/home/TravelInfoScreen.view.tsx` | 5 | 카테고리 탭 + 카드 리스트 완성 |
| `screens/home/TravelInfoScreen.container.tsx` | 5 | |
| `screens/home/Hotel/HotelHomeScreen.tsx` | 2 | 외부 웹뷰 링크만 |
| `screens/home/Hotel/HotelWebViewScreen.tsx` | 2 | 웹뷰 스켈레톤 |
| `screens/home/Tour/TourHomeScreen.tsx` | 2 | 외부 웹뷰 링크만 |
| `screens/home/Tour/TourWebViewScreen.tsx` | 2 | 웹뷰 스켈레톤 |

---

## 홈 - 항공 (flight)

| 파일 | 단계 | 메모 |
|------|------|------|
| `screens/home/flight/FlightHomeScreen.tsx` | 5 | Skyscanner WebView 위젯 |
| `screens/home/flight/FlightSearchResultScreen.tsx` | 2 | Skyscanner가 검색 결과까지 처리 — 별도 화면 불필요 |
| `screens/home/flight/FlightSearchResultScreen.view.tsx` | 2 | 동상 |
| `screens/home/flight/FlightSearchResultScreen.container.tsx` | 2 | 동상 |
| `screens/home/flight/FlightDetailScreen.tsx` | 2 | 동상 |
| `screens/home/flight/FlightDetailScreen.view.tsx` | 2 | 동상 |
| `screens/home/flight/FlightDetailScreen.container.tsx` | 2 | 동상 |
| `screens/home/flight/ExternalWebViewScreen.tsx` | 2 | 웹뷰 래퍼 |
| `screens/home/flight/components/FlightSearchWidget.tsx` | 5 | |
| `screens/home/flight/components/FlightResultCard.tsx` | 5 | |
| `screens/home/flight/components/FlightHotDeals.tsx` | 2 | mock 데이터 |
| `screens/home/flight/components/FilterSortBar.tsx` | 5 | |
| `screens/home/flight/components/SearchSummaryBar.tsx` | 5 | |
| `screens/home/flight/components/modals/AirportPickerModal.tsx` | 4 | 미수정 |
| `screens/home/flight/components/modals/CabinPickerModal.tsx` | 4 | 미수정 |
| `screens/home/flight/components/modals/DatePickerModal.tsx` | 4 | 미수정 |
| `screens/home/flight/components/modals/PassengerPickerModal.tsx` | 4 | 미수정 |
| `screens/home/flight/components/modals/SearchEditModal.tsx` | 4 | 미수정 |
| `screens/home/flight/components/skeleton/FlightListSkeleton.tsx` | 5 | |

---

## 일정 (schedules)

| 파일 | 단계 | 메모 |
|------|------|------|
| `screens/schedules/SchedulingScreen.tsx` | 5 | container 역할 |
| `screens/schedules/SchedulingScreen.view.tsx` | 5 | |
| `screens/schedules/TripEditScreen.tsx` | 5 | |
| `screens/schedules/TripEditScreen.view.tsx` | 5 | Polyline, 드래그 reorder |
| `screens/schedules/TripEditScreen.container.tsx` | 5 | localOrders, routeInfo |
| `screens/schedules/TripHistoryScreen.tsx` | 5 | |
| `screens/schedules/components/AddTripModal.tsx` | 5 | |
| `screens/schedules/components/CalendarFullModal.tsx` | 4 | 미수정 — 내용 복잡 |
| `screens/schedules/components/CitySelectModal.tsx` | 5 | |
| `screens/schedules/components/ScheduleCard.tsx` | 5 | |
| `screens/schedules/components/ScheduleDetailModal.tsx` | 4 | 미수정 — 내용 복잡 |
| `screens/schedules/components/ScheduleList.tsx` | 4 | 미수정 |
| `screens/schedules/components/ScheduleMap.tsx` | 5 | |
| `screens/schedules/components/SortableScheduleList.tsx` | 5 | segments/route 표시 |
| `screens/schedules/components/TimeWheelPicker.tsx` | 4 | 미수정 — 커스텀 피커 |
| `screens/schedules/components/TripPickerModal.tsx` | 5 | |
| `screens/schedules/hooks/usePlaceSearch.ts` | 5 | Google Places API |
| `screens/schedules/hooks/useRouteInfo.ts` | 5 | Directions API + 캐싱 |

---

## 검색 (search)

| 파일 | 단계 | 메모 |
|------|------|------|
| `screens/search/SearchHomeScreen.tsx` | 5 | |
| `screens/search/SearchHomeScreen.view.tsx` | 5 | Figma 재설계 완료 |
| `screens/search/SearchHomeScreen.container.tsx` | 5 | popular/category 분기 |
| `screens/search/DetailScreen.tsx` | 5 | |
| `screens/search/DetailScreen.view.tsx` | 5 | |
| `screens/search/DetailScreen.container.tsx` | 5 | |
| `screens/search/hooks/usePlaces.ts` | 5 | |
| `screens/search/components/BadgeRow.tsx` | 5 | |
| `screens/search/components/PlaceCard.tsx` | 5 | |

---

## 커뮤니티 (community)

| 파일 | 단계 | 메모 |
|------|------|------|
| `screens/community/CommunityScreen.tsx` | 5 | |
| `screens/community/CommunityScreen.view.tsx` | 5 | |
| `screens/community/CommunityScreen.container.tsx` | 5 | |
| `screens/community/BoardScreen.tsx` | 5 | |
| `screens/community/BoardScreen.view.tsx` | 5 | |
| `screens/community/BoardScreen.container.tsx` | 5 | |
| `screens/community/PostCreateScreen.tsx` | 5 | |
| `screens/community/PostCreateScreen.view.tsx` | 5 | |
| `screens/community/PostCreateScreen.container.tsx` | 5 | |
| `screens/community/PostDetailScreen.tsx` | 1 | 구버전 — TaviTalkPostDetail로 대체 |
| `screens/community/PostDetailScreen.view.tsx` | 5 | |
| `screens/community/HotPostsScreen.tsx` | 5 | 순위 배지 + 네비게이션 + 빈 상태 재설계 완료 |
| `screens/community/MyPostsScreen.tsx` | 5 | |
| `screens/community/MyPostsScreen.view.tsx` | 5 | borderRadius 토큰 통일 완료 |
| `screens/community/MyPostsScreen.container.tsx` | 5 | |
| `screens/community/redesign/TaviTalkPostDetailView.tsx` | 5 | 실제 API 연동 + 재설계 |
| `screens/community/redesign/TaviTalkPostDetailContainer.tsx` | 5 | |
| `screens/community/redesign/TaviTalkPostCreateView.tsx` | 4 | UI 완성, API 미연결 (PostCreateScreen이 대체) |
| `screens/community/redesign/TaviTalkHomeView.tsx` | 2 | mock 데이터, 실제 커뮤니티 화면이 대체 |
| `screens/community/components/CommunityTopTabs.tsx` | 5 | |
| `screens/community/components/HotPostsSection.tsx` | 5 | |
| `screens/community/components/LatestPostsSection.tsx` | 5 | |
| `screens/community/components/PostListItem.tsx` | 5 | |

---

## 설정 (settings)

| 파일 | 단계 | 메모 |
|------|------|------|
| `screens/settings/SettingsScreen.tsx` | 5 | |
| `screens/settings/ProfileEditScreen.tsx` | 5 | |
| `screens/settings/ProfileEditScreen.view.tsx` | 5 | |
| `screens/settings/ProfileEditScreen.container.tsx` | 5 | |
| `screens/settings/NoticeScreen.tsx` | 5 | API 연결 + 로딩/빈 상태 + NEW 배지 재설계 완료 |
| `screens/settings/NoticeDetailScreen.tsx` | 5 | mock 데이터 5개 완성 |
| `screens/settings/NotificationSettingsScreen.tsx` | 5 | AsyncStorage 연동, 토큰 완비 |
| `screens/settings/PolicyScreen.tsx` | 5 | 이용약관 + 개인정보방침 탭 UI 완성 |
| `screens/settings/SupportScreen.tsx` | 5 | 연락처 카드 + FAQ 아코디언 재설계 완료 |
| `screens/settings/components/AppInfoSection.tsx` | 5 | |
| `screens/settings/components/ProfileCard.tsx` | 5 | |
| `screens/settings/components/ProfileSummaryCard.tsx` | 5 | |
| `screens/settings/components/SettingItem.tsx` | 5 | |
| `screens/settings/components/SettingRow.tsx` | 5 | |
| `screens/settings/components/SettingSwitchRow.tsx` | 5 | |
| `screens/settings/components/SettingsSection.tsx` | 5 | |

---

## 요약

| 단계 | 파일 수 |
|------|---------|
| 1 - 미완 | 3 (SignupScreen, NoticeDetailScreen, PolicyScreen) |
| 2 - 뼈대 | ~10 (flight 컴포넌트들, TaviTalkHomeView 등) |
| 3 - 디자인 미적용 | 0 (전부 해소됨) |
| 4 - 토큰 미사용 | ~10 (flight 컴포넌트들) |
| 5 - 완성 | ~50 |
