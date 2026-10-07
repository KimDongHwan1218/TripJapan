// ============================================================
// 타비 디자인 시스템 — Color Tokens
// 피그마: 컬러 스타일 시스템 (node 185:2028)
// ============================================================

export const colors = {
  // ── Brand ──────────────────────────────────────────────
  primary: "#E30003",         // Brand Primary Red
  primaryHover: "#CC0003",    // Brand Hover Red
  primarySoft: "#FFE5E3",     // Brand Soft Red (light bg, badges)

  // ── Neutral Scale ──────────────────────────────────────
  neutral900: "#2F2F31",
  neutral800: "#3A3A3D",
  neutral700: "#55575B",
  neutral500: "#8E9196",
  neutral300: "#D9D9DB",
  neutral200: "#E9E9EA",
  neutral100: "#F4F4F5",
  neutral050: "#FAFAFA",

  // ── Background ─────────────────────────────────────────
  background: "#FAFAFA",      // 스크린 기본 배경 (Figma: neutral050)
  backgroundSubtle: "#F5F5F5",// 연한 배경 구분선용
  backgroundBase: "#ECECEC",  // 구분 영역 배경

  // ── Surface ────────────────────────────────────────────
  surface: "#FFFFFF",         // 카드, 입력창, 탭바 배경
  whitebackground: "#FFFFFF", // alias (surface와 동일)

  // ── Text ───────────────────────────────────────────────
  textPrimary: "#2F2F31",     // 제목 / 주요 텍스트 (neutral900)
  textSecondary: "#55575B",   // 본문 / 보조 텍스트 (neutral700)
  textTertiary: "#6E7277",    // 메타정보 텍스트 — v1에서 #8E9196(흰 배경 3.2:1)→ 4.8:1로 조정. 아이콘·placeholder는 neutral500
  textWhite: "#FFFFFF",       // 흰색 텍스트 (버튼 위, 이미지 위)
  textInverse: "#FFFFFF",     // alias (textWhite)

  // ── Border / Divider ───────────────────────────────────
  border: "#D9D9DB",          // 기본 테두리 (neutral300)
  borderSubtle: "#E9E9EA",    // 연한 테두리 (neutral200)
  divider: "#E9E9EA",         // 섹션 구분선 (neutral200)

  // ── Status ─────────────────────────────────────────────
  danger: "#F20D0D",          // 에러 / 삭제
  dangerSoft: "#FFE5E3",      // 에러 배경 (primarySoft와 동일)
  warning: "#F4B400",         // 경고 / 주의
  success: "#34A853",         // 성공 / 완료 (아이콘·점·배경용)
  successText: "#1E7E34",     // 성공 글자색 (흰 배경 5.1:1)
  info: "#1D4ED8",            // 정보·링크 계열 파랑(번역 아이콘 등)
  fall: "#1D4ED8",            // 하락(환율 등) — 한국 금융 관례: 상승 빨강 / 하락 파랑 (6.7:1)
  shadow: "#000000",          // shadowColor 전용
  black: "#000000",           // 사진 뷰어 등 검은 배경

  // ── Interactive ────────────────────────────────────────
  strongbutton: "#E30003",    // 주요 CTA 버튼 (Figma: Brand Primary)
  lightbutton: "#FFE5E3",     // 연한 버튼 배경 (Figma: primarySoft)
  focused: "#E30003",         // 포커스 / 활성 상태 (탭바 active, input border)
  secondary: "#3A3A3D",       // 보조 인터랙션 색 (neutral800)

  // ── Legacy (점진적 제거 예정) ──────────────────────────
  textColored: "#E30003",     // 링크형 텍스트 "더보기" 등 → primary 사용 권장
} as const;

export type ColorKey = keyof typeof colors;
