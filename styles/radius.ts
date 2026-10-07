// ============================================================
// 타비 디자인 시스템 — Border Radius Tokens
// 피그마 사용 값 기준
// ============================================================

// 디자인 시스템 v1(docs/design-system.html §05): 다섯 단계만 쓴다.
// 높이 40 이하 = sm 또는 full, 41~120 = md, 그보다 큰 면 = lg. 안쪽 반경 = 바깥 반경 − 안쪽 여백.
// 예전 lg16/xl20, pill24/full100은 눈으로 구분되지 않아 합침 — xl·pill은 호환용 별칭으로만 남김.
export const radius = {
  xs: 4,     // 배지·태그
  sm: 8,     // 썸네일·작은 버튼
  md: 12,    // 카드·입력칸·리스트 행
  lg: 20,    // 바텀시트 위쪽·큰 배너·허브 타일
  full: 100, // 칩·주요 버튼·아바타
  xl: 20,    // (호환) = lg
  pill: 100, // (호환) = full
} as const;

// 반경 8 이상에 함께 쓰는 연속 곡률(squircle). iOS에서만 적용되고 Android는 원호로 그려짐.
export const continuousCurve = { borderCurve: "continuous" } as const;

export type RadiusKey = keyof typeof radius;
