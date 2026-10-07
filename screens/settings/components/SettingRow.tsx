import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, StyleSheet } from "react-native";
import Text from "@/components/ui/Text";
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

      <Ionicons name="chevron-forward" size={20} color={colors.neutral500} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 48,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  chevron: {
    color: colors.textSecondary,
    fontSize: 16,
  },
});