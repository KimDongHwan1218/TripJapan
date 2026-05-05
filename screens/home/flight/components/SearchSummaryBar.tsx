import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import SearchEditModal from "./modals/SearchEditModal";
import { colors, spacing, radius } from "@/styles";

export default function SearchSummaryBar({ params }: { params: any }) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.row} onPress={() => setOpen(true)} activeOpacity={0.8}>
        <Text style={styles.summary}>
          {params.from} → {params.to} · 성인 {params.adults}명 · 일반석
        </Text>
        <Ionicons name="pencil-outline" size={16} color={colors.textTertiary} />
      </TouchableOpacity>

      <SearchEditModal
        visible={open}
        onClose={() => setOpen(false)}
        params={params}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.neutral100,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  summary: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textPrimary,
  },
});
