// ============================================================
// 타비 디자인 시스템 — Border Radius Tokens
// 피그마 사용 값 기준
// ============================================================

export const radius = {
  xs: 4,    // 작은 태그, 인풋 내부 요소
  sm: 8,    // 소형 버튼, 소형 카드
  md: 12,   // 일반 카드 (Figma 카드 기준값)
  lg: 16,   // 큰 카드, 섹션 컨테이너
  xl: 20,   // 카테고리 칩 (Figma: 20px)
  pill: 24, // CTA 버튼 — pill shape (Figma: 24px)
  full: 100, // 뱃지, 작은 태그 — 완전한 원형
} as const;

export type RadiusKey = keyof typeof radius;
