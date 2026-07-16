# 앱 수준 향상 과제

## 단기 (완료)

- [x] Toast 컴포넌트 (글 작성, 좋아요, 삭제, 댓글 피드백)
- [x] 좋아요 optimistic update (서버 응답 기다리지 않고 즉시 UI 반영, 실패 시 rollback)
- [x] 검색 디바운스 300ms
- [x] Pull-to-refresh (커뮤니티, 검색, 게시판별 목록, 내 게시글)
- [x] 커뮤니티 무한 스크롤 (offset-based pagination, PAGE_SIZE=20)

## 중기 (완료)

- [x] 즐겨찾기 + 지도 통합 (AsyncStorage 기반, 리스트/지도 뷰 토글, 마커 Callout)
- [x] 뒤로가기 후 데이터 invalidation (fromCreate/fromEdit 파라미터 감지)
- [x] 스크롤 위치 복원 (useFocusEffect + scrollToOffset)

## 중기 (미완료)

- [ ] OAuth 딥링크 전환 (현재 폴링 방식, expo-linking redirect 필요)
- [x] 즐겨찾기 서버 동기화 (AsyncStorage + GET/POST/DELETE /favorites 서버 동기화 완료)

## 기능 미완성

1. OAuth 딥링크 전환 (현재 폴링 방식, 수동 복귀 필요)
2. ~~회원 탈퇴 API 연결~~ → **완료** (DELETE /users/{userId} + logout)
3. ~~음성 번역 STT~~ → **완료** (expo-av 녹음 → /stt 엔드포인트 → /translate 파이프라인)
4. 호텔, 투어 WebView URL 설정 (화면은 있음, 실제 URL 미입력)
5. /slides, /tips 서버 API 구현 (더미 코드 유지)
6. ~~FCM 푸시 알림~~ → **완료** (expo-notifications 설치, 권한 요청, 토큰 서버 등록)

## 신규 개발 예정 (기능명세서 FN-080~093 참고)

- [ ] 대중교통 상세 안내 (지하철 호선, 환승, 소요시간 단계별 — FN-080)
- [ ] 현재 위치 기반 장소 검색 (FN-081, FN-084)
- [ ] 일정 경로 최적화 제안 (FN-082)
- [ ] 검색 결과 지도 뷰 토글 (FN-083)
- [ ] 장소 리뷰 목록 조회 (FN-085)
- [ ] 게시글 검색 (FN-086)
- [ ] 지하철 노선도 (FN-087)
- [ ] 여행 준비 체크리스트 (FN-089)
- [ ] 환율 계산기 고도화 (FN-090, 현재 기본 계산기 구현됨)
- [ ] 공통 API 클라이언트 레이어 (FN-092)
- [ ] 주요 데이터 로컬 캐시 (FN-093)

## 장기 (인프라)

- [ ] 에러 바운더리 + 네트워크 없을 때 안내 배너 (NetInfo)
- [ ] AsyncStorage persist 고도화 (커뮤니티, 검색 데이터)
- [ ] Render 서버 슬립 warmup ping

## 보안

- [ ] config/env.ts SUPABASE_KEY 하드코딩 → .env로 이동
- [ ] EAS Secret으로 빌드 시 환경변수 관리
