// ============================================================
// 타비 디자인 시스템 — Spacing Tokens
// ============================================================

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  gutter: 20, // 화면 좌우 여백 — 코드에서 67번 쓰이던 실제 표준 값을 토큰으로 승격(v1)
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export type SpacingKey = keyof typeof spacing;
