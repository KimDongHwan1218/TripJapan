import React from "react";
import { View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import Text from "@/components/ui/Text";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius } from "@/styles";

// MOCK 배너 — 실제 프로모션/이벤트 연동 전 임시 데이터 (홈 화면 SpecialBanner와 동일한 톤)
export default function BoardPromoBanner() {
  return (
    <TouchableOpacity
      style={styles.banner}
      onPress={() => Alert.alert("준비 중입니다")}
      activeOpacity={0.7}
    >
      <View style={styles.left}>
        <Text style={styles.mockBadge}>MOCK</Text>
        <Text style={styles.title}>여행 이야기 나누고 혜택 받기</Text>
        <Text style={styles.subtitle}>이달의 여행 후기 이벤트 참여해보세요</Text>
      </View>
      <View style={styles.right}>
        <View style={styles.iconWrap}>
          <Ionicons name="megaphone-outline" size={32} color={colors.info} />
        </View>
        <Ionicons name="arrow-forward" size={20} color={colors.info} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.md,
    backgroundColor: "#E8EFFD",
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
  mockBadge: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.neutral500,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E3A8A",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    color: colors.info,
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
    backgroundColor: "rgba(255,255,255,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
});
