import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius } from "@/styles";
import { SearchStackParamList } from "@/navigation/SearchStackNavigator";
import { useFavorites, FavoritePlace } from "@/contexts/FavoritesContext";

type Nav = NativeStackNavigationProp<SearchStackParamList, "FavoritesScreen">;

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

export default function FavoritesScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { favorites } = useFavorites();
  const [view, setView] = useState<"list" | "map">("list");
  const [selectedFav, setSelectedFav] = useState<FavoritePlace | null>(null);

  const mappable = favorites.filter((f) => f.latitude !== null && f.longitude !== null);

  const centerRegion = mappable.length > 0
    ? {
        latitude: mappable.reduce((s, f) => s + f.latitude!, 0) / mappable.length,
        longitude: mappable.reduce((s, f) => s + f.longitude!, 0) / mappable.length,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      }
    : { latitude: 35.6812, longitude: 139.7671, latitudeDelta: 0.12, longitudeDelta: 0.12 };

  const handlePressPlace = (placeId: number | string, source?: "youtuber") => {
    navigation.navigate("DetailScreen", { placeId, source });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top, height: 52 + insets.top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>즐겨찾기</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.subHeader}>
        <Text style={styles.favCount}>
          {favorites.length > 0 ? `저장된 장소 ${favorites.length}곳` : "저장된 장소 없음"}
        </Text>
        <View style={styles.toggle}>
          <TouchableOpacity style={[styles.toggleBtn, view === "list" && styles.toggleBtnActive]} onPress={() => setView("list")}>
            <Ionicons name="list" size={18} color={view === "list" ? colors.primary : colors.neutral500} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.toggleBtn, view === "map" && styles.toggleBtnActive]} onPress={() => setView("map")}>
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
          renderItem={({ item }) => <FavoriteRow item={item} onPressPlace={handlePressPlace} />}
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
                anchor={{ x: 0.5, y: 0.5 }}
                onPress={() => setSelectedFav(place)}
              >
                <View style={styles.dot} />
              </Marker>
            ))}
          </MapView>

          {selectedFav && (
            <View style={styles.mapCard}>
              {selectedFav.thumbnail_url ? (
                <Image source={{ uri: selectedFav.thumbnail_url }} style={styles.mapCardImg} resizeMode="cover" />
              ) : (
                <View style={[styles.mapCardImg, styles.mapCardImgPlaceholder]}>
                  <Ionicons name="image-outline" size={22} color={colors.neutral300} />
                </View>
              )}
              <TouchableOpacity style={styles.mapCardInfo} onPress={() => handlePressPlace(selectedFav.id)} activeOpacity={0.8}>
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

function FavoriteRow({
  item,
  onPressPlace,
}: {
  item: FavoritePlace;
  onPressPlace: (placeId: number | string, source?: "youtuber") => void;
}) {
  return (
    <TouchableOpacity style={styles.row} onPress={() => onPressPlace(item.id)} activeOpacity={0.8}>
      {item.thumbnail_url ? (
        <Image source={{ uri: item.thumbnail_url }} style={styles.rowThumb} resizeMode="cover" />
      ) : (
        <View style={[styles.rowThumb, styles.thumbPlaceholder]}>
          <Ionicons name="image-outline" size={18} color={colors.neutral300} />
        </View>
      )}
      <View style={styles.rowInfo}>
        <Text style={styles.rowName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.rowAddr} numberOfLines={1}>{item.address}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    height: 52,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  backBtn: { padding: 2 },
  title: { fontSize: 16, fontWeight: "800", color: colors.textPrimary },

  subHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },
  favCount: { fontSize: 13, color: colors.textSecondary, fontWeight: "500" },
  toggle: { flexDirection: "row", gap: 4 },
  toggleBtn: { padding: 6, borderRadius: radius.sm },
  toggleBtnActive: { backgroundColor: colors.primarySoft },

  resultsList: { flex: 1 },
  listContent: { paddingTop: spacing.md, paddingBottom: 24, paddingHorizontal: spacing.md },

  row: { flexDirection: "row", alignItems: "center", paddingVertical: 10, gap: 14 },
  rowThumb: { width: 56, height: 56, borderRadius: radius.sm, backgroundColor: colors.neutral100 },
  thumbPlaceholder: { justifyContent: "center", alignItems: "center" },
  rowInfo: { flex: 1, gap: 4 },
  rowName: { fontSize: 15, fontWeight: "600", color: colors.textPrimary },
  rowAddr: { fontSize: 12, color: colors.textTertiary },

  empty: { flex: 1, justifyContent: "center", alignItems: "center", gap: 10, marginTop: 80 },
  emptyText: { fontSize: 15, fontWeight: "600", color: colors.textSecondary },
  emptySubText: { fontSize: 13, color: colors.neutral500 },

  dot: { width: 14, height: 14, borderRadius: 7, backgroundColor: colors.primary, borderWidth: 2.5, borderColor: "#fff" },

  mapCard: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: radius.lg,
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
  mapCardImg: { width: 64, height: 64, borderRadius: radius.sm },
  mapCardImgPlaceholder: { backgroundColor: colors.neutral100, justifyContent: "center", alignItems: "center" },
  mapCardInfo: { flex: 1, gap: 3 },
  mapCardName: { fontSize: 14, fontWeight: "700", color: colors.textPrimary },
  mapCardAddr: { fontSize: 12, color: colors.textSecondary },
  mapCardLink: { fontSize: 12, color: colors.primary, fontWeight: "600", marginTop: 2 },
  mapCardClose: { padding: 4 },
});
