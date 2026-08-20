import React, { useState, memo, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Platform,
  RefreshControl,
  Image,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing, radius, shadows } from "@/styles";
import { Place } from "./hooks/usePlaces";
import { AnimeTitle } from "./hooks/useAnimeTitles";
import { useFavorites, FavoritePlace } from "@/contexts/FavoritesContext";
import { SearchStackParamList } from "@/navigation/SearchStackNavigator";
import BadgeRow from "./components/BadgeRow";
import Skeleton from "@/components/ui/Skeleton";

type Nav = NativeStackNavigationProp<SearchStackParamList>;
type IconName = keyof typeof Ionicons.glyphMap;

export type Mode = {
  key: string;
  label: string;
};

export type Category = {
  key: string;
  label: string;
  icon: IconName;
};

type Props = {
  modes: Mode[];
  mode: string;
  onSelectMode: (key: string) => void;
  categories: Category[];
  category: string;
  onSelectCategory: (key: string) => void;
  searchInput: string;
  onChangeSearchInput: (text: string) => void;
  onSubmitSearch: () => void;
  onClearSearch: () => void;
  places: Place[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  refreshing: boolean;
  onRefresh: () => void;
  onPressPlace: (placeId: number | string, source?: "youtuber") => void;
  animeTitles: AnimeTitle[];
  animeLoading: boolean;
  onPressAnimeTitle: (titleId: number, titleName: string) => void;
};

export default function SearchHomeView({
  modes,
  mode,
  onSelectMode,
  categories,
  category,
  onSelectCategory,
  searchInput,
  onChangeSearchInput,
  onSubmitSearch,
  onClearSearch,
  places,
  loading,
  loadingMore,
  hasMore,
  onLoadMore,
  refreshing,
  onRefresh,
  onPressPlace,
  animeTitles,
  animeLoading,
  onPressAnimeTitle,
}: Props) {
  const insets = useSafeAreaInsets();
  const isFavoritesMode = mode === "favorites";
  const isAnimeMode = mode === "anime";
  const isExploreMode = mode === "explore";

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* 콘텐츠 우선형 헤더 — 얇게, 카테고리는 아이콘 카드로 콘텐츠 쪽에 가깝게 */}
      <View style={styles.header}>
        <View style={styles.modeRow}>
          {modes.map((m) => {
            const isActive = mode === m.key;
            return (
              <TouchableOpacity key={m.key} onPress={() => onSelectMode(m.key)} activeOpacity={0.75}>
                <Text style={[styles.modeText, isActive && styles.modeTextActive]}>{m.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={17} color={colors.neutral500} />
            <TextInput
              style={styles.searchInput}
              placeholder="도쿄가 궁금하신가요?"
              placeholderTextColor={colors.neutral500}
              value={searchInput}
              onChangeText={onChangeSearchInput}
              onSubmitEditing={onSubmitSearch}
              returnKeyType="search"
            />
            {searchInput.length > 0 && (
              <TouchableOpacity onPress={onClearSearch} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close-circle" size={17} color={colors.neutral300} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 카테고리 아이콘 카드 (탐색 모드에서만) */}
        {isExploreMode && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
            {categories.map((cat) => {
              const isActive = category === cat.key;
              return (
                <TouchableOpacity
                  key={cat.key}
                  style={[styles.catCard, isActive && styles.catCardActive]}
                  onPress={() => onSelectCategory(cat.key)}
                  activeOpacity={0.85}
                >
                  <View style={[styles.catIconWrap, isActive && styles.catIconWrapActive]}>
                    <Ionicons name={cat.icon} size={16} color={isActive ? colors.primary : colors.neutral500} />
                  </View>
                  <Text style={[styles.catLabel, isActive && styles.catLabelActive]}>{cat.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>

      {/* 즐겨찾기 / 애니성지 / 일반 장소 패널 */}
      {isFavoritesMode ? (
        <FavoritesPanel onPressPlace={onPressPlace} />
      ) : isAnimeMode ? (
        <AnimePilgrimagePanel titles={animeTitles} loading={animeLoading} onPressTitle={onPressAnimeTitle} />
      ) : (
        <FlatList
          style={styles.resultsList}
          data={places}
          keyExtractor={keyExtractor}
          renderItem={useCallback(
            ({ item }: { item: Place }) => <PlaceCard item={item} onPressPlace={onPressPlace} />,
            [onPressPlace]
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={loading ? <PlaceListSkeleton /> : <EmptyState />}
          ListFooterComponent={loadingMore ? <LoadingFooter /> : null}
          onEndReached={hasMore ? onLoadMore : undefined}
          onEndReachedThreshold={0.5}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />
          }
          // 장소가 최대 13만+건이라 스크롤 렌더링 부하를 줄이기 위한 설정
          removeClippedSubviews
          maxToRenderPerBatch={10}
          windowSize={7}
          initialNumToRender={8}
        />
      )}
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

// 지도용 심플 스타일 — POI/도로망 최소화
const MINIMAL_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#f0eeeb" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#7c7c7c" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f0eeeb" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#e0ddd8" }] },
  { featureType: "road.arterial", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "road.local", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#b8d4e8" }] },
  { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#dde8d0" }] },
];

// 즐겨찾기 패널 (리스트/지도 토글)
function FavoritesPanel({
  onPressPlace,
}: {
  onPressPlace: (placeId: number | string, source?: "youtuber") => void;
}) {
  const { favorites } = useFavorites();
  const [view, setView] = useState<"list" | "map">("list");
  const [selectedFav, setSelectedFav] = useState<FavoritePlace | null>(null);

  const mappable = favorites.filter((f) => f.latitude !== null && f.longitude !== null);

  // 전체 중심 좌표
  const centerRegion = mappable.length > 0
    ? {
        latitude: mappable.reduce((s, f) => s + f.latitude!, 0) / mappable.length,
        longitude: mappable.reduce((s, f) => s + f.longitude!, 0) / mappable.length,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      }
    : { latitude: 35.6812, longitude: 139.7671, latitudeDelta: 0.12, longitudeDelta: 0.12 };

  return (
    <View style={{ flex: 1 }}>
      {/* 리스트/지도 토글 */}
      <View style={styles.favHeader}>
        <Text style={styles.favCount}>
          {favorites.length > 0 ? `저장된 장소 ${favorites.length}곳` : "저장된 장소 없음"}
        </Text>
        <View style={styles.toggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, view === "list" && styles.toggleBtnActive]}
            onPress={() => setView("list")}
          >
            <Ionicons name="list" size={18} color={view === "list" ? colors.primary : colors.neutral500} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, view === "map" && styles.toggleBtnActive]}
            onPress={() => setView("map")}
          >
            <Ionicons name="map" size={18} color={view === "map" ? colors.primary : colors.neutral500} />
          </TouchableOpacity>
        </View>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="star-outline" size={48} color={colors.neutral300} />
          <Text style={styles.emptyText}>즐겨찾기한 장소가 없어요</Text>
          <Text style={styles.emptySubText}>장소 상세에서 별을 눌러 저장해보세요</Text>
        </View>
      ) : view === "list" ? (
        <FlatList
          style={styles.resultsList}
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <PlaceCard
              item={{
                id: item.id,
                name: item.name,
                address: item.address,
                category: item.category,
                thumbnail_url: item.thumbnail_url,
                latitude: item.latitude,
                longitude: item.longitude,
              }}
              onPressPlace={onPressPlace}
            />
          )}
        />
      ) : (
        <View style={{ flex: 1 }}>
          <MapView
            style={{ flex: 1 }}
            customMapStyle={MINIMAL_MAP_STYLE}
            initialRegion={centerRegion}
            onPress={() => setSelectedFav(null)}
          >
            {mappable.map((place) => (
              <Marker
                key={place.id}
                coordinate={{ latitude: place.latitude!, longitude: place.longitude! }}
                onPress={() => setSelectedFav(place)}
              >
                <View style={styles.dot} />
              </Marker>
            ))}
          </MapView>

          {/* 선택된 장소 카드 */}
          {selectedFav && (
            <View style={styles.mapCard}>
              {selectedFav.thumbnail_url ? (
                <Image source={{ uri: selectedFav.thumbnail_url }} style={styles.mapCardImg} resizeMode="cover" />
              ) : (
                <View style={[styles.mapCardImg, styles.mapCardImgPlaceholder]}>
                  <Ionicons name="image-outline" size={22} color={colors.neutral300} />
                </View>
              )}
              <TouchableOpacity style={styles.mapCardInfo} onPress={() => onPressPlace(selectedFav.id)} activeOpacity={0.8}>
                <Text style={styles.mapCardName} numberOfLines={1}>{selectedFav.name}</Text>
                <Text style={styles.mapCardAddr} numberOfLines={1}>{selectedFav.address}</Text>
                <Text style={styles.mapCardLink}>상세보기 →</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSelectedFav(null)} style={styles.mapCardClose}>
                <Ionicons name="close" size={16} color={colors.neutral500} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

// 애니성지 패널 — 장소가 아니라 "작품" 단위로 묶어서 보여줌
function AnimePilgrimagePanel({
  titles,
  loading,
  onPressTitle,
}: {
  titles: AnimeTitle[];
  loading: boolean;
  onPressTitle: (titleId: number, titleName: string) => void;
}) {
  if (loading && titles.length === 0) {
    return (
      <View style={styles.animeGrid}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <View key={i} style={styles.animeCard}>
            <Skeleton width="100%" height={140} radius={12} />
            <Skeleton width="70%" height={14} style={{ marginTop: 8 }} />
          </View>
        ))}
      </View>
    );
  }

  if (titles.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="film-outline" size={40} color={colors.neutral300} />
        <Text style={styles.emptyText}>등록된 애니 성지가 없어요</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={titles}
      numColumns={2}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.animeGrid}
      columnWrapperStyle={{ gap: 12 }}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.animeCard}
          onPress={() => onPressTitle(item.id, item.title)}
          activeOpacity={0.85}
        >
          {item.cover_image_url ? (
            <Image source={{ uri: item.cover_image_url }} style={styles.animeCover} resizeMode="cover" />
          ) : (
            <View style={[styles.animeCover, styles.animeCoverPlaceholder]}>
              <Ionicons name="film-outline" size={28} color={colors.neutral300} />
            </View>
          )}
          <Text style={styles.animeTitleText} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.animeSpotCount}>성지 {item.spot_count}곳</Text>
        </TouchableOpacity>
      )}
    />
  );
}

// 콘텐츠 우선형 리스트 카드 — 별점 노출, 카테고리는 썸네일 코너 배지
const PlaceCard = memo(function PlaceCard({
  item,
  onPressPlace,
}: {
  item: Place;
  onPressPlace: (placeId: number | string, source?: "youtuber") => void;
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const canFavorite = typeof item.id === "number";
  const favorited = canFavorite && isFavorite(item.id as number);

  const handleToggleFavorite = () => {
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

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPressPlace(item.id, item.source)}
      activeOpacity={0.85}
    >
      <View style={styles.cardThumbWrap}>
        {item.thumbnail_url ? (
          <Image source={{ uri: item.thumbnail_url }} style={styles.cardThumb} resizeMode="cover" />
        ) : (
          <View style={[styles.cardThumb, styles.thumbPlaceholder]}>
            <Ionicons name="image-outline" size={20} color={colors.neutral300} />
          </View>
        )}
        {!!item.category && <View style={styles.cardBadge} />}
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
        {item.name_ko ? (
          <Text style={styles.cardNameKo} numberOfLines={1}>{item.name_ko}</Text>
        ) : null}
        <View style={styles.cardMetaRow}>
          {item.avg_rating != null && (
            <View style={styles.cardRating}>
              <Ionicons name="star" size={11} color="#F4B400" />
              <Text style={styles.cardRatingText}>{item.avg_rating.toFixed(1)}</Text>
            </View>
          )}
          <Text style={styles.cardAddr} numberOfLines={1}>{item.category ?? ""}</Text>
        </View>
        <BadgeRow badges={item.badges} />
      </View>
      {canFavorite && (
        <TouchableOpacity onPress={handleToggleFavorite} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} style={styles.cardFavBtn}>
          <Ionicons
            name={favorited ? "star" : "star-outline"}
            size={18}
            color={favorited ? colors.warning : colors.neutral300}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
});

function PlaceListItemSkeleton() {
  return (
    <View style={styles.card}>
      <Skeleton width={88} height={88} radius={14} />
      <View style={styles.cardBody}>
        <Skeleton width="65%" height={15} />
        <Skeleton width="35%" height={12} style={{ marginTop: 6 }} />
      </View>
    </View>
  );
}

function PlaceListSkeleton() {
  return (
    <View style={{ gap: 12, paddingHorizontal: spacing.md }}>
      {[1, 2, 3, 4].map((i) => (
        <PlaceListItemSkeleton key={i} />
      ))}
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    backgroundColor: "#fff",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },

  // Tier 1 — 모드
  modeRow: { flexDirection: "row", gap: 18, paddingHorizontal: spacing.md, paddingTop: 10, paddingBottom: 6 },
  modeText: { fontSize: 12.5, color: colors.textTertiary, fontWeight: "600" },
  modeTextActive: { color: colors.primary, fontWeight: "800" },

  // 검색 — 슬림한 한 줄
  searchRow: { paddingHorizontal: spacing.md, marginBottom: 10 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 9 : 5,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 13.5, color: colors.textPrimary, padding: 0 },

  // Tier 2 — 카테고리 아이콘 카드
  catRow: { paddingHorizontal: spacing.md, gap: 8 },
  catCard: {
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    minWidth: 58,
  },
  catCardActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  catIconWrap: {
    width: 22, height: 22, borderRadius: 6,
    justifyContent: "center", alignItems: "center",
  },
  catIconWrapActive: {},
  catLabel: { fontSize: 10.5, fontWeight: "700", color: colors.textTertiary },
  catLabelActive: { color: colors.primary },

  // 일반 장소 리스트
  resultsList: { flex: 1 },
  listContent: { paddingHorizontal: spacing.md, paddingTop: 12, paddingBottom: 24, gap: 12 },
  loadingFooter: { paddingVertical: 20 },

  // 애니성지 작품 그리드
  animeGrid: { padding: spacing.md, gap: 12 },
  animeCard: { flex: 1, marginBottom: 4 },
  animeCover: { width: "100%", height: 140, borderRadius: 12, backgroundColor: "#eee" },
  animeCoverPlaceholder: { justifyContent: "center", alignItems: "center" },
  animeTitleText: { fontSize: 13, fontWeight: "700", color: colors.textPrimary, marginTop: 8 },
  animeSpotCount: { fontSize: 11, color: colors.textTertiary, marginTop: 2 },

  // 콘텐츠 카드
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: radius.lg,
    padding: 8,
    gap: 12,
    alignItems: "center",
    ...shadows.sm,
  },
  cardThumbWrap: { position: "relative" },
  cardThumb: { width: 80, height: 80, borderRadius: radius.md, backgroundColor: "#eee" },
  thumbPlaceholder: { justifyContent: "center", alignItems: "center" },
  cardBadge: {
    position: "absolute", top: 6, left: 6,
    width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary,
  },
  cardBody: { flex: 1, gap: 3 },
  cardName: { fontSize: 14.5, fontWeight: "700", color: colors.textPrimary },
  cardNameKo: { fontSize: 11.5, color: colors.textSecondary },
  cardMetaRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 1 },
  cardRating: { flexDirection: "row", alignItems: "center", gap: 2 },
  cardRatingText: { fontSize: 11.5, fontWeight: "700", color: colors.textPrimary },
  cardAddr: { fontSize: 11.5, color: colors.neutral500 },
  cardFavBtn: { alignSelf: "flex-start", padding: 4 },

  // 즐겨찾기 패널
  favHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },
  favCount: { fontSize: 13, color: colors.textSecondary, fontWeight: "500" },
  toggle: { flexDirection: "row", gap: 4 },
  toggleBtn: { padding: 6, borderRadius: 8 },
  toggleBtnActive: { backgroundColor: colors.primarySoft },

  // 공통 empty
  empty: { flex: 1, justifyContent: "center", alignItems: "center", gap: 10, marginTop: 80 },
  emptyText: { fontSize: 15, fontWeight: "600", color: colors.textSecondary },
  emptySubText: { fontSize: 13, color: colors.neutral500 },


  // 지도 점 마커
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.primary,
    borderWidth: 2.5,
    borderColor: "#fff",
  },

  // 지도 선택 카드
  mapCard: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  mapCardImg: { width: 64, height: 64, borderRadius: 10 },
  mapCardImgPlaceholder: { backgroundColor: colors.neutral100, justifyContent: "center", alignItems: "center" },
  mapCardInfo: { flex: 1, gap: 3 },
  mapCardName: { fontSize: 14, fontWeight: "700", color: colors.textPrimary },
  mapCardAddr: { fontSize: 12, color: colors.textSecondary },
  mapCardLink: { fontSize: 12, color: colors.primary, fontWeight: "600", marginTop: 2 },
  mapCardClose: { padding: 4 },
});
