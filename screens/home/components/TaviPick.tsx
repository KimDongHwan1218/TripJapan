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
import { usePlaces } from "@/screens/search/hooks/usePlaces";

type TabNav = BottomTabNavigationProp<MainTabParamList>;

const CATEGORIES: { key: string; label: string; apiKey: string }[] = [
  { key: "all",         label: "전체",  apiKey: "" },
  { key: "event_place", label: "관광",  apiKey: "event_place" },
  { key: "restaurant",  label: "맛집",  apiKey: "restaurant" },
  { key: "cafe",        label: "카페",  apiKey: "cafe" },
  { key: "shop",        label: "쇼핑",  apiKey: "shop" },
];

const CATEGORY_LABEL_MAP: Record<string, string> = {
  event_place: "관광",
  restaurant: "맛집",
  cafe: "카페",
  shop: "쇼핑",
  goods: "굿즈",
};

interface Props {
  onPressHotel: () => void;
  onPressTour: () => void;
  onPressShopping: () => void;
}

export default function TaviPick({ onPressShopping }: Props) {
  const navigation = useNavigation<TabNav>();
  const [activeCat, setActiveCat] = useState(CATEGORIES[0]);
  const { places, loading } = usePlaces(activeCat.apiKey, "");

  const handlePressPlace = (placeId: number) => {
    navigation.navigate("검색", {
      screen: "DetailScreen",
      params: { placeId },
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
              onPress={() => handlePressPlace(place.id)}
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
        onPress={() => navigation.navigate("검색", { screen: "SearchHomeScreen", params: { query: "" } } as any)}
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
    backgroundColor: colors.surface,
    paddingBottom: spacing.sm,
  },
  sectionHeader: {
    paddingHorizontal: spacing.md,
    paddingTop: 28,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
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
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
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
