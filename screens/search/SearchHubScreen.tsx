import React, { useEffect, useRef, useState } from "react";
import { View, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";
import Text from "@/components/ui/Text";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import TabHeader from "@/components/Header/TabHeader";
import { colors, spacing, radius, shadows } from "@/styles";
import { tones, CATEGORY_TONE } from "@/styles/tones";
import { useScreenVariant } from "@/contexts/DesignContext";
import { SearchStackParamList } from "@/navigation/SearchStackNavigator";
import { useFavorites } from "@/contexts/FavoritesContext";

type Nav = NativeStackNavigationProp<SearchStackParamList, "SearchHomeScreen">;
type RouteProps = RouteProp<SearchStackParamList, "SearchHomeScreen">;
type IconName = keyof typeof Ionicons.glyphMap;

type Tile = { key: string; label: string; icon: IconName; kind: "category" | "anime" | "conbini"; hint: string };

const TILES: Tile[][] = [
  [
    { key: "attraction", label: "관광지", icon: "location-outline", kind: "category", hint: "명소·전망대·신사" },
    { key: "restaurant", label: "맛집", icon: "restaurant-outline", kind: "category", hint: "라멘·스시·이자카야" },
    { key: "cafe", label: "카페", icon: "cafe-outline", kind: "category", hint: "디저트·킷사텐" },
  ],
  [
    { key: "shopping", label: "쇼핑", icon: "bag-handle-outline", kind: "category", hint: "드럭스토어·백화점" },
    { key: "anime", label: "애니성지", icon: "film-outline", kind: "anime", hint: "작품 속 그 장소" },
    { key: "conbini", label: "편의점", icon: "storefront-outline", kind: "conbini", hint: "편의점 꿀템" },
  ],
];

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

// [시안 B·C] 채운 아이콘("-outline" 뺀 이름) — 연한 컬러 배경 위에선 선 아이콘이 가늘어 보여서
const filled = (icon: IconName) => icon.replace("-outline", "") as IconName;
const toneOf = (key?: string | null) => tones[CATEGORY_TONE[key ?? ""] ?? "blue"];
const ICON_BY_CATEGORY: Record<string, IconName> = Object.fromEntries(TILES.flat().map((t) => [t.key, filled(t.icon)]));

// 허브 화면 — 검색탭 진입 시 첫 화면. 목록은 없고 "뭘 찾을지 고르는" 타일뿐.
// 모드(탐색/즐겨찾기/애니성지)와 카테고리를 한 헤더에 동시에 욱여넣던 2단 구조를
// 없애고, 순서대로 보여주는 방식(허브 → 카테고리 전용 화면)으로 대체.
export default function SearchHubScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProps>();
  const forwardedQuery = useRef(false);
  const { favorites } = useFavorites();
  const favoritesPreview = favorites.slice(0, 8);
  // [시안 B·C] 썸네일 주소가 있어도 깨진 경우(더미 데이터)가 많아, 로딩 실패한 것도 색 자리표시로
  const [brokenThumbs, setBrokenThumbs] = useState<Record<number, true>>({});
  // 시안: 0=현재(회색 아이콘), 1=컬러 아이콘(타비톡 보드와 같은 톤), 2=컬러 카드 2열(설명 한 줄)
  const variant = useScreenVariant("search.hub", ["현재", "컬러 아이콘", "컬러 카드 2열"]);

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
              <Ionicons name="star-outline" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("CategoryScreen", { categoryKey: "", categoryLabel: "검색 결과", autoFocusSearch: true })
              }
              hitSlop={HIT_SLOP}
            >
              <Ionicons name="search" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </>
        }
      />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.lead}>무엇을 찾고 있나요?</Text>

        {variant === 2 ? (
          <View style={styles.cardGrid}>
            {TILES.flat().map((tile) => {
              const t = toneOf(tile.key);
              return (
                <TouchableOpacity
                  key={tile.key}
                  style={[styles.colorCard, { backgroundColor: t.bg }]}
                  activeOpacity={0.7}
                  onPress={() => handlePressTile(tile)}
                >
                  <Ionicons name={filled(tile.icon)} size={28} color={t.fg} />
                  <View>
                    <Text style={styles.colorCardLabel}>{tile.label}</Text>
                    <Text style={styles.colorCardHint} numberOfLines={1}>{tile.hint}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
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
                  {variant === 1 ? (
                    <View style={[styles.iconWrap, { backgroundColor: toneOf(tile.key).bg }]}>
                      <Ionicons name={filled(tile.icon)} size={24} color={toneOf(tile.key).fg} />
                    </View>
                  ) : (
                    <View style={styles.iconWrap}>
                      <Ionicons name={tile.icon} size={24} color={colors.textPrimary} />
                    </View>
                  )}
                  <Text style={styles.tileLabel}>{tile.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
        )}

        {favoritesPreview.length > 0 && (
          <View style={styles.favSection}>
            {/* 섹션 링크 규칙(디자인 시스템 v1): 작은 "전체보기" 글자 대신 제목 줄 전체가 터치 영역 */}
            <TouchableOpacity
              style={styles.favHeader}
              onPress={() => navigation.navigate("FavoritesScreen")}
              activeOpacity={0.7}
            >
              <Text style={styles.favTitle}>즐겨찾기</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.neutral500} />
            </TouchableOpacity>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.favRow}>
              {favoritesPreview.map((place) => (
                <TouchableOpacity
                  key={place.id}
                  style={styles.favCard}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate("DetailScreen", { placeId: place.id })}
                >
                  {place.thumbnail_url && !(variant > 0 && brokenThumbs[place.id]) ? (
                    <Image
                      source={{ uri: place.thumbnail_url }}
                      style={styles.favThumb}
                      resizeMode="cover"
                      onError={variant > 0 ? () => setBrokenThumbs((p) => ({ ...p, [place.id]: true })) : undefined}
                    />
                  ) : variant > 0 ? (
                    // [시안 B·C] 사진 없는 즐겨찾기 — 회색 상자 대신 카테고리 색 + 아이콘
                    <View style={[styles.favThumb, styles.favThumbPlaceholder, { backgroundColor: toneOf(place.category).bg }]}>
                      <Ionicons name={ICON_BY_CATEGORY[place.category ?? ""] ?? "location"} size={24} color={toneOf(place.category).fg} />
                    </View>
                  ) : (
                    <View style={[styles.favThumb, styles.favThumbPlaceholder]}>
                      <Ionicons name="image-outline" size={20} color={colors.neutral300} />
                    </View>
                  )}
                  <Text style={styles.favName} numberOfLines={1}>{place.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  body: { paddingHorizontal: spacing.lg, paddingTop: spacing.xxl, paddingBottom: spacing.xxl },
  lead: { fontSize: 18, lineHeight: 26, fontWeight: "700", letterSpacing: -0.18, color: colors.textPrimary, marginBottom: spacing.lg }, // type.section

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
  tileLabel: { fontSize: 12, fontWeight: "700", color: colors.textPrimary },

  // [시안 C] 컬러 카드 2열 — 그림자 없이 연한 색 면으로 구분, 아이콘 위·글자 아래 왼쪽 정렬
  cardGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  colorCard: {
    width: "48%",
    flexGrow: 1,
    height: 112,
    borderRadius: radius.lg,
    borderCurve: "continuous",
    padding: spacing.lg,
    justifyContent: "space-between",
  },
  colorCardLabel: { fontSize: 16, lineHeight: 24, fontWeight: "700", color: colors.textPrimary },
  colorCardHint: { fontSize: 12, lineHeight: 16, fontWeight: "500", color: colors.textSecondary },

  // 즐겨찾기 미리보기 — 허브가 타일만 있어 밍밍했던 것도 겸사겸사 보완
  favSection: { marginTop: spacing.xxl },
  favHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.md },
  favTitle: { fontSize: 18, lineHeight: 26, fontWeight: "700", letterSpacing: -0.18, color: colors.textPrimary }, // type.section
  favRow: { gap: 12 },
  favCard: { width: 84 },
  favThumb: { width: 84, height: 84, borderRadius: radius.md, backgroundColor: colors.neutral100 },
  favThumbPlaceholder: { justifyContent: "center", alignItems: "center" },
  favName: { fontSize: 12, fontWeight: "600", color: colors.textPrimary, marginTop: 8 },
});
