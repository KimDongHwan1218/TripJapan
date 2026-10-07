import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Text from "@/components/ui/Text";
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
          <Ionicons name="chevron-forward-outline" size={16} color={colors.textTertiary} />
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
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  moreBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  moreText: {
    fontSize: 12,
    color: colors.textTertiary,
  },
});
