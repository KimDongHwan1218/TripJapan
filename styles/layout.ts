import { spacing } from "./spacing";
import { colors } from "./colors";

export const layout = {
  screen: {
    flex: 1,

  },

  content: {
    // flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
  },

  strongbutton:{
    width: "100%",
    backgroundColor: colors.strongbutton,
    paddingVertical: spacing.md,
    borderRadius: 5,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.md,
  },
  smallbutton:{
    backgroundColor: colors.strongbutton,
    paddingVertical: spacing.xs,
    borderRadius: 3,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xs,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },
} as const;
