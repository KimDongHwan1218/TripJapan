// ============================================================
// 타비 디자인 시스템 — Category Tones (카테고리 구분용 색)
// 버튼·강조가 아니라 "종류를 알아보게 하는" 색 — 아이콘과 연한 배경에만 쓴다(D2 색 채우기 최소화와 별개).
// 타비톡 보드 아이콘(CommunityScreen BOARDS)과 같은 계열로 맞춰, 탭마다 회색/컬러로 결이 갈리던 것 해소.
// fg = 아이콘·글자색, bg = 아이콘 뒤 연한 배경
// ============================================================

export const tones = {
  blue: { fg: "#1A73E8", bg: "#E8F0FE" },
  orange: { fg: "#E8590C", bg: "#FBE9E7" },
  brown: { fg: "#8D5B3E", bg: "#F3EBE4" },
  pink: { fg: "#D81B60", bg: "#FCE4EC" },
  teal: { fg: "#00897B", bg: "#E0F2F1" },
  green: { fg: "#1E8E3E", bg: "#E6F4EA" },
  purple: { fg: "#8E24AA", bg: "#F3E5F5" },
  yellow: { fg: "#E3A100", bg: "#FFF8E1" },
} as const;

export type ToneKey = keyof typeof tones;

// 장소 카테고리 → 톤 (검색 허브 타일, 즐겨찾기 자리표시 등에서 같은 색을 쓰도록 한 곳에서 정의)
export const CATEGORY_TONE: Record<string, ToneKey> = {
  attraction: "blue",
  restaurant: "orange",
  cafe: "brown",
  shopping: "pink",
  anime: "teal",
  conbini: "green",
};

// 타비톡 게시판 → 톤 (CommunityScreen BOARDS 아이콘 색과 같은 짝)
export const BOARD_TONE: Record<string, ToneKey> = {
  free: "yellow",
  review: "blue",
  question: "purple",
  food: "orange",
  info: "teal",
  shopping: "pink",
};
