import React from "react";
import { View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import Text from "@/components/ui/Text";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius } from "@/styles";

// MOCK 배너 — 실제 프로모션 API 연동 전 임시 데이터
export default function SpecialBanner() {
  return (
    <TouchableOpacity
      style={styles.banner}
      onPress={() => Alert.alert("준비 중입니다")}
      activeOpacity={0.7}
    >
      <View style={styles.left}>
        <View style={styles.mockRow}>
          <Text style={styles.mockBadge}>MOCK</Text>
        </View>
        <Text style={styles.title}>일본에서 여행 특가</Text>
        <Text style={styles.subtitle}>타비 친구 전체에 특가 받아 가기</Text>
      </View>
      <View style={styles.right}>
        <View style={styles.iconWrap}>
          <Ionicons name="gift-outline" size={36} color={colors.success} />
        </View>
        <Ionicons name="arrow-forward" size={20} color={colors.success} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.md,
    backgroundColor: "#D6F5E8",
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    flex: 1,
    gap: 4,
  },
  mockRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  mockBadge: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.neutral500,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A5C42",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    color: colors.successText,
    fontWeight: "500",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});
