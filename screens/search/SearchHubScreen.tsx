import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import TabHeader from "@/components/Header/TabHeader";
import { colors, spacing, radius, shadows } from "@/styles";
import { SearchStackParamList } from "@/navigation/SearchStackNavigator";

type Nav = NativeStackNavigationProp<SearchStackParamList, "SearchHomeScreen">;
type RouteProps = RouteProp<SearchStackParamList, "SearchHomeScreen">;
type IconName = keyof typeof Ionicons.glyphMap;

type Tile = { key: string; label: string; icon: IconName; kind: "category" | "anime" | "conbini" };

const TILES: Tile[][] = [
  [
    { key: "attraction", label: "관광지", icon: "location-outline", kind: "category" },
    { key: "restaurant", label: "맛집", icon: "restaurant-outline", kind: "category" },
    { key: "cafe", label: "카페", icon: "cafe-outline", kind: "category" },
  ],
  [
    { key: "shopping", label: "쇼핑", icon: "bag-handle-outline", kind: "category" },
    { key: "anime", label: "애니성지", icon: "film-outline", kind: "anime" },
    { key: "conbini", label: "편의점", icon: "storefront-outline", kind: "conbini" },
  ],
];

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

// 허브 화면 — 검색탭 진입 시 첫 화면. 목록은 없고 "뭘 찾을지 고르는" 타일뿐.
// 모드(탐색/즐겨찾기/애니성지)와 카테고리를 한 헤더에 동시에 욱여넣던 2단 구조를
// 없애고, 순서대로 보여주는 방식(허브 → 카테고리 전용 화면)으로 대체.
export default function SearchHubScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProps>();
  const forwardedQuery = useRef(false);

  // 다른 탭에서 "검색어를 들고" 들어오는 경우(SearchButton 등) — 허브를 거치지 않고
  // 바로 전체 카테고리 검색 결과로 보내줌. 빈 쿼리(탭 이동용)는 그냥 허브에 머무름.
  useEffect(() => {
    const q = route.params?.query?.trim();
    if (q && !forwardedQuery.current) {
      forwardedQuery.current = true;
      navigation.navigate("CategoryScreen", { categoryKey: "", categoryLabel: "검색 결과", initialQuery: q });
    }
  }, [route.params?.query, navigation]);

  const handlePressTile = (tile: Tile) => {
    if (tile.kind === "anime") return navigation.navigate("AnimePilgrimageList");
    if (tile.kind === "conbini") return navigation.navigate("ConbiniScreen");
    navigation.navigate("CategoryScreen", { categoryKey: tile.key, categoryLabel: tile.label });
  };

  return (
    <View style={styles.container}>
      <TabHeader
        rightContent={
          <>
            <TouchableOpacity onPress={() => navigation.navigate("FavoritesScreen")} hitSlop={HIT_SLOP}>
              <Ionicons name="star-outline" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("CategoryScreen", { categoryKey: "", categoryLabel: "검색 결과", autoFocusSearch: true })
              }
              hitSlop={HIT_SLOP}
            >
              <Ionicons name="search" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
          </>
        }
      />

      <View style={styles.body}>
        <Text style={styles.lead}>무엇을 찾고 있나요?</Text>

        <View style={styles.grid}>
          {TILES.map((row, i) => (
            <View key={i} style={styles.row}>
              {row.map((tile) => (
                <TouchableOpacity
                  key={tile.key}
                  style={styles.tile}
                  activeOpacity={0.7}
                  onPress={() => handlePressTile(tile)}
                >
                  <View style={styles.iconWrap}>
                    <Ionicons name={tile.icon} size={24} color={colors.textPrimary} />
                  </View>
                  <Text style={styles.tileLabel}>{tile.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  body: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.xxl },
  lead: { fontSize: 15, fontWeight: "700", color: colors.textPrimary, marginBottom: spacing.lg },

  grid: { gap: 12 },
  row: { flexDirection: "row", gap: 12 },
  tile: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    ...shadows.sm,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.neutral100,
    alignItems: "center",
    justifyContent: "center",
  },
  tileLabel: { fontSize: 13, fontWeight: "700", color: colors.textPrimary },
});
