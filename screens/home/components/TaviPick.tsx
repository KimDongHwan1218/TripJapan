import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius } from "@/styles";
import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { MainTabParamList } from "@/navigation/MainTabNavigator";
import { usePlaces, type Place } from "@/screens/search/hooks/usePlaces";

type TabNav = BottomTabNavigationProp<MainTabParamList>;

// screenLabel: "모두보기"로 들어가는 검색탭 CategoryScreen 제목(검색 허브 타일 이름과 동일하게)
const CATEGORIES: { key: string; label: string; apiKey: string; screenLabel: string }[] = [
  { key: "all",        label: "전체",  apiKey: "",           screenLabel: "" },
  { key: "attraction", label: "관광",  apiKey: "attraction", screenLabel: "관광지" },
  { key: "restaurant", label: "맛집",  apiKey: "restaurant", screenLabel: "맛집" },
  { key: "cafe",       label: "카페",  apiKey: "cafe",       screenLabel: "카페" },
  { key: "shopping",   label: "쇼핑",  apiKey: "shopping",   screenLabel: "쇼핑" },
];

const CATEGORY_LABEL_MAP: Record<string, string> = {
  attraction: "관광",
  restaurant: "맛집",
  cafe: "카페",
  shopping: "쇼핑",
};

export default function TaviPick() {
  const navigation = useNavigation<TabNav>();
  const [activeCat, setActiveCat] = useState(CATEGORIES[0]);
  const { places, loading } = usePlaces(activeCat.apiKey, "");

  // initial: false — 검색탭 스택에 허브를 깔아둬서, 나중에 검색탭을 눌렀을 때 이 상세가 루트로 남지 않게 함
  const handlePressPlace = (place: Place) => {
    navigation.navigate("검색", {
      screen: "DetailScreen",
      params: { placeId: place.id, source: place.source },
      initial: false,
    } as any);
  };

  // "관광 모두보기"인데 검색 허브로만 가던 것 — 고른 카테고리 화면으로 바로 이동("전체"만 허브)
  const handlePressMore = () => {
    if (!activeCat.apiKey) {
      navigation.navigate("검색", { screen: "SearchHomeScreen", params: { query: "" } } as any);
      return;
    }
    navigation.navigate("검색", {
      screen: "CategoryScreen",
      params: { categoryKey: activeCat.apiKey, categoryLabel: activeCat.screenLabel },
      initial: false,
    } as any);
  };

  return (
    <View style={styles.container}>
      {/* 섹션 헤더 */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>타비 PICK!</Text>
      </View>

      {/* 카테고리 탭 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabs}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[styles.tab, activeCat.key === cat.key && styles.tabActive]}
            onPress={() => setActiveCat(cat)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeCat.key === cat.key && styles.tabTextActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 장소 리스트 */}
      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : places.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>등록된 장소가 없습니다</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {places.slice(0, 5).map((place) => (
            <TouchableOpacity
              key={place.id}
              style={styles.row}
              onPress={() => handlePressPlace(place)}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: place.thumbnail_url }}
                style={styles.thumbnail}
                resizeMode="cover"
              />
              <View style={styles.info}>
                <Text style={styles.categoryLabel}>
                  {CATEGORY_LABEL_MAP[place.category ?? ""] ?? place.category ?? ""}
                </Text>
                <Text style={styles.name} numberOfLines={1}>{place.name}</Text>
                <Text style={styles.address} numberOfLines={1}>{place.address}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.neutral300} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* 모두보기 */}
      <TouchableOpacity
        style={styles.moreBtn}
        onPress={handlePressMore}
        activeOpacity={0.7}
      >
        <Text style={styles.moreBtnText}>
          {activeCat.label === "전체" ? "전체" : activeCat.label} 모두보기
        </Text>
        <Ionicons name="chevron-forward" size={14} color={colors.textTertiary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.sm,
  },
  sectionHeader: {
    paddingHorizontal: spacing.md,
    paddingTop: 28,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },

  tabs: {
    paddingHorizontal: spacing.md,
    gap: 8,
    paddingBottom: 12,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    backgroundColor: colors.surface,
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.textWhite,
  },

  loadingBox: {
    paddingVertical: 32,
    alignItems: "center",
  },
  emptyBox: {
    paddingVertical: 24,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 13,
    color: colors.textTertiary,
  },

  list: {
    paddingHorizontal: spacing.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 12,
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: colors.neutral200,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  categoryLabel: {
    fontSize: 11,
    color: colors.textTertiary,
    fontWeight: "600",
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  address: {
    fontSize: 12,
    color: colors.textTertiary,
  },

  moreBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 4,
  },
  moreBtnText: {
    fontSize: 13,
    color: colors.textTertiary,
    fontWeight: "600",
  },
});
