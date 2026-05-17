import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "@/navigation/HomeStackNavigator";
import { layout, colors, spacing, radius } from "@/styles";

type Nav = NativeStackNavigationProp<HomeStackParamList>;

// Figma: 여행경보 목록 (게시판아이템 360×84)
// 실제 서버 API 없으므로 mock — 내용은 실제 경보 스타일
type AlertItem = {
  id: string;
  title: string;
  date: string;
  content: string;
};

export const TRAVEL_ALERTS: AlertItem[] = [
  {
    id: "1",
    title: "오키나와 지역 쓰나미 경보 발령",
    date: "2026. 04. 01",
    content:
      "최근 오키나와 지역에서 태풍이 발생, 쓰나미 경보가 발령되었습니다.\n\n해당 지역 여행을 계획 중이신 분들은 안전에 유의하시고, 현지 당국의 안내에 따라 주시기 바랍니다.",
  },
  {
    id: "2",
    title: "후쿠오카 지역 폭우 피해",
    date: "2026. 04. 12",
    content:
      "후쿠오카 지역에 집중 폭우로 인한 침수 피해가 발생하였습니다.\n\n해당 지역 방문 시 기상 상황을 수시로 확인하시고, 여행 일정에 차질이 없도록 주의하시기 바랍니다.",
  },
  {
    id: "3",
    title: "도쿄 지진 발생 관련 여행 주의사항",
    date: "2026. 04. 15",
    content:
      "최근 도쿄 인근에서 규모 4.5의 지진이 발생하였습니다.\n\n일본은 지진이 잦은 지역으로, 여행 중 지진 발생 시 신속히 지시에 따라 대피하시기 바랍니다.\n\n지진 대피 정보는 일본 기상청 사이트에서 확인하실 수 있습니다.",
  },
];

export default function TravelAlertDetailScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <View style={layout.screen}>
      {/* Figma: "여행 경보" 가운데 타이틀 + back */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>여행 경보</Text>
        <View style={{ width: 38 }} />
      </View>

      {/* Figma: 게시판아이템 360×84, y=20,104,188 (gap=0, 내부 padding으로 분리) */}
      <FlatList
        data={TRAVEL_ALERTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate("TravelAlertItem", { alertId: item.id })}
            activeOpacity={0.75}
          >
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDate}>{item.date}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.neutral300} />
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Figma: 헤더 - back + 가운데 타이틀
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    backgroundColor: colors.surface,
  },
  backBtn: { width: 38, alignItems: "flex-start" },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },

  listContent: {
    paddingTop: 20, // Figma: 첫 아이템 y=20
  },

  // Figma: 게시판아이템 360×84
  item: {
    height: 84,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: colors.surface,
  },
  itemContent: {
    flex: 1,
    gap: 6,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
    lineHeight: 22,
  },
  itemDate: {
    fontSize: 13,
    color: colors.textTertiary,
  },

  divider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    marginHorizontal: 20,
  },
});
