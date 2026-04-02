// ============================================================
// 타비 디자인 시스템 — Typography Tokens
// 피그마: 텍스트 스타일 시스템 (node 185:2276)
// 폰트: Pretendard (expo-font으로 로드 필요)
// ============================================================

import { TextStyle } from "react-native";
import { colors } from "./colors";

// Pretendard 폰트 패밀리 상수
// expo-font에서 로드한 이름과 일치해야 함
export const FONT_FAMILY = {
  regular: "Pretendard-Regular",
  medium: "Pretendard-Medium",
  semibold: "Pretendard-SemiBold",
  bold: "Pretendard-Bold",
} as const;

// ── Figma 스케일 (Display / H1-H6 / Label) ──────────────────
export const textStyles: Record<string, TextStyle> = {
  // Display — 32px
  "display/regular":  { fontFamily: FONT_FAMILY.regular,  fontSize: 32, lineHeight: 40 },
  "display/medium":   { fontFamily: FONT_FAMILY.medium,   fontSize: 32, lineHeight: 40 },
  "display/semibold": { fontFamily: FONT_FAMILY.semibold, fontSize: 32, lineHeight: 40 },
  "display/bold":     { fontFamily: FONT_FAMILY.bold,     fontSize: 32, lineHeight: 40 },

  // H1 — 24px
  "h1/regular":  { fontFamily: FONT_FAMILY.regular,  fontSize: 24, lineHeight: 32 },
  "h1/medium":   { fontFamily: FONT_FAMILY.medium,   fontSize: 24, lineHeight: 32 },
  "h1/semibold": { fontFamily: FONT_FAMILY.semibold, fontSize: 24, lineHeight: 34 },
  "h1/bold":     { fontFamily: FONT_FAMILY.bold,     fontSize: 24, lineHeight: 32 },

  // H2 — 22px
  "h2/regular":  { fontFamily: FONT_FAMILY.regular,  fontSize: 22, lineHeight: 30 },
  "h2/medium":   { fontFamily: FONT_FAMILY.medium,   fontSize: 22, lineHeight: 30 },
  "h2/semibold": { fontFamily: FONT_FAMILY.semibold, fontSize: 22, lineHeight: 30 },
  "h2/bold":     { fontFamily: FONT_FAMILY.bold,     fontSize: 22, lineHeight: 30 },

  // H3 — 20px
  "h3/regular":  { fontFamily: FONT_FAMILY.regular,  fontSize: 20, lineHeight: 28 },
  "h3/medium":   { fontFamily: FONT_FAMILY.medium,   fontSize: 20, lineHeight: 28 },
  "h3/semibold": { fontFamily: FONT_FAMILY.semibold, fontSize: 20, lineHeight: 28 },
  "h3/bold":     { fontFamily: FONT_FAMILY.bold,     fontSize: 20, lineHeight: 28 },

  // H4 — 18px
  "h4/regular":  { fontFamily: FONT_FAMILY.regular,  fontSize: 18, lineHeight: 26 },
  "h4/medium":   { fontFamily: FONT_FAMILY.medium,   fontSize: 18, lineHeight: 26 },
  "h4/semibold": { fontFamily: FONT_FAMILY.semibold, fontSize: 18, lineHeight: 26 },
  "h4/bold":     { fontFamily: FONT_FAMILY.bold,     fontSize: 18, lineHeight: 26 },

  // H5 — 16px
  "h5/regular":  { fontFamily: FONT_FAMILY.regular,  fontSize: 16, lineHeight: 22 },
  "h5/medium":   { fontFamily: FONT_FAMILY.medium,   fontSize: 16, lineHeight: 22 },
  "h5/semibold": { fontFamily: FONT_FAMILY.semibold, fontSize: 16, lineHeight: 22 },
  "h5/bold":     { fontFamily: FONT_FAMILY.bold,     fontSize: 16, lineHeight: 22 },

  // H6 — 14px
  "h6/regular":  { fontFamily: FONT_FAMILY.regular,  fontSize: 14, lineHeight: 20 },
  "h6/medium":   { fontFamily: FONT_FAMILY.medium,   fontSize: 14, lineHeight: 20 },
  "h6/semibold": { fontFamily: FONT_FAMILY.semibold, fontSize: 14, lineHeight: 18 },
  "h6/bold":     { fontFamily: FONT_FAMILY.bold,     fontSize: 14, lineHeight: 18 },

  // Label — 12px
  "label/regular":  { fontFamily: FONT_FAMILY.regular,  fontSize: 12, lineHeight: 12 },
  "label/medium":   { fontFamily: FONT_FAMILY.medium,   fontSize: 12, lineHeight: 16 },
  "label/semibold": { fontFamily: FONT_FAMILY.semibold, fontSize: 12, lineHeight: 14 },
  "label/bold":     { fontFamily: FONT_FAMILY.bold,     fontSize: 12, lineHeight: 14 },
};

// ── 시맨틱 alias (기존 코드 호환 + 의미 기반 사용) ───────────
export const typography: {
  title: TextStyle;
  subtitle: TextStyle;
  body: TextStyle;
  caption: TextStyle;
  emphasis: TextStyle;
  strongbutton: TextStyle;
  smallbutton: TextStyle;
  navigation: TextStyle;
} = {
  // 화면 타이틀, 네비게이션 헤더 → H1/semibold
  title: {
    fontFamily: FONT_FAMILY.semibold,
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 34,
    color: colors.textPrimary,
  },
  // 섹션 제목, 카드 헤더 → H4/semibold
  subtitle: {
    fontFamily: FONT_FAMILY.semibold,
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 26,
    color: colors.textPrimary,
  },
  // 본문, 설명 텍스트 → H6/regular
  body: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    color: colors.textSecondary,
  },
  // 메타정보, 날짜, 부가설명 → Label/medium
  caption: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 16,
    color: colors.textTertiary,
  },
  // 강조 본문, 리스트 아이템 제목 → H6/semibold
  emphasis: {
    fontFamily: FONT_FAMILY.semibold,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
    color: colors.textPrimary,
  },
  // 주요 버튼 텍스트 → H5/semibold
  strongbutton: {
    fontFamily: FONT_FAMILY.semibold,
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
    color: colors.textWhite,
  },
  // 작은 버튼 텍스트 → Label/medium
  smallbutton: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 16,
    color: colors.textWhite,
  },
  // 탭바, 네비 레이블 → Label/bold
  navigation: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 14,
    color: colors.textPrimary,
  },
};
