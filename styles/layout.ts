import { spacing } from "./spacing";
import { colors } from "./colors";
import { radius } from "./radius";

export const layout = {
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },

  community: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  communityScroll: {
    backgroundColor: colors.surface,
  },

  communitySection: {
    paddingHorizontal: spacing.lg,
  },

  // 주요 CTA 버튼 — Figma: pill shape (r=24), height 50px, primary red
  strongbutton: {
    width: "100%",
    backgroundColor: colors.strongbutton,
    paddingVertical: spacing.lg,
    borderRadius: radius.pill,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },

  // 소형 버튼 — Figma: r=14, height 40px
  smallbutton: {
    backgroundColor: colors.strongbutton,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.md,
  },

  // 카드 — Figma: r=12, surface background, padding 16px
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },
} as const;
