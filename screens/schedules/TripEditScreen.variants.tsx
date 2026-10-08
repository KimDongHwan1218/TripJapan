import React from "react";
import { View, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import Text, { TextInput } from "@/components/ui/Text";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MapView, { Marker } from "react-native-maps";
import { colors, radius, spacing } from "@/styles";
import { getCityLabel } from "@/constants/cities";
import type { Schedule } from "@/contexts/TripContext";
import type { Place as SearchPlace } from "@/screens/search/hooks/usePlaces";
import { PlaceThumb } from "@/screens/home/components/sections/shared";
import TripEditScreenView from "./TripEditScreen.view";
import SortableScheduleList from "./components/SortableScheduleList";

// 일정 편집 시안 C·D. 상태·추가·삭제·정렬은 TripEditScreen.container 그대로, 모양과 고르는 방식만 다름.
//  C "장소 눌러 고르기": 지도 장소 아이콘(POI) 탭으로 선택 + 지도 위 선택 카드, 검색 결과는 검색창 아래에 밀어내며 표시(덮지 않음)
//  D "추천 장소 바로 추가": 지도는 작게(그날 핀만), 아래 "교토 추천 장소" 목록에서 [+]로 한 번에 추가

type BaseProps = React.ComponentProps<typeof TripEditScreenView>;
// 좌표는 비어 있을 수 있음 — /places 목록 API는 좌표를 안 내려줘서, 추가할 때 컨테이너가 상세 API로 채움
export type QuickPlace = { id: number | string; name: string; address: string; latitude: number | null; longitude: number | null };

function fmtDay(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}.${d.getDate()} (${["일", "월", "화", "수", "목", "금", "토"][d.getDay()]})`;
}

function Header({ p, title }: { p: BaseProps; title: string }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={p.onDone} style={styles.headerBtn} hitSlop={8}>
        <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
      </TouchableOpacity>
      <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
      <TouchableOpacity onPress={p.onDone} style={styles.headerDone} hitSlop={8}>
        <Text style={styles.headerDoneText}>완료</Text>
      </TouchableOpacity>
    </View>
  );
}

function SearchRow({ p, placeholder }: { p: BaseProps; placeholder: string }) {
  return (
    <View style={styles.searchRow}>
      <Ionicons name="search" size={18} color={colors.neutral500} />
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        value={p.query}
        onChangeText={p.onChangeQuery}
        onSubmitEditing={p.onSearch}
        returnKeyType="search"
      />
      {p.query ? (
        <TouchableOpacity onPress={p.onClearSearch} hitSlop={8}>
          <Ionicons name="close-circle" size={18} color={colors.neutral300} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

function DayMarkers({ list }: { list: Schedule[] }) {
  return (
    <>
      {list
        .filter((s) => s.latitude !== null && s.longitude !== null)
        .map((s, i) => (
          <Marker key={s.id} coordinate={{ latitude: s.latitude!, longitude: s.longitude! }} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={styles.numDot}>
              <Text style={styles.numDotText}>{i + 1}</Text>
            </View>
          </Marker>
        ))}
    </>
  );
}

export function TripEditPoiView(
  p: BaseProps & { onPoiClick: (poi: { coordinate: { latitude: number; longitude: number }; name: string; placeId: string }) => void }
) {
  const insets = useSafeAreaInsets();
  const cur = p.schedulesByDay[p.currentDayIndex];
  const list = cur?.schedules ?? [];
  const dayLabel = cur ? `Day ${p.currentDayIndex + 1} · ${fmtDay(cur.day.date)}` : "일정 편집";
  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <Header p={p} title={dayLabel} />
      <View style={styles.pad}>
        <SearchRow p={p} placeholder="장소 이름으로 찾기" />
      </View>
      {p.searchResults.length > 0 && (
        <View style={styles.results}>
          {p.searchResults.slice(0, 5).map((r) => (
            <TouchableOpacity key={String(r.id)} style={styles.resultRow} onPress={() => p.onSelectPlace(r)} activeOpacity={0.7}>
              <Ionicons name="location-outline" size={18} color={colors.neutral500} />
              <View style={{ flex: 1 }}>
                <Text style={styles.resultName} numberOfLines={1}>{r.name}</Text>
                {r.address ? <Text style={styles.resultAddr} numberOfLines={1}>{r.address}</Text> : null}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.mapWrap}>
          <MapView
            ref={p.mapRef}
            style={StyleSheet.absoluteFillObject}
            region={p.mapRegion ?? undefined}
            showsUserLocation
            onPoiClick={(e) => p.onPoiClick(e.nativeEvent as any)}
            onLongPress={(e) => p.onMapLongPress(e.nativeEvent.coordinate)}
          >
            <DayMarkers list={list} />
            {p.selectedPlace && (
              <Marker coordinate={{ latitude: p.selectedPlace.latitude, longitude: p.selectedPlace.longitude }} pinColor={colors.primary} />
            )}
          </MapView>
          {p.selectedPlace ? (
            <View style={styles.pickCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.pickName} numberOfLines={1}>{p.selectedPlace.name}</Text>
                {p.selectedPlace.address ? <Text style={styles.resultAddr} numberOfLines={1}>{p.selectedPlace.address}</Text> : null}
              </View>
              <TouchableOpacity onPress={p.onClearSearch} style={styles.ghostBtn} hitSlop={6}>
                <Text style={styles.ghostText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={p.onAddPlace} disabled={p.addingPlace} style={styles.primaryBtn} activeOpacity={0.8}>
                {p.addingPlace ? <ActivityIndicator size="small" color={colors.textWhite} /> : <Text style={styles.primaryText}>추가</Text>}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.hint} pointerEvents="none">
              <Ionicons name="hand-left-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.hintText}>지도의 장소 아이콘을 누르면 바로 골라져요</Text>
            </View>
          )}
        </View>
        <View style={styles.listHead}>
          <Text style={styles.listTitle}>일정 {list.length}곳</Text>
          <Text style={styles.listSub}>길게 눌러 순서 바꾸기</Text>
        </View>
        <View style={styles.pad}>
          <SortableScheduleList schedules={list} segments={p.segments} onReorder={p.onReorder} onDelete={p.onDelete} />
        </View>
        <View style={{ height: insets.bottom + spacing.xl }} />
      </ScrollView>
    </View>
  );
}

export function TripEditQuickAddView(
  p: BaseProps & { cityKey: string; recommended: SearchPlace[]; onQuickAdd: (place: QuickPlace) => void }
) {
  const insets = useSafeAreaInsets();
  const cur = p.schedulesByDay[p.currentDayIndex];
  const list = cur?.schedules ?? [];
  const added = new Set(list.filter((s) => s.place_id != null).map((s) => String(s.place_id)));
  const cityKo = getCityLabel(p.cityKey);
  const searching = p.query.length >= 2;
  const rows: (QuickPlace & { category?: string | null; thumbnail_url?: string | null; sub?: string })[] = searching
    ? p.searchResults.map((r) => ({ ...r, sub: r.address }))
    : p.recommended
        .slice(0, 8)
        .map((r) => ({
          id: r.id,
          name: r.name_ko || r.name,
          address: r.address,
          latitude: r.latitude ?? null,
          longitude: r.longitude ?? null,
          category: r.category,
          thumbnail_url: r.thumbnail_url,
          sub: r.name_ko ? r.name : r.address,
        }));

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <Header p={p} title={cur ? `Day ${p.currentDayIndex + 1} · ${fmtDay(cur.day.date)}` : "일정 편집"} />
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.smallMap}>
          <MapView ref={p.mapRef} style={StyleSheet.absoluteFillObject} region={p.mapRegion ?? undefined} scrollEnabled={false} zoomEnabled={false} toolbarEnabled={false}>
            <DayMarkers list={list} />
          </MapView>
        </View>

        <View style={styles.listHead}>
          <Text style={styles.listTitle}>일정 {list.length}곳</Text>
          {list.length > 1 && <Text style={styles.listSub}>길게 눌러 순서 바꾸기</Text>}
        </View>
        <View style={styles.pad}>
          {list.length === 0 ? (
            <Text style={styles.empty}>아래에서 장소를 골라 [+]를 눌러보세요</Text>
          ) : (
            <SortableScheduleList schedules={list} segments={p.segments} onReorder={p.onReorder} onDelete={p.onDelete} />
          )}
        </View>

        <View style={[styles.pad, { marginTop: spacing.xl }]}>
          <SearchRow p={p} placeholder={`${cityKo}에서 장소 찾기`} />
          <Text style={[styles.listTitle, { marginTop: spacing.lg }]}>{searching ? "검색 결과" : `${cityKo} 추천 장소`}</Text>
          {rows.length === 0 ? (
            <Text style={styles.empty}>{searching ? "찾는 장소가 없어요" : "추천 장소를 불러오는 중이에요"}</Text>
          ) : (
            rows.map((r) => {
              const isAdded = added.has(String(r.id));
              return (
                <View key={String(r.id)} style={styles.quickRow}>
                  <PlaceThumb uri={r.thumbnail_url} category={r.category ?? "attraction"} style={styles.quickThumb} iconSize={18} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.resultName} numberOfLines={1}>{r.name}</Text>
                    {r.sub ? <Text style={styles.resultAddr} numberOfLines={1}>{r.sub}</Text> : null}
                  </View>
                  {isAdded ? (
                    <View style={styles.addedTag}>
                      <Ionicons name="checkmark" size={16} color={colors.successText} />
                      <Text style={styles.addedText}>추가됨</Text>
                    </View>
                  ) : (
                    <TouchableOpacity style={styles.plusBtn} onPress={() => p.onQuickAdd(r)} disabled={p.addingPlace} accessibilityLabel={`${r.name} 일정에 추가`}>
                      <Ionicons name="add" size={20} color={colors.textPrimary} />
                    </TouchableOpacity>
                  )}
                </View>
              );
            })
          )}
        </View>
        <View style={{ height: insets.bottom + spacing.xxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  pad: { paddingHorizontal: spacing.gutter },
  header: { height: 56, flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.sm },
  headerBtn: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  headerTitle: { flex: 1, fontSize: 17, lineHeight: 24, fontWeight: "700", color: colors.textPrimary, textAlign: "center" },
  headerDone: { minWidth: 44, height: 44, alignItems: "center", justifyContent: "center", paddingHorizontal: spacing.sm },
  headerDoneText: { fontSize: 16, lineHeight: 24, fontWeight: "700", color: colors.textPrimary },

  searchRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, height: 48, borderRadius: radius.md, backgroundColor: colors.neutral100, paddingHorizontal: spacing.md },
  searchInput: { flex: 1, fontSize: 16, color: colors.textPrimary, paddingVertical: 0 },
  results: { paddingHorizontal: spacing.gutter, paddingTop: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.divider },
  resultRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, minHeight: 56 },
  resultName: { fontSize: 15, lineHeight: 22, fontWeight: "600", color: colors.textPrimary },
  resultAddr: { fontSize: 12, lineHeight: 16, color: colors.textTertiary },

  mapWrap: { height: 340, marginTop: spacing.md, backgroundColor: colors.neutral100 },
  hint: {
    position: "absolute",
    bottom: spacing.md,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    height: 32,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  hintText: { fontSize: 12, lineHeight: 16, fontWeight: "600", color: colors.textSecondary },
  pickCard: {
    position: "absolute",
    left: spacing.gutter,
    right: spacing.gutter,
    bottom: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: colors.divider,
    padding: spacing.md,
  },
  pickName: { fontSize: 16, lineHeight: 24, fontWeight: "700", color: colors.textPrimary },
  ghostBtn: { height: 40, paddingHorizontal: spacing.md, justifyContent: "center" },
  ghostText: { fontSize: 14, lineHeight: 20, fontWeight: "600", color: colors.textSecondary },
  primaryBtn: { height: 40, minWidth: 64, paddingHorizontal: spacing.lg, borderRadius: radius.full, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  primaryText: { fontSize: 15, lineHeight: 22, fontWeight: "700", color: colors.textWhite },

  listHead: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", paddingHorizontal: spacing.gutter, paddingTop: spacing.xl, paddingBottom: spacing.sm },
  listTitle: { fontSize: 18, lineHeight: 26, fontWeight: "700", color: colors.textPrimary },
  listSub: { fontSize: 12, lineHeight: 16, color: colors.textTertiary },
  empty: { fontSize: 14, lineHeight: 20, color: colors.textTertiary, paddingVertical: spacing.md },

  smallMap: { height: 180, backgroundColor: colors.neutral100 },
  quickRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, minHeight: 64, borderBottomWidth: 1, borderBottomColor: colors.divider },
  quickThumb: { width: 44, height: 44, borderRadius: radius.sm },
  plusBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  addedTag: { flexDirection: "row", alignItems: "center", gap: 2 },
  addedText: { fontSize: 13, lineHeight: 18, fontWeight: "600", color: colors.successText },

  numDot: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: colors.surface },
  numDotText: { fontSize: 12, lineHeight: 16, fontWeight: "700", color: colors.textWhite },
});
