import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius } from "@/styles";

// MOCK 배너 — 실제 프로모션 API 연동 전 임시 데이터
export default function SpecialBanner() {
  return (
    <TouchableOpacity
      style={styles.banner}
      onPress={() => Alert.alert("준비 중입니다")}
      activeOpacity={0.88}
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
          <Ionicons name="gift-outline" size={36} color="#2A7A5A" />
        </View>
        <Ionicons name="arrow-forward" size={18} color="#2A7A5A" />
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
    fontSize: 10,
    fontWeight: "700",
    color: colors.textWhite,
    backgroundColor: colors.neutral500,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.xs,
    overflow: "hidden",
  },
  title: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1A5C42",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    color: "#2A7A5A",
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
