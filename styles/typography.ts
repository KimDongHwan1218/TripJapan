import { TextStyle } from "react-native";
import { colors } from "./colors";
import { spacing } from "./spacing";

export const typography: {
  title: TextStyle;
  subtitle: TextStyle;
  body: TextStyle;
  caption: TextStyle;
  emphasis: TextStyle;
  strongbutton: TextStyle;
  smallbutton: TextStyle;
} = {
  title: {
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 28,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "400",
    lineHeight: 22,
    color: colors.textPrimary,
  },
  body: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    color: colors.textSecondary,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
    color: colors.textSecondary,
  },
  emphasis: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
    color: colors.textPrimary,
  },
  strongbutton: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textWhite,
  },
  smallbutton: {
    fontSize: 12,
    fontWeight: "400",
    color: colors.textWhite,
  }
};
