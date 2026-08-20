import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
  Image,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing, radius, shadows } from "@/styles";
import type { Trip, TripDay, Schedule } from "@/contexts/TripContext";
import type { RouteInfo, TravelMode } from "./hooks/useRouteInfo";
import ScheduleMap from "./components/ScheduleMap";
import Spinner from "@/components/ui/Spinner";
import { CITY_META } from "@/constants/cities";

const CITY_LABEL = Object.fromEntries(
  Object.entries(CITY_META).map(([key, meta]) => [key, meta.label.ko])
) as Record<string, string>;

type DaySchedule = {
  day: TripDay;
  schedules: Schedule[];
};

export type VisitedPlace = {
  id: number;
  name: string;
  address: string;
  category: string | null;
  thumbnail_url: string | null;
  reviewed: boolean;
};

type Props = {
  activeTrip: Trip | null;
  initialLoading: boolean;
  schedulesByDay: DaySchedule[];
  currentDayIndex: number;
  onSelectDay: (idx: number) => void;

  nickname: string;
  todayDayNumber: number;
  hasTripHistory: boolean;

  mapRef: React.RefObject<any>;
  mapSchedules: Schedule[];
  routeInfo: RouteInfo | null;
  travelMode: TravelMode;
  onChangeTravelMode: (mode: TravelMode) => void;

  onEditDay: (tripDayId: number, date: string) => void;
  onPressViewHistory: () => void;
  onPressNewTrip: () => void;

  // 여행 종료 후 7일 이내 — 방문 장소 리뷰쓰기 리스트
  recentlyEndedTrip: Trip | null;
  visitedPlaces: VisitedPlace[];
  visitedPlacesLoading: boolean;
  onWriteVisitedReview: (place: VisitedPlace) => void;
};

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

export default function SchedulingScreenView({
  activeTrip,
  initialLoading,
  schedulesByDay,
  currentDayIndex,
  onSelectDay,
  nickname,
  todayDayNumber,
  hasTripHistory,
  mapRef,
  mapSchedules,
  routeInfo,
  travelMode,
  onChangeTravelMode,
  onEditDay,
  onPressViewHistory,
  onPressNewTrip,
  recentlyEndedTrip,
  visitedPlaces,
  visitedPlacesLoading,
  onWriteVisitedReview,
}: Props) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const pagerRef = useRef<FlatList<DaySchedule>>(null);

  // 외부(점 인디케이터 탭)에서 currentDayIndex가 바뀌면 페이저도 따라 이동
  useEffect(() => {
    pagerRef.current?.scrollToOffset({ offset: currentDayIndex * width, animated: true });
  }, [currentDayIndex, width]);

  const handleMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    if (idx !== currentDayIndex) onSelectDay(idx);
  };

  const handleTapDot = (idx: number) => {
    onSelectDay(idx);
  };

  // ─── 여행 목록 최초 로딩 중 ──────────────────────────────────
  if (initialLoading && !activeTrip) {
    return <Spinner fullscreen style={{ paddingTop: insets.top }} />;
  }

  // ─── 여행 없음 상태 ──────────────────────────────────────────
  if (!activeTrip) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={styles.logo}>tabi</Text>
          <TouchableOpacity style={styles.headerBtn} onPress={onPressViewHistory}>
            <Text style={styles.headerBtnText}>지난 여행 보기</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80" }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.noTripCard}>
            <Text style={styles.noTripTitle}>
              {nickname ? `${nickname}님,\n` : ""}
              {hasTripHistory ? "다음 일본 여행을 계획해볼까요?" : "일본 첫 여행을 떠나볼까요?"}
            </Text>
            <Text style={styles.noTripSubtitle}>
              타비로 쉽고 빠르게, 스케줄을 등록해보세요!
            </Text>
            <TouchableOpacity style={styles.newTripBtn} onPress={onPressNewTrip} activeOpacity={0.85}>
              <Text style={styles.newTripBtnText}>새로운 여행 떠나기</Text>
            </TouchableOpacity>
          </View>

          {recentlyEndedTrip && (
            <View style={styles.visitedSection}>
              <Text style={styles.visitedTitle}>
                {`${CITY_LABEL[recentlyEndedTrip.city] ?? recentlyEndedTrip.city} 여행`}은 어떠셨나요?
              </Text>
              <Text style={styles.visitedSubtitle}>방문했던 장소에 리뷰를 남겨보세요</Text>

              {visitedPlacesLoading ? (
                <Spinner />
              ) : visitedPlaces.length === 0 ? (
                <Text style={styles.visitedEmptyText}>일정에 등록된 장소가 없어요</Text>
              ) : (
                visitedPlaces.map((place) => (
                  <View key={place.id} style={styles.visitedCard}>
                    {place.thumbnail_url ? (
                      <Image source={{ uri: place.thumbnail_url }} style={styles.visitedThumb} />
                    ) : (
                      <View style={[styles.visitedThumb, styles.visitedThumbPlaceholder]}>
                        <Ionicons name="location-outline" size={20} color={colors.neutral300} />
                      </View>
                    )}
                    <View style={styles.visitedInfo}>
                      <Text style={styles.visitedName} numberOfLines={1}>{place.name}</Text>
                      <Text style={styles.visitedAddress} numberOfLines={1}>{place.address}</Text>
                    </View>
                    {place.reviewed ? (
                      <View style={styles.visitedDoneBadge}>
                        <Ionicons name="checkmark" size={13} color={colors.primary} />
                        <Text style={styles.visitedDoneText}>작성완료</Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.visitedWriteBtn}
                        onPress={() => onWriteVisitedReview(place)}
                        activeOpacity={0.85}
                      >
                        <Text style={styles.visitedWriteBtnText}>리뷰쓰기</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))
              )}
            </View>
          )}
          <View style={{ height: 32 }} />
        </ScrollView>
      </View>
    );
  }

  // ─── 여행 있음 상태 ──────────────────────────────────────────
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.logo}>tabi</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={onPressViewHistory}>
          <Text style={styles.headerBtnText}>이전 여행 보기</Text>
        </TouchableOpacity>
      </View>

      {/* 인사말 */}
      <View style={styles.greeting}>
        <Text style={styles.greetingText}>
          {nickname ? `${nickname}님,\n` : ""}
          오늘 {activeTrip.city} 여행 {todayDayNumber}일차 입니다!
        </Text>
      </View>

      {/* 지도 — 현재 스와이프된 day의 핀 + 경로만 표시 */}
      <ScheduleMap
        ref={mapRef}
        schedules={mapSchedules}
        routePoints={routeInfo?.polylinePoints}
        travelMode={travelMode}
      />

      {/* Day별 일정 — 한 페이지에 하루씩, 스와이프로 이동 */}
      <FlatList
        ref={pagerRef}
        data={schedulesByDay}
        keyExtractor={(ds) => String(ds.day.id)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        onMomentumScrollEnd={handleMomentumScrollEnd}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        style={styles.pager}
        renderItem={({ item: ds, index: idx }) => (
          <View style={{ width, flex: 1 }}>
            {/* Day 헤더 — 흰 띠, 오른쪽에 도보/대중교통 토글 */}
            <View style={styles.dayTopBar}>
              <View>
                <Text style={styles.dayHeaderTitle}>Day {idx + 1}</Text>
                <Text style={styles.dayHeaderDate}>{formatDate(ds.day.date)}</Text>
              </View>
              <View style={styles.modeToggle}>
                {(["walking", "transit"] as TravelMode[]).map((m) => (
                  <TouchableOpacity
                    key={m}
                    style={[styles.modeBtn, travelMode === m && styles.modeBtnActive]}
                    onPress={() => onChangeTravelMode(m)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.modeBtnText, travelMode === m && styles.modeBtnTextActive]}>
                      {m === "walking" ? "🚶 도보" : "🚌 대중교통"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <ScrollView
              style={styles.dayScroll}
              contentContainerStyle={styles.dayPage}
              showsVerticalScrollIndicator={false}
            >
              <View>
                {ds.schedules.length === 0 ? (
                  <Text style={styles.emptyDay}>일정이 없습니다</Text>
                ) : (
                  ds.schedules.map((s, i) => (
                    <View key={s.id} style={styles.scheduleItem}>
                      <View style={styles.scheduleNum}>
                        <Text style={styles.scheduleNumText}>{i + 1}</Text>
                      </View>
                      <View style={styles.scheduleInfo}>
                        <Text style={styles.scheduleActivity}>{s.activity}</Text>
                        {s.place_name ? (
                          <Text style={styles.schedulePlace}>{s.place_name}</Text>
                        ) : null}
                      </View>
                    </View>
                  ))
                )}
              </View>

              <TouchableOpacity
                style={styles.editDayRow}
                onPress={() => onEditDay(ds.day.id, ds.day.date)}
              >
                <Text style={styles.editDayText}>일정 편집</Text>
                <Ionicons name="chevron-forward" size={13} color={colors.textTertiary} />
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}
      />

      {/* Day 인디케이터 — 탭으로 바로 이동 가능 */}
      {schedulesByDay.length > 1 && (
        <View style={styles.dotsRow}>
          {schedulesByDay.map((ds, idx) => (
            <TouchableOpacity
              key={ds.day.id}
              hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
              onPress={() => handleTapDot(idx)}
            >
              <View style={[styles.dot, currentDayIndex === idx && styles.dotActive]} />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  logo: { fontSize: 17, fontWeight: "700", color: colors.primary, letterSpacing: -0.5 },
  headerBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  headerBtnText: { fontSize: 13, fontWeight: "600", color: colors.textPrimary },

  greeting: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 32,
  },

  // Day 페이저 — 하루치 일정이 화면을 꽉 채우고 스와이프로 넘어감
  pager: { flex: 1 },

  // Day 헤더 — 흰 띠 (지도 바로 아래, 그 안에 도보/대중교통 토글)
  dayTopBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  dayHeaderTitle: { fontSize: 17, fontWeight: "700", color: colors.textPrimary },
  dayHeaderDate: { fontSize: 13, color: colors.textTertiary, fontWeight: "600" },

  modeToggle: {
    flexDirection: "row",
    backgroundColor: colors.neutral100,
    borderRadius: radius.xl,
    padding: 3,
  },
  modeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.xl - 3,
  },
  modeBtnActive: {
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  modeBtnText: { fontSize: 12, color: colors.textSecondary, fontWeight: "500" },
  modeBtnTextActive: { color: colors.textPrimary, fontWeight: "700" },

  // 실제 일정이 있는 영역 — 하루치 스크롤 콘텐츠, 짧아도 편집 버튼은 화면 하단에 붙도록 flexGrow
  dayScroll: { flex: 1 },
  dayPage: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },

  scheduleItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 14,
  },
  scheduleNum: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  scheduleNumText: { fontSize: 13, fontWeight: "700", color: colors.textWhite },
  scheduleInfo: { flex: 1 },
  scheduleActivity: { fontSize: 14, fontWeight: "600", color: colors.textPrimary },
  schedulePlace: { fontSize: 12, color: colors.textTertiary, marginTop: 2 },

  editDayRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 2,
    paddingTop: 12,
    paddingBottom: 4,
  },
  editDayText: { fontSize: 13, color: colors.textTertiary, fontWeight: "600" },
  emptyDay: {
    fontSize: 13,
    color: colors.textTertiary,
    paddingVertical: 20,
    textAlign: "center",
  },

  // Day 인디케이터 (점)
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    paddingVertical: 12,
    backgroundColor: colors.surface,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.neutral200,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 16,
  },

  // ─── No-trip ────────────────────────────────────────────────
  heroImage: { width: "100%", height: 220 },
  noTripCard: { backgroundColor: colors.surface, padding: spacing.lg, gap: 8 },
  noTripTitle: {
    fontSize: 20, fontWeight: "800", color: colors.textPrimary,
    letterSpacing: -0.5, lineHeight: 30,
  },
  noTripSubtitle: { fontSize: 13, color: colors.textSecondary, marginBottom: 8 },
  newTripBtn: {
    backgroundColor: colors.primary, borderRadius: radius.lg,
    paddingVertical: 14, alignItems: "center", marginTop: 8,
  },
  newTripBtnText: { fontSize: 15, fontWeight: "700", color: colors.textWhite },

  visitedSection: {
    backgroundColor: colors.surface, marginTop: 8,
    paddingHorizontal: spacing.md, paddingTop: 24, paddingBottom: 16,
  },
  visitedTitle: {
    fontSize: 16, fontWeight: "700", color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  visitedSubtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 4, marginBottom: 16 },
  visitedEmptyText: { fontSize: 13, color: colors.textTertiary, paddingVertical: 12 },
  visitedCard: {
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: colors.borderSubtle,
  },
  visitedThumb: { width: 44, height: 44, borderRadius: radius.md },
  visitedThumbPlaceholder: {
    backgroundColor: colors.neutral100, justifyContent: "center", alignItems: "center",
  },
  visitedInfo: { flex: 1 },
  visitedName: { fontSize: 14, fontWeight: "600", color: colors.textPrimary },
  visitedAddress: { fontSize: 12, color: colors.textTertiary, marginTop: 2 },
  visitedDoneBadge: { flexDirection: "row", alignItems: "center", gap: 3 },
  visitedDoneText: { fontSize: 12, fontWeight: "600", color: colors.primary },
  visitedWriteBtn: {
    backgroundColor: colors.primary, borderRadius: radius.pill,
    paddingHorizontal: 14, paddingVertical: 7,
  },
  visitedWriteBtnText: { fontSize: 12, fontWeight: "700", color: colors.textWhite },
});
