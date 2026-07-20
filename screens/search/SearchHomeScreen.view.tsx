import React, { useState } from "react";
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
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing } from "@/styles";
import { Place } from "./hooks/usePlaces";
import { useFavorites, FavoritePlace } from "@/contexts/FavoritesContext";
import { SearchStackParamList } from "@/navigation/SearchStackNavigator";
import BadgeRow from "./components/BadgeRow";
import Skeleton from "@/components/ui/Skeleton";

type Nav = NativeStackNavigationProp<SearchStackParamList>;

export type Category = {
  key: string;
  label: string;
};

type Props = {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (key: string) => void;
  query: string;
  searchInput: string;
  onChangeSearchInput: (text: string) => void;
  onSubmitSearch: () => void;
  onClearSearch: () => void;
  places: Place[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  onPressPlace: (placeId: number | string, source?: "youtuber") => void;
  categoryCounts?: Record<string, number>;
};

export default function SearchHomeView({
  categories,
  selectedCategory,
  onSelectCategory,
  query,
  searchInput,
  onChangeSearchInput,
  onSubmitSearch,
  onClearSearch,
  places,
  loading,
  refreshing,
  onRefresh,
  onPressPlace,
  categoryCounts,
}: Props) {
  const insets = useSafeAreaInsets();
  const isSearchMode = query.length > 0;
  const isFavoritesMode = selectedCategory === "favorites";

  // 검색 결과 화면
  if (isSearchMode) {
    const searchCategories = categories.filter((c) => c.key !== "favorites");
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.searchResultHeader}>
          <TouchableOpacity onPress={onClearSearch} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.searchResultTitle}>{query}</Text>
        </View>

        {categoryCounts && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {searchCategories.map((cat) => {
              const count = categoryCounts[cat.key] ?? 0;
              const isActive = selectedCategory === cat.key;
              return (
                <TouchableOpacity
                  key={cat.key}
                  style={[styles.chip, isActive && styles.chipActive]}
                  onPress={() => onSelectCategory(cat.key)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                    {cat.label}{count > 0 ? ` ${count}` : ""}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        <FlatList
          style={styles.resultsList}
          data={places}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <PlaceListItem item={item} onPress={() => onPressPlace(item.id, item.source)} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={loading ? <PlaceListSkeleton /> : <EmptyState />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* 빨간 헤더 */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="도쿄가 궁금하신가요?"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={searchInput}
            onChangeText={onChangeSearchInput}
            onSubmitEditing={onSubmitSearch}
            returnKeyType="search"
          />
          <TouchableOpacity onPress={onSubmitSearch} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="search" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* 카테고리 탭 */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabRow}>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.key;
            return (
              <TouchableOpacity
                key={cat.key}
                style={styles.tab}
                onPress={() => onSelectCategory(cat.key)}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{cat.label}</Text>
                {isActive && <View style={styles.tabUnderline} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 즐겨찾기 패널 */}
      {isFavoritesMode ? (
        <FavoritesPanel onPressPlace={onPressPlace} />
      ) : (
        <FlatList
          style={styles.resultsList}
          data={places}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <PlaceListItem item={item} onPress={() => onPressPlace(item.id, item.source)} />}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={loading ? <PlaceListSkeleton /> : <EmptyState />}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />
          }
        />
      )}
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
function FavoritesPanel({ onPressPlace }: { onPressPlace: (id: number) => void }) {
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
            <PlaceListItem
              item={{
                id: item.id,
                name: item.name,
                address: item.address,
                category: item.category,
                thumbnail_url: item.thumbnail_url,
                latitude: item.latitude,
                longitude: item.longitude,
              }}
              onPress={() => onPressPlace(item.id)}
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

function PlaceListItem({ item, onPress }: { item: Place; onPress: () => void }) {
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
    <TouchableOpacity style={styles.listItem} onPress={onPress} activeOpacity={0.8}>
      {item.thumbnail_url ? (
        <Image source={{ uri: item.thumbnail_url }} style={styles.thumbnail} resizeMode="cover" />
      ) : (
        <View style={[styles.thumbnail, styles.thumbPlaceholder]}>
          <Ionicons name="image-outline" size={18} color={colors.neutral300} />
        </View>
      )}
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.itemCategory}>{item.category ?? ""}</Text>
        <BadgeRow badges={item.badges} />
      </View>
      {canFavorite && (
        <TouchableOpacity onPress={handleToggleFavorite} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons
            name={favorited ? "star" : "star-outline"}
            size={20}
            color={favorited ? colors.warning : colors.neutral300}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

function PlaceListItemSkeleton() {
  return (
    <View style={styles.listItem}>
      <Skeleton width={56} height={56} radius={8} />
      <View style={styles.itemInfo}>
        <Skeleton width="65%" height={15} />
        <Skeleton width="35%" height={12} style={{ marginTop: 6 }} />
      </View>
    </View>
  );
}

function PlaceListSkeleton() {
  return (
    <View>
      {[1, 2, 3, 4, 5, 6].map((i) => (
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

  header: { backgroundColor: colors.primary, paddingBottom: 0 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: spacing.md,
    marginTop: 12,
    marginBottom: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 10 : 6,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14, color: "#fff", padding: 0 },

  tabRow: { paddingHorizontal: spacing.md, gap: 4 },
  tab: { paddingHorizontal: 12, paddingVertical: 10, alignItems: "center" },
  tabText: { fontSize: 14, color: "rgba(255,255,255,0.65)", fontWeight: "500" },
  tabTextActive: { color: "#fff", fontWeight: "700" },
  tabUnderline: {
    position: "absolute",
    bottom: 0,
    left: 12,
    right: 12,
    height: 2.5,
    backgroundColor: "#fff",
    borderRadius: 2,
  },

  // 일반 장소 리스트 — 구분선 없이 여백으로만 분리
  resultsList: { flex: 1 },
  listContent: { paddingBottom: 24 },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    gap: 14,
  },
  thumbnail: { width: 56, height: 56, borderRadius: 8, backgroundColor: "#eee" },
  thumbPlaceholder: { justifyContent: "center", alignItems: "center" },
  itemInfo: { flex: 1, gap: 4 },
  itemName: { fontSize: 15, fontWeight: "600", color: colors.textPrimary },
  itemCategory: { fontSize: 12, color: colors.neutral500 },

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

  // 검색 결과 화면
  searchResultHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    height: 52,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    gap: 12,
  },
  backBtn: { padding: 4 },
  searchResultTitle: { fontSize: 17, fontWeight: "700", color: colors.textPrimary },

  chipRow: { paddingHorizontal: spacing.md, paddingVertical: 12, gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#fff",
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, color: colors.textSecondary, fontWeight: "500" },
  chipTextActive: { color: "#fff", fontWeight: "700" },

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
