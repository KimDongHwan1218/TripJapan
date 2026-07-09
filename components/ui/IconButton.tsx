import { Pressable, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/styles";

type Props = {
  name: React.ComponentProps<typeof Ionicons>["name"];
  onPress?: () => void;
  size?: number;
  color?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const DEFAULT_HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

// 헤더/리스트의 아이콘 전용 터치 버튼. 눌렀을 때 배경 틴트로 일관된 피드백을 준다.
export default function IconButton({
  name,
  onPress,
  size = 24,
  color = colors.textPrimary,
  disabled = false,
  style,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={DEFAULT_HIT_SLOP}
      android_ripple={{ color: colors.neutral200, radius: size }}
      style={({ pressed }) => [
        styles.base,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Ionicons name={name} size={size} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    padding: 8,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    backgroundColor: colors.neutral100,
  },
  disabled: {
    opacity: 0.4,
  },
});
