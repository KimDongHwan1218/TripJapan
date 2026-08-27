import React, { useCallback, useState } from "react";
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
  Modal,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, shadows } from "@/styles";
import { SearchStackParamList } from "@/navigation/SearchStackNavigator";
import { usePlaces, Place } from "./hooks/usePlaces";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useTrip } from "@/contexts/TripContext";
import { CITY_META, TripCity } from "@/constants/cities";
import BadgeRow from "./components/BadgeRow";
import Skeleton from "@/components/ui/Skeleton";

type Nav = NativeStackNavigationProp<SearchStackParamList, "CategoryScreen">;
type RouteProps = RouteProp<SearchStackParamList, "CategoryScreen">;

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };
const CITY_LIST = Object.values(CITY_META);

type Layout = "row" | "verticalCard" | "shopGrid";

// 카테고리마다 보여줄 정보가 다르니 리스트 형태 자체를 다르게 가져감 —
// 관광지/전체검색은 기본 행, 맛집·카페는 세로형 포토카드(카페 전용 그리드가
// 부자연스러워 보인다는 피드백으로 맛집과 통일), 쇼핑은 카드형 그리드.
function getLayout(categoryKey: string): Layout {
  if (categoryKey === "restaurant" || categoryKey === "cafe") return "verticalCard";
  if (categoryKey === "shopping") return "shopGrid";
  return "row";
}

export default function CategoryScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProps>();
  const insets = useSafeAreaInsets();
  const { activeTrip } = useTrip();
  const { categoryKey, categoryLabel, initialQuery, autoFocusSearch } = route.params;

  const layout = getLayout(categoryKey);

  const [searchExpanded, setSearchExpanded] = useState(!!autoFocusSearch || !!initialQuery);
  const [searchInput, setSearchInput] = useState(initialQuery ?? "");
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery ?? "");
  const [refreshing, setRefreshing] = useState(false);
  // 여행지가 설정돼 있으면 그 도시로 기본 스코프, 없으면 전체
  const [region, setRegion] = useState<TripCity | "">(activeTrip?.city ?? "");
  const [regionPickerOpen, setRegionPickerOpen] = useState(false);

  const { places, loading, loadingMore, hasMore, loadMore, refresh } = usePlaces(categoryKey, submittedQuery, region);

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
      if (layout === "verticalCard") return <VerticalCardItem item={item} onPressPlace={handlePressPlace} />;
      if (layout === "shopGrid") return <ShopGridItem item={item} onPressPlace={handlePressPlace} />;
      return <RowItem item={item} onPressPlace={handlePressPlace} />;
    },
    [layout, handlePressPlace]
  );

  const numColumns = layout === "shopGrid" ? 2 : 1;
  const listKey = layout; // numColumns가 레이아웃마다 달라 FlatList를 구분해서 마운트
  const regionLabel = region ? CITY_META[region].label.ko : "지역 전체";

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top, height: 52 + insets.top }]}>
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
            <TouchableOpacity onPress={() => setRegionPickerOpen(true)} style={styles.regionChip} activeOpacity={0.7}>
              <Ionicons name="location-outline" size={13} color={region ? colors.primary : colors.textTertiary} />
              <Text style={[styles.regionChipText, region && styles.regionChipTextActive]} numberOfLines={1}>
                {regionLabel}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSearchExpanded(true)} style={styles.headerActionBtn} hitSlop={HIT_SLOP}>
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
        numColumns={numColumns}
        columnWrapperStyle={numColumns === 2 ? styles.gridRow : undefined}
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

      <RegionPickerModal
        visible={regionPickerOpen}
        selected={region}
        onSelect={(key) => {
          setRegion(key);
          setRegionPickerOpen(false);
        }}
        onClose={() => setRegionPickerOpen(false)}
      />
    </View>
  );
}

function RegionPickerModal({
  visible,
  selected,
  onSelect,
  onClose,
}: {
  visible: boolean;
  selected: TripCity | "";
  onSelect: (region: TripCity | "") => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.sheetBackdrop} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={styles.sheet} onPress={() => {}}>
          <Text style={styles.sheetTitle}>지역 선택</Text>
          <ScrollView contentContainerStyle={styles.sheetList}>
            <TouchableOpacity style={styles.sheetItem} onPress={() => onSelect("")}>
              <Text style={[styles.sheetItemText, !selected && styles.sheetItemTextActive]}>지역 전체</Text>
              {!selected && <Ionicons name="checkmark" size={18} color={colors.primary} />}
            </TouchableOpacity>
            {CITY_LIST.map((city) => (
              <TouchableOpacity key={city.key} style={styles.sheetItem} onPress={() => onSelect(city.key)}>
                <Text style={[styles.sheetItemText, selected === city.key && styles.sheetItemTextActive]}>
                  {city.label.ko}
                </Text>
                {selected === city.key && <Ionicons name="checkmark" size={18} color={colors.primary} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
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

function useFavoriteAction(item: Place) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const canFavorite = typeof item.id === "number";
  const favorited = canFavorite && isFavorite(item.id as number);
  const toggle = () => {
    if (!canFavorite) return;
    toggleFavorite({
      id: item.id as number,
      name: item.name,
      address: item.address,
      thumbnail_url: item.thumbnail_url,
      latitude: item.latitude ?? null,
      longitude: item.longitude ?? null,
      category: item.category,
    });
  };
  return { canFavorite, favorited, toggle };
}

function FavoriteButton({ item }: { item: Place }) {
  const { canFavorite, favorited, toggle } = useFavoriteAction(item);
  if (!canFavorite) return null;
  return (
    <TouchableOpacity onPress={toggle} hitSlop={HIT_SLOP}>
      <Ionicons name={favorited ? "star" : "star-outline"} size={20} color={favorited ? colors.warning : colors.neutral300} />
    </TouchableOpacity>
  );
}

// 기본 행 — 관광지 / 전체검색
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

// 세로형 포토카드 — 맛집. 사진이 위, 정보가 아래. 관광지(가로 행)와 실루엣부터 다르게 함
const VerticalCardItem = React.memo(function VerticalCardItem({
  item,
  onPressPlace,
}: {
  item: Place;
  onPressPlace: (placeId: number | string, source?: "youtuber") => void;
}) {
  const { canFavorite, favorited, toggle } = useFavoriteAction(item);
  return (
    <TouchableOpacity style={styles.vCard} onPress={() => onPressPlace(item.id, item.source)} activeOpacity={0.9}>
      {item.thumbnail_url ? (
        <Image source={{ uri: item.thumbnail_url }} style={styles.vCardThumb} resizeMode="cover" />
      ) : (
        <View style={[styles.vCardThumb, styles.thumbPlaceholder]}>
          <Ionicons name="image-outline" size={26} color={colors.neutral300} />
        </View>
      )}
      {item.avg_rating != null && (
        <View style={styles.vCardRatingBadge}>
          <Ionicons name="star" size={12} color={colors.warning} />
          <Text style={styles.ratingText}>{item.avg_rating.toFixed(1)}</Text>
        </View>
      )}
      {canFavorite && (
        <TouchableOpacity style={styles.vCardFavBtn} hitSlop={HIT_SLOP} onPress={toggle}>
          <Ionicons name={favorited ? "star" : "star-outline"} size={17} color={favorited ? colors.warning : "#fff"} />
        </TouchableOpacity>
      )}
      <View style={styles.vCardBody}>
        <Text style={styles.rowName} numberOfLines={1}>{item.name}</Text>
        {item.name_ko ? <Text style={styles.rowNameKo} numberOfLines={1}>{item.name_ko}</Text> : null}
        <Text style={styles.rowAddr} numberOfLines={1}>{item.address}</Text>
        <BadgeRow badges={item.badges} />
      </View>
    </TouchableOpacity>
  );
});

// 카드형 그리드 — 쇼핑. 사진을 카드 안에 넣고, 이름/주소를 카드 아래 텍스트
// 영역으로 분리(사진 위 오버레이 캡션이 아님)
const ShopGridItem = React.memo(function ShopGridItem({
  item,
  onPressPlace,
}: {
  item: Place;
  onPressPlace: (placeId: number | string, source?: "youtuber") => void;
}) {
  const { canFavorite, favorited, toggle } = useFavoriteAction(item);
  return (
    <TouchableOpacity style={styles.shopCard} onPress={() => onPressPlace(item.id, item.source)} activeOpacity={0.85}>
      <View>
        {item.thumbnail_url ? (
          <Image source={{ uri: item.thumbnail_url }} style={styles.shopThumb} resizeMode="cover" />
        ) : (
          <View style={[styles.shopThumb, styles.thumbPlaceholder]}>
            <Ionicons name="image-outline" size={20} color={colors.neutral300} />
          </View>
        )}
        {canFavorite && (
          <TouchableOpacity style={styles.shopFavBtn} hitSlop={HIT_SLOP} onPress={toggle}>
            <Ionicons name={favorited ? "star" : "star-outline"} size={15} color={favorited ? colors.warning : colors.neutral500} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.shopBody}>
        <Text style={styles.rowName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.rowAddr} numberOfLines={1}>{item.address}</Text>
      </View>
    </TouchableOpacity>
  );
});

function ListSkeleton({ layout }: { layout: Layout }) {
  if (layout === "shopGrid") {
    return (
      <View style={styles.gridRow}>
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={{ flex: 1, marginBottom: 12 }}>
            <Skeleton width="100%" height={140} radius={radius.md} />
          </View>
        ))}
      </View>
    );
  }
  if (layout === "verticalCard") {
    return (
      <View>
        {[1, 2, 3].map((i) => (
          <View key={i} style={{ marginBottom: 16 }}>
            <Skeleton width="100%" height={160} radius={radius.md} />
            <Skeleton width="55%" height={14} style={{ marginTop: 8 }} />
          </View>
        ))}
      </View>
    );
  }
  return (
    <View>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <View key={i} style={styles.row}>
          <Skeleton width={56} height={56} radius={radius.sm} />
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

  // 카테고리 화면 헤더 — back + 타이틀 + 지역 칩 + 검색 아이콘. 모드 탭 없음
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
  regionChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    maxWidth: 96,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: radius.full,
    backgroundColor: colors.neutral100,
  },
  regionChipText: { fontSize: 11.5, fontWeight: "700", color: colors.textTertiary },
  regionChipTextActive: { color: colors.primary },
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

  // 세로형 포토카드 (맛집)
  vCard: { marginBottom: 20 },
  vCardThumb: { width: "100%", height: 180, borderRadius: radius.lg, backgroundColor: colors.neutral100 },
  vCardBody: { paddingTop: 10, gap: 4 },
  vCardRatingBadge: {
    position: "absolute",
    left: 10,
    top: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  vCardFavBtn: { position: "absolute", right: 10, top: 10 },
  ratingText: { fontSize: 12, fontWeight: "800", color: colors.textPrimary },

  gridRow: { gap: 10 },

  // 카드형 그리드 (쇼핑) — 흰 카드 프레임 + 사진/텍스트 영역 분리
  shopCard: {
    flex: 1,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    marginBottom: 12,
    overflow: "hidden",
    ...shadows.sm,
  },
  shopThumb: { width: "100%", aspectRatio: 1, backgroundColor: colors.neutral100 },
  shopFavBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  shopBody: { padding: 10, gap: 4 },

  empty: { flex: 1, justifyContent: "center", alignItems: "center", gap: 10, marginTop: 80 },
  emptyText: { fontSize: 15, fontWeight: "600", color: colors.textSecondary },

  // 지역 선택 바텀시트
  sheetBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    maxHeight: "70%",
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  sheetTitle: { fontSize: 15, fontWeight: "800", color: colors.textPrimary, paddingHorizontal: spacing.lg, marginBottom: 8 },
  sheetList: { paddingHorizontal: spacing.lg },
  sheetItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  sheetItemText: { fontSize: 14.5, color: colors.textPrimary, fontWeight: "500" },
  sheetItemTextActive: { color: colors.primary, fontWeight: "700" },
});
