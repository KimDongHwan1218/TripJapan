import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import Text from "@/components/ui/Text";
import { typography, spacing, colors, radius } from "@/styles";
import { tones, ToneKey } from "@/styles/tones";

export default function SettingRow({
  label,
  onPress,
  danger,
  icon,
  tone,
  showChevron = true,
}: {
  label: string;
  onPress?: () => void;
  danger?: boolean;
  // [설정 시안 B] 왼쪽 컬러 아이콘 — 없으면 기존처럼 글자만
  icon?: keyof typeof Ionicons.glyphMap;
  tone?: ToneKey;
  showChevron?: boolean;
}) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.left}>
        {icon && (
          <View style={[styles.iconBox, { backgroundColor: tone ? tones[tone].bg : colors.neutral100 }]}>
            <Ionicons name={icon} size={18} color={tone ? tones[tone].fg : colors.neutral700} />
          </View>
        )}
        <Text
          style={[
            typography.body,
            danger && { color: colors.danger },
          ]}
        >
          {label}
        </Text>
      </View>

      {showChevron && <Ionicons name="chevron-forward" size={20} color={colors.neutral500} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  left: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  iconBox: { width: 32, height: 32, borderRadius: radius.sm, borderCurve: "continuous", alignItems: "center", justifyContent: "center" },

  chevron: {
    color: colors.textSecondary,
    fontSize: 16,
  },
});