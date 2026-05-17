import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "@/styles";

interface Props {
  title: string;
  onPressMore?: () => void;
}

export default function SectionHeader({ title, onPressMore }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {onPressMore && (
        <TouchableOpacity onPress={onPressMore} style={styles.moreBtn}>
          <Text style={styles.moreText}>더보기</Text>
          <Ionicons name="chevron-forward-outline" size={15} color={colors.textTertiary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  moreBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  moreText: {
    fontSize: 13,
    color: colors.textTertiary,
  },
});
