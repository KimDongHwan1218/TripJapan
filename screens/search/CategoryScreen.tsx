import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius } from "@/styles";
import { SearchStackParamList } from "@/navigation/SearchStackNavigator";
import { usePlaces, Place } from "./hooks/usePlaces";
import { useFavorites } from "@/contexts/FavoritesContext";
import BadgeRow from "./components/BadgeRow";
import Skeleton from "@/components/ui/Skeleton";

type Nav = NativeStackNavigationProp<SearchStackParamList, "CategoryScreen">;
type RouteProps = RouteProp<SearchStackParamList, "CategoryScreen">;

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

type Layout = "row" | "ratingCard" | "grid";

// 카테고리마다 보여줄 정보가 다르니 리스트 형태 자체를 다르게 가져감 —
// 관광지/쇼핑/전체검색은 기본 행, 맛집은 별점 카드, 카페는 사진 그리드.
function getLayout(categoryKey: string): Layout {
  if (categoryKey === "restaurant") return "ratingCard";
  if (categoryKey === "cafe") return "grid";
  return "row";
}

export default function CategoryScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProps>();
  const { categoryKey, categoryLabel, initialQuery, autoFocusSearch } = route.params;

  const layout = getLayout(categoryKey);

  const [searchExpanded, setSearchExpanded] = useState(!!autoFocusSearch || !!initialQuery);
  const [searchInput, setSearchInput] = useState(initialQuery ?? "");
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery ?? "");
  const [refreshing, setRefreshing] = useState(false);

  const { places, loading, loadingMore, hasMore, loadMore, refresh } = usePlaces(categoryKey, submittedQuery);

  const handleSubmitSearch = () => setSubmittedQuery(searchInput.trim());
  const handleChangeSearchInput = (text: string) => {
    setSearchInput(text);
    if (text.length === 0) setSubmittedQuery("");
  };
  const closeSearch = () => {
    setSearchExpanded(false);
    setSearchInput("");
    setSubmittedQuery("");
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const handlePressPlace = useCallback(
    (placeId: number | string, source?: "youtuber") => {
      navigation.navigate("DetailScreen", { placeId, source });
    },
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }: { item: Place }) => {
      if (layout === "ratingCard") return <RatingCardItem item={item} onPressPlace={handlePressPlace} />;
      if (layout === "grid") return <GridItem item={item} onPressPlace={handlePressPlace} />;
      return <RowItem item={item} onPressPlace={handlePressPlace} />;
    },
    [layout, handlePressPlace]
  );

  const listKey = layout; // numColumns가 레이아웃마다 달라 FlatList를 구분해서 마운트

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={HIT_SLOP}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>

        {searchExpanded ? (
          <>
            <View style={styles.inlineSearch}>
              <TextInput
                autoFocus
                style={styles.inlineSearchInput}
                placeholder={`${categoryLabel}에서 검색`}
                placeholderTextColor={colors.neutral500}
                value={searchInput}
                onChangeText={handleChangeSearchInput}
                onSubmitEditing={handleSubmitSearch}
                returnKeyType="search"
              />
            </View>
            <TouchableOpacity onPress={closeSearch} style={styles.headerActionBtn} hitSlop={HIT_SLOP}>
              <Ionicons name="close" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.title} numberOfLines={1}>{categoryLabel}</Text>
            <TouchableOpacity
              onPress={() => setSearchExpanded(true)}
              style={styles.headerActionBtn}
              hitSlop={HIT_SLOP}
            >
              <Ionicons name="search" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          </>
        )}
      </View>

      <FlatList
        key={listKey}
        style={styles.resultsList}
        data={places}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        numColumns={layout === "grid" ? 2 : 1}
        columnWrapperStyle={layout === "grid" ? styles.gridRow : undefined}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={loading ? <ListSkeleton layout={layout} /> : <EmptyState />}
        ListFooterComponent={loadingMore ? <LoadingFooter /> : null}
        onEndReached={hasMore ? loadMore : undefined}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} colors={[colors.primary]} />
        }
        removeClippedSubviews
        maxToRenderPerBatch={12}
        windowSize={7}
        initialNumToRender={12}
      />
    </View>
  );
}

const keyExtractor = (item: Place) => item.id.toString();

function LoadingFooter() {
  return (
    <View style={styles.loadingFooter}>
      <ActivityIndicator color={colors.primary} />
    </View>
  );
}

function EmptyState() {
  return (
    <View style={styles.empty}>
      <Ionicons name="search-outline" size={40} color={colors.neutral300} />
      <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
    </View>
  );
}

function FavoriteButton({ item }: { item: Place }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const canFavorite = typeof item.id === "number";
  const favorited = canFavorite && isFavorite(item.id as number);

  if (!canFavorite) return null;

  return (
    <TouchableOpacity
      onPress={() =>
        toggleFavorite({
          id: item.id as number,
          name: item.name,
          address: item.address,
          thumbnail_url: item.thumbnail_url,
          latitude: item.latitude ?? null,
          longitude: item.longitude ?? null,
          category: item.category,
        })
      }
      hitSlop={HIT_SLOP}
    >
      <Ionicons name={favorited ? "star" : "star-outline"} size={20} color={favorited ? colors.warning : colors.neutral300} />
    </TouchableOpacity>
  );
}

// 기본 행 — 관광지 / 쇼핑 / 전체검색
const RowItem = React.memo(function RowItem({
  item,
  onPressPlace,
}: {
  item: Place;
  onPressPlace: (placeId: number | string, source?: "youtuber") => void;
}) {
  return (
    <TouchableOpacity style={styles.row} onPress={() => onPressPlace(item.id, item.source)} activeOpacity={0.8}>
      {item.thumbnail_url ? (
        <Image source={{ uri: item.thumbnail_url }} style={styles.rowThumb} resizeMode="cover" />
      ) : (
        <View style={[styles.rowThumb, styles.thumbPlaceholder]}>
          <Ionicons name="image-outline" size={18} color={colors.neutral300} />
        </View>
      )}
      <View style={styles.rowInfo}>
        <Text style={styles.rowName} numberOfLines={1}>{item.name}</Text>
        {item.name_ko ? <Text style={styles.rowNameKo} numberOfLines={1}>{item.name_ko}</Text> : null}
        <Text style={styles.rowAddr} numberOfLines={1}>{item.address}</Text>
        <BadgeRow badges={item.badges} />
      </View>
      <FavoriteButton item={item} />
    </TouchableOpacity>
  );
});

// 별점 카드 — 맛집. "믿을 만한 곳"을 빨리 비교하는 게 목적이라 별점을 상시 노출
const RatingCardItem = React.memo(function RatingCardItem({
  item,
  onPressPlace,
}: {
  item: Place;
  onPressPlace: (placeId: number | string, source?: "youtuber") => void;
}) {
  return (
    <TouchableOpacity style={styles.ratingCard} onPress={() => onPressPlace(item.id, item.source)} activeOpacity={0.85}>
      {item.thumbnail_url ? (
        <Image source={{ uri: item.thumbnail_url }} style={styles.ratingCardThumb} resizeMode="cover" />
      ) : (
        <View style={[styles.ratingCardThumb, styles.thumbPlaceholder]}>
          <Ionicons name="image-outline" size={20} color={colors.neutral300} />
        </View>
      )}
      <View style={styles.ratingCardBody}>
        <Text style={styles.rowName} numberOfLines={1}>{item.name}</Text>
        {item.name_ko ? <Text style={styles.rowNameKo} numberOfLines={1}>{item.name_ko}</Text> : null}
        <View style={styles.ratingRow}>
          {item.avg_rating != null && (
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={12} color={colors.warning} />
              <Text style={styles.ratingText}>{item.avg_rating.toFixed(1)}</Text>
            </View>
          )}
          <Text style={styles.rowAddr} numberOfLines={1}>{item.address}</Text>
        </View>
        <BadgeRow badges={item.badges} />
      </View>
      <FavoriteButton item={item} />
    </TouchableOpacity>
  );
});

// 사진 그리드 — 카페. 텍스트보다 무드 사진으로 먼저 훑어보는 게 자연스러움
const GridItem = React.memo(function GridItem({
  item,
  onPressPlace,
}: {
  item: Place;
  onPressPlace: (placeId: number | string, source?: "youtuber") => void;
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const canFavorite = typeof item.id === "number";
  const favorited = canFavorite && isFavorite(item.id as number);

  return (
    <TouchableOpacity style={styles.gridCard} onPress={() => onPressPlace(item.id, item.source)} activeOpacity={0.85}>
      {item.thumbnail_url ? (
        <Image source={{ uri: item.thumbnail_url }} style={styles.gridThumb} resizeMode="cover" />
      ) : (
        <View style={[styles.gridThumb, styles.thumbPlaceholder]}>
          <Ionicons name="image-outline" size={22} color={colors.neutral300} />
        </View>
      )}
      <View style={styles.gridCaption}>
        <Text style={styles.gridCaptionText} numberOfLines={1}>{item.name}</Text>
      </View>
      {canFavorite && (
        <TouchableOpacity
          style={styles.gridFavBtn}
          hitSlop={HIT_SLOP}
          onPress={() =>
            toggleFavorite({
              id: item.id as number,
              name: item.name,
              address: item.address,
              thumbnail_url: item.thumbnail_url,
              latitude: item.latitude ?? null,
              longitude: item.longitude ?? null,
              category: item.category,
            })
          }
        >
          <Ionicons name={favorited ? "star" : "star-outline"} size={16} color={favorited ? colors.warning : "#fff"} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
});

function ListSkeleton({ layout }: { layout: Layout }) {
  if (layout === "grid") {
    return (
      <View style={styles.gridRow}>
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={[styles.gridCard, { marginBottom: 12 }]}>
            <Skeleton width="100%" height={140} radius={radius.md} />
          </View>
        ))}
      </View>
    );
  }
  return (
    <View>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <View key={i} style={styles.row}>
          <Skeleton width={layout === "ratingCard" ? 80 : 56} height={layout === "ratingCard" ? 80 : 56} radius={radius.sm} />
          <View style={styles.rowInfo}>
            <Skeleton width="65%" height={15} />
            <Skeleton width="35%" height={12} style={{ marginTop: 6 }} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },

  // 카테고리 화면 헤더 — back + 타이틀 + 검색 아이콘 하나. 모드 탭 없음
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    height: 52,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  backBtn: { padding: 2 },
  title: { flex: 1, fontSize: 16, fontWeight: "800", color: colors.textPrimary },
  headerActionBtn: { padding: 2 },
  inlineSearch: {
    flex: 1,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.primary,
    paddingBottom: 4,
  },
  inlineSearchInput: { fontSize: 14, color: colors.textPrimary, padding: 0 },

  resultsList: { flex: 1 },
  listContent: { paddingBottom: 24, paddingHorizontal: spacing.md },
  loadingFooter: { paddingVertical: 20 },

  thumbPlaceholder: { justifyContent: "center", alignItems: "center" },

  // 기본 행
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 10, gap: 14 },
  rowThumb: { width: 56, height: 56, borderRadius: radius.sm, backgroundColor: colors.neutral100 },
  rowInfo: { flex: 1, gap: 4 },
  rowName: { fontSize: 15, fontWeight: "600", color: colors.textPrimary },
  rowNameKo: { fontSize: 12, color: colors.textSecondary, marginTop: -2 },
  rowAddr: { fontSize: 12, color: colors.textTertiary },

  // 별점 카드 (맛집)
  ratingCard: { flexDirection: "row", alignItems: "center", paddingVertical: 10, gap: 14 },
  ratingCardThumb: { width: 80, height: 80, borderRadius: radius.md, backgroundColor: colors.neutral100 },
  ratingCardBody: { flex: 1, gap: 4 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  ratingBadge: { flexDirection: "row", alignItems: "center", gap: 3 },
  ratingText: { fontSize: 12, fontWeight: "800", color: colors.textPrimary },

  // 사진 그리드 (카페)
  gridRow: { gap: 10 },
  gridCard: { flex: 1, borderRadius: radius.md, overflow: "hidden", position: "relative", aspectRatio: 1, marginBottom: 10 },
  gridThumb: { width: "100%", height: "100%" },
  gridCaption: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  gridCaptionText: { fontSize: 12, fontWeight: "700", color: "#fff" },
  gridFavBtn: { position: "absolute", top: 6, right: 6 },

  empty: { flex: 1, justifyContent: "center", alignItems: "center", gap: 10, marginTop: 80 },
  emptyText: { fontSize: 15, fontWeight: "600", color: colors.textSecondary },
});
