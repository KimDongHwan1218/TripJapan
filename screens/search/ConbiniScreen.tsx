import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius } from "@/styles";
import { SearchStackParamList } from "@/navigation/SearchStackNavigator";
import Skeleton from "@/components/ui/Skeleton";

type Nav = NativeStackNavigationProp<SearchStackParamList, "ConbiniScreen">;

// 편의점 탭 — "장소"가 아니라 "상품"(빵/샌드위치 등 콜라보·기간한정 상품) 카탈로그로
// 기획된 화면. 아직 상품 데이터(취급 편의점/콜라보 여부/이미지 큐레이션)가 없어서
// 실제 카드 대신 의도한 레이아웃만 스켈레톤으로 보여줌 — 준비 중임을 명시.
export default function ConbiniScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top, height: 52 + insets.top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>편의점</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.notice}>
        <Ionicons name="construct-outline" size={16} color={colors.textTertiary} />
        <Text style={styles.noticeText}>편의점 인기 상품을 준비하고 있어요. 조금만 기다려주세요!</Text>
      </View>

      <ScrollView contentContainerStyle={styles.grid}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <View key={i} style={styles.card}>
            <View style={styles.thumbWrap}>
              <Skeleton width="100%" height="100%" radius={0} />
              <View style={styles.collabTag} />
              <View style={styles.chainTag} />
            </View>
            <View style={styles.cardBody}>
              <Skeleton width="80%" height={11} />
              <Skeleton width="45%" height={9} style={{ marginTop: 6 }} />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  backBtn: { padding: 2 },
  title: { fontSize: 16, fontWeight: "800", color: colors.textPrimary },

  notice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },
  noticeText: { fontSize: 12.5, color: colors.textTertiary, flex: 1 },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  card: {
    width: "47%",
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: colors.neutral050,
  },
  thumbWrap: { width: "100%", aspectRatio: 1, position: "relative" },
  collabTag: {
    position: "absolute",
    top: 6,
    left: -3,
    width: 40,
    height: 14,
    borderRadius: 2,
    backgroundColor: colors.neutral300,
    transform: [{ rotate: "-4deg" }],
  },
  chainTag: {
    position: "absolute",
    bottom: 6,
    right: 6,
    width: 46,
    height: 14,
    borderRadius: radius.xs,
    backgroundColor: colors.neutral300,
  },
  cardBody: { padding: 8 },
});
