import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { spacing, typography, colors } from "@/styles";

export default function AppInfoSection() {
  return (
    <View style={styles.container}>
      <Text style={styles.thankYou}>
        타비료코를 이용해주셔서 감사합니다
      </Text>

      <Text style={styles.copyright}>
        © 2026 tabi
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.lg,
    alignItems: "center",
  },
  thankYou: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  copyright: {
    ...typography.caption,
  },
});
