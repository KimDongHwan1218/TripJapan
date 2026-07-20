import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MapView, { Marker } from "react-native-maps";

const MINIMAL_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#f0eeeb" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#7c7c7c" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f0eeeb" }] },
  // POI(음식점/관광지 등)는 구글맵 기본 동작대로 노출 — 줌 레벨에 따라 주요 장소부터 자동으로 보임.
  // 다만 위의 전역 labels.icon 규칙이 아이콘을 꺼버리므로 POI만 다시 켜줌.
  { featureType: "poi", elementType: "labels.icon", stylers: [{ visibility: "on" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#e0ddd8" }] },
  { featureType: "road.arterial", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "road.local", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#b8d4e8" }] },
  { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#dde8d0" }] },
];
import { colors, spacing, radius } from "@/styles";
import type { Schedule, TripDay } from "@/contexts/TripContext";
import type { Place } from "./hooks/usePlaceSearch";
import SortableScheduleList from "./components/SortableScheduleList";

type DaySchedule = {
  day: TripDay;
  schedules: Schedule[];
};

type Props = {
  schedulesByDay: DaySchedule[];
  currentDayIndex: number;

  // 검색
  query: string;
  onChangeQuery: (text: string) => void;
  onSearch: () => void;
  searchResults: Place[];
  selectedPlace: Place | null;
  onSelectPlace: (place: Place) => void;
  onClearSearch: () => void;
  onAddPlace: () => void;
  addingPlace: boolean;

  // 지도
  mapRef: React.RefObject<MapView | null>;
  mapRegion: { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number } | null;
  onMapLongPress: (coordinate: { latitude: number; longitude: number }) => void;

  // 일정 조작
  onReorder: (newOrder: Schedule[]) => void;
  onDelete: (scheduleId: number) => void;

  onDone: () => void;
};

export default function TripEditScreenView({
  schedulesByDay,
  currentDayIndex,
  query,
  onChangeQuery,
  onSearch,
  searchResults,
  selectedPlace,
  onSelectPlace,
  onClearSearch,
  onAddPlace,
  addingPlace,
  mapRef,
  mapRegion,
  onMapLongPress,
  onReorder,
  onDelete,
  onDone,
}: Props) {
  const insets = useSafeAreaInsets();
  const currentDay = schedulesByDay[currentDayIndex];
  const currentSchedules = currentDay?.schedules ?? [];

  // 지도에 표시할 마커: 현재 일정 + 검색 결과
  const scheduleMarkers = currentSchedules.filter(
    (s) => s.latitude !== null && s.longitude !== null
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* 상단 검색 바 */}
      <View style={styles.searchBar}>
        <TouchableOpacity onPress={onDone} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.searchInputWrap}>
          <TextInput
            style={styles.searchInput}
            placeholder="관광지를 검색하세요"
            placeholderTextColor={colors.textTertiary}
            value={query}
            onChangeText={onChangeQuery}
            onSubmitEditing={onSearch}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>

        <TouchableOpacity style={styles.searchIcon} onPress={onSearch} activeOpacity={0.7}>
          <Ionicons name="search" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* 검색 결과 드롭다운 */}
      {searchResults.length > 0 && (
        <View style={styles.searchDropdown}>
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={searchResults}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.searchResultItem}
                onPress={() => onSelectPlace(item)}
                activeOpacity={0.7}
              >
                {item.thumbnail_url ? (
                  <Image source={{ uri: item.thumbnail_url }} style={styles.resultThumb} />
                ) : (
                  <View style={[styles.resultThumb, styles.resultThumbPlaceholder]}>
                    <Ionicons name="location" size={18} color={colors.neutral300} />
                  </View>
                )}
                <View style={styles.resultInfo}>
                  <Text style={styles.resultName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.resultAddress} numberOfLines={1}>{item.address}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* 지도 */}
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            region={mapRegion ?? undefined}
            customMapStyle={MINIMAL_MAP_STYLE}
            showsUserLocation
            onLongPress={(e) => onMapLongPress(e.nativeEvent.coordinate)}
          >
            {/* 일정 번호 점 마커 */}
            {scheduleMarkers.map((s, i) => (
              <Marker
                key={s.id}
                coordinate={{ latitude: s.latitude!, longitude: s.longitude! }}
                title={s.activity}
              >
                <View style={styles.numDot}>
                  <Text style={styles.numDotText}>{i + 1}</Text>
                </View>
              </Marker>
            ))}

            {/* 검색 선택 장소 — 작은 원형 마커 */}
            {selectedPlace && (
              <Marker
                coordinate={{ latitude: selectedPlace.latitude, longitude: selectedPlace.longitude }}
              >
                <View style={styles.searchDot} />
              </Marker>
            )}
          </MapView>
        </View>

        {/* 선택된 장소 추가 배너 */}
        {selectedPlace && (
          <View style={styles.selectedPlaceBanner}>
            <View style={styles.selectedPlaceInfo}>
              <Ionicons name="location" size={16} color={colors.primary} />
              <Text style={styles.selectedPlaceName} numberOfLines={1}>
                {selectedPlace.name}
              </Text>
            </View>
            <View style={styles.selectedPlaceActions}>
              <TouchableOpacity onPress={onClearSearch} style={styles.cancelBtn} activeOpacity={0.7}>
                <Text style={styles.cancelBtnText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onAddPlace}
                disabled={addingPlace}
                style={styles.addPlaceBtn}
                activeOpacity={0.8}
              >
                {addingPlace ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.addPlaceBtnText}>일정 추가</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* 날짜 헤더 */}
        {currentDay && (
          <View style={styles.dateSectionHeader}>
            <Text style={styles.dateSectionTitle}>
              Day {currentDayIndex + 1} | {formatDate(currentDay.day.date)}
            </Text>
          </View>
        )}

        {/* 정렬 가능한 일정 목록 */}
        <View style={styles.listArea}>
          <SortableScheduleList
            schedules={currentSchedules}
            onReorder={onReorder}
            onDelete={onDelete}
          />
        </View>

        {/* 편집 완료 */}
        <TouchableOpacity style={styles.doneRow} onPress={onDone} activeOpacity={0.7}>
          <Text style={styles.doneText}>편집 완료</Text>
        </TouchableOpacity>

        <View style={{ height: insets.bottom + 16 }} />
      </ScrollView>
    </View>
  );
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("ko-KR", {
      month: "numeric",
      day: "numeric",
      weekday: "short",
    });
  } catch {
    return dateStr;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },

  // 검색 바
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: spacing.sm,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    gap: 8,
  },
  backBtn: {
    padding: 4,
  },
  searchInputWrap: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    fontSize: 14,
    color: colors.textPrimary,
    padding: 0,
    margin: 0,
  },
  searchIcon: {
    padding: 4,
  },

  // 검색 드롭다운
  searchDropdown: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    zIndex: 999,
    elevation: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    maxHeight: 220,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
    gap: 12,
  },
  resultThumb: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: "#eee",
  },
  resultThumbPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  resultInfo: { flex: 1 },
  resultName: { fontSize: 14, fontWeight: "600", color: colors.textPrimary },
  resultAddress: { fontSize: 12, color: colors.textTertiary, marginTop: 2 },

  // 지도
  mapContainer: {
    height: 280,
    backgroundColor: "#e8e8e8",
  },
  map: { flex: 1 },

  // 선택된 장소 배너
  selectedPlaceBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    gap: 8,
  },
  selectedPlaceInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  selectedPlaceName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  selectedPlaceActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  cancelBtnText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  addPlaceBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    minWidth: 72,
    alignItems: "center",
  },
  addPlaceBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
  },

  // 이동수단 토글
  // 날짜 헤더
  dateSectionHeader: {
    backgroundColor: "#fff",
    paddingHorizontal: spacing.md,
    paddingTop: 16,
    paddingBottom: 8,
  },
  dateSectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
  },

  // 일정 목록
  listArea: {
    paddingHorizontal: spacing.md,
    paddingTop: 8,
    backgroundColor: "#FAFAFA",
  },

  // 지도 마커
  numDot: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: colors.primary,
    borderWidth: 2, borderColor: "#fff",
    justifyContent: "center", alignItems: "center",
  },
  numDotText: { fontSize: 11, fontWeight: "800", color: "#fff" },
  searchDot: {
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: "#FF6B6B",
    borderWidth: 2, borderColor: "#fff",
  },

  // 편집 완료
  doneRow: {
    alignItems: "center",
    paddingVertical: 20,
  },
  doneText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textTertiary,
  },
});
