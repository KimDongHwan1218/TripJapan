import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { typography, spacing, colors } from "@/styles";

export default function SettingRow({
  label,
  onPress,
  danger,
}: {
  label: string;
  onPress?: () => void;
  danger?: boolean;
}) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          typography.body,
          danger && { color: colors.danger },
        ]}
      >
        {label}
      </Text>

      <Text style={styles.chevron}>{">"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 48,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  chevron: {
    color: colors.textSecondary,
    fontSize: 16,
  },
});