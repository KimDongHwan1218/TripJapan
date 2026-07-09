import { Pressable, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from "react-native";
import { colors, radius, spacing } from "@/styles";
import Spinner from "./Spinner";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

const SIZE_STYLES: Record<Size, { paddingVertical: number; paddingHorizontal: number; fontSize: number }> = {
  sm: { paddingVertical: 8, paddingHorizontal: spacing.md, fontSize: 13 },
  md: { paddingVertical: 12, paddingHorizontal: spacing.lg, fontSize: 15 },
  lg: { paddingVertical: 15, paddingHorizontal: spacing.xl, fontSize: 16 },
};

const VARIANT_STYLES: Record<Variant, { bg: string; pressedBg: string; text: string; border?: string }> = {
  primary: { bg: colors.primary, pressedBg: colors.primaryHover, text: colors.textWhite },
  secondary: { bg: colors.lightbutton, pressedBg: colors.primarySoft, text: colors.primary },
  outline: { bg: "transparent", pressedBg: colors.neutral100, text: colors.textPrimary, border: colors.border },
  ghost: { bg: "transparent", pressedBg: colors.neutral100, text: colors.textPrimary },
};

// 앱 전역에서 재사용하는 기본 버튼. variant/size/loading/disabled 상태를 일관되게 표현한다.
export default function Button({
  label,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  style,
  textStyle,
}: Props) {
  const v = VARIANT_STYLES[variant];
  const s = SIZE_STYLES[size];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      android_ripple={{ color: colors.neutral200 }}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: pressed && !isDisabled ? v.pressedBg : v.bg,
          paddingVertical: s.paddingVertical,
          paddingHorizontal: s.paddingHorizontal,
          borderWidth: v.border ? 1 : 0,
          borderColor: v.border,
          opacity: isDisabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <Spinner size="small" color={v.text} />
      ) : (
        <Text style={[styles.text, { color: v.text, fontSize: s.fontSize }, textStyle]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "700",
  },
});
