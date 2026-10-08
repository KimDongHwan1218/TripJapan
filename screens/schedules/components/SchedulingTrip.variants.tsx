import React from "react";
import { View, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Text from "@/components/ui/Text";
import TabHeader from "@/components/Header/TabHeader";
import { colors, radius, spacing } from "@/styles";
import { getCityLabel } from "@/constants/cities";
import { getScheduleSubtitle } from "@/domain/schedule";
import type { Trip, TripDay, Schedule } from "@/contexts/TripContext";
import type { RouteInfo } from "../hooks/useRouteInfo";
import ScheduleMap from "./ScheduleMap";

// 일정 탭 "여행 있음" 시안 B·C. 데이터·Day 선택은 SchedulingScreen.container 그대로.
//  B "Day 탭 + 타임라인": 점 인디케이터(어느 날인지 안 보임) 대신 위에 날짜 탭, 일정은 시간 줄 타임라인, 편집은 테두리 버튼
//  C "지도 크게 + 아래 목록": 지도가 화면 절반, 그 위에 "교토 1일차" 카드와 ‹ › 날짜 넘김, 아래는 핀 번호와 같은 목록

type DaySchedule = { day: TripDay; schedules: Schedule[] };
export type TripVariantProps = {
  activeTrip: Trip;
  schedulesByDay: DaySchedule[];
  currentDayIndex: number;
  onSelectDay: (idx: number) => void;
  mapRef: React.RefObject<any>;
  mapSchedules: Schedule[];
  routeInfo: RouteInfo | null;
  onEditDay: (tripDayId: number, date: string) => void;
  onPressViewHistory: () => void;
};

const WEEK = ["일", "월", "화", "수", "목", "금", "토"];
function md(dateStr: string) {
  const d = new Date(dateStr);
  return { label: `${d.getMonth() + 1}.${d.getDate()}`, w: WEEK[d.getDay()], isToday: new Date().toDateString() === d.toDateString() };
}
const time = (s: Schedule) => (s.time && !s.time.startsWith("00:00") ? s.time.slice(0, 5) : null);

function HistoryBtn({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} hitSlop={8}>
      <Text style={styles.headerLink}>지난 여행 보기</Text>
    </TouchableOpacity>
  );
}

// 구간 이동 시간 — 좌표 있는 일정끼리만 이어진 segments라 "좌표 있는 것 중 몇 번째"로 찾음(A와 같은 규칙)
function segmentAfter(list: Schedule[], i: number, routeInfo: RouteInfo | null) {
  const s = list[i];
  const next = list[i + 1];
  if (!next || s.latitude === null || next.latitude === null) return null;
  const idx = list.slice(0, i).filter((x) => x.latitude !== null).length;
  return routeInfo?.segments?.[idx] ?? null;
}

export function TripDayTabsView(p: TripVariantProps) {
  const cur = p.schedulesByDay[p.currentDayIndex];
  const list = cur?.schedules ?? [];
  return (
    <View style={styles.screen}>
      <TabHeader rightContent={<HistoryBtn onPress={p.onPressViewHistory} />} />
      <View style={styles.titleBlock}>
        <Text style={styles.tripTitle}>{getCityLabel(p.activeTrip.city)} 여행</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs} style={{ flexGrow: 0 }}>
        {p.schedulesByDay.map((ds, i) => {
          const on = i === p.currentDayIndex;
          const d = md(ds.day.date);
          return (
            <TouchableOpacity key={ds.day.id} style={[styles.tab, on && styles.tabOn]} onPress={() => p.onSelectDay(i)} activeOpacity={0.7}>
              <Text style={[styles.tabDay, on && styles.tabTextOn]}>{d.isToday ? "오늘" : `Day ${i + 1}`}</Text>
              <Text style={[styles.tabDate, on && styles.tabTextOn]}>
                {d.label} {d.w}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <ScheduleMap ref={p.mapRef} schedules={p.mapSchedules} routePoints={p.routeInfo?.polylinePoints} city={p.activeTrip.city} height={180} />
      <ScrollView contentContainerStyle={styles.timeline} showsVerticalScrollIndicator={false}>
        {list.length === 0 ? (
          <Text style={styles.empty}>이 날은 아직 일정이 없어요</Text>
        ) : (
          list.map((s, i) => {
            const seg = segmentAfter(list, i, p.routeInfo);
            const last = i === list.length - 1;
            return (
              <View key={s.id} style={styles.tlRow}>
                <Text style={styles.tlTime}>{time(s) ?? ""}</Text>
                <View style={styles.tlRail}>
                  <View style={styles.tlDot}>
                    <Text style={styles.tlNum}>{i + 1}</Text>
                  </View>
                  {!last && <View style={styles.tlLine} />}
                </View>
                <View style={styles.tlBody}>
                  <Text style={styles.tlTitle}>{s.activity}</Text>
                  {getScheduleSubtitle(s) ? <Text style={styles.tlSub}>{getScheduleSubtitle(s)}</Text> : null}
                  {seg && <Text style={styles.tlMove}>도보 {seg.duration} · {seg.distance}</Text>}
                </View>
              </View>
            );
          })
        )}
        {cur && (
          <TouchableOpacity style={styles.outlineBtn} onPress={() => p.onEditDay(cur.day.id, cur.day.date)} activeOpacity={0.7}>
            <Ionicons name="add" size={18} color={colors.textPrimary} />
            <Text style={styles.outlineText}>{list.length ? "일정 추가·편집" : "일정 추가하기"}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

export function TripMapSheetView(p: TripVariantProps) {
  const cur = p.schedulesByDay[p.currentDayIndex];
  const list = cur?.schedules ?? [];
  const d = cur ? md(cur.day.date) : null;
  const canPrev = p.currentDayIndex > 0;
  const canNext = p.currentDayIndex < p.schedulesByDay.length - 1;
  return (
    <View style={styles.screen}>
      <TabHeader rightContent={<HistoryBtn onPress={p.onPressViewHistory} />} />
      <View>
        <ScheduleMap ref={p.mapRef} schedules={p.mapSchedules} routePoints={p.routeInfo?.polylinePoints} city={p.activeTrip.city} height={360} />
        {/* 지도 위 날짜 카드 */}
        <View style={styles.dayCard} pointerEvents="box-none">
          <TouchableOpacity disabled={!canPrev} onPress={() => p.onSelectDay(p.currentDayIndex - 1)} hitSlop={8} style={styles.dayArrow}>
            <Ionicons name="chevron-back" size={20} color={canPrev ? colors.textPrimary : colors.neutral300} />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={styles.dayCardTitle}>
              {getCityLabel(p.activeTrip.city)} {p.currentDayIndex + 1}일차{d?.isToday ? " · 오늘" : ""}
            </Text>
            {d && (
              <Text style={styles.dayCardSub}>
                {d.label} ({d.w}) · {p.currentDayIndex + 1}/{p.schedulesByDay.length}
              </Text>
            )}
          </View>
          <TouchableOpacity disabled={!canNext} onPress={() => p.onSelectDay(p.currentDayIndex + 1)} hitSlop={8} style={styles.dayArrow}>
            <Ionicons name="chevron-forward" size={20} color={canNext ? colors.textPrimary : colors.neutral300} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.sheet}>
        <View style={styles.sheetHead}>
          <Text style={styles.sheetTitle}>일정 {list.length}곳</Text>
          {cur && (
            <TouchableOpacity onPress={() => p.onEditDay(cur.day.id, cur.day.date)} hitSlop={8} style={styles.sheetEdit}>
              <Text style={styles.sheetEditText}>편집</Text>
            </TouchableOpacity>
          )}
        </View>
        <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }} showsVerticalScrollIndicator={false}>
          {list.length === 0 ? (
            <TouchableOpacity style={styles.addRow} onPress={() => cur && p.onEditDay(cur.day.id, cur.day.date)} activeOpacity={0.7}>
              <Ionicons name="add-circle-outline" size={22} color={colors.textSecondary} />
              <Text style={styles.addRowText}>지도에서 장소를 골라 일정을 추가해보세요</Text>
            </TouchableOpacity>
          ) : (
            list.map((s, i) => (
              <View key={s.id} style={styles.listRow}>
                <View style={styles.pinNum}>
                  <Text style={styles.pinNumText}>{i + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.tlTitle} numberOfLines={1}>{s.activity}</Text>
                  {getScheduleSubtitle(s) ? <Text style={styles.tlSub} numberOfLines={1}>{getScheduleSubtitle(s)}</Text> : null}
                </View>
                {time(s) && <Text style={styles.listTime}>{time(s)}</Text>}
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  headerLink: { fontSize: 14, lineHeight: 20, fontWeight: "600", color: colors.textSecondary },

  titleBlock: { paddingHorizontal: spacing.gutter, paddingTop: spacing.sm },
  tripTitle: { fontSize: 24, lineHeight: 32, fontWeight: "700", letterSpacing: -0.5, color: colors.textPrimary },
  tabs: { paddingHorizontal: spacing.gutter, gap: spacing.sm, paddingVertical: spacing.md },
  tab: { minWidth: 72, height: 52, paddingHorizontal: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  tabOn: { borderColor: colors.textPrimary, borderWidth: 1.5 },
  tabDay: { fontSize: 14, lineHeight: 20, fontWeight: "700", color: colors.textSecondary },
  tabDate: { fontSize: 12, lineHeight: 16, color: colors.textTertiary },
  tabTextOn: { color: colors.textPrimary },

  timeline: { paddingHorizontal: spacing.gutter, paddingTop: spacing.lg, paddingBottom: spacing.xxl },
  tlRow: { flexDirection: "row" },
  tlTime: { width: 44, fontSize: 13, lineHeight: 24, fontWeight: "600", color: colors.textTertiary, fontVariant: ["tabular-nums"] },
  tlRail: { width: 28, alignItems: "center" },
  tlDot: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary, // 지도 핀 번호와 같은 색
    alignItems: "center", justifyContent: "center" },
  tlNum: { fontSize: 12, lineHeight: 16, fontWeight: "700", color: colors.textWhite },
  tlLine: { flex: 1, width: 2, backgroundColor: colors.divider, marginVertical: 2 },
  tlBody: { flex: 1, paddingLeft: spacing.md, paddingBottom: spacing.xl },
  tlTitle: { fontSize: 16, lineHeight: 24, fontWeight: "600", color: colors.textPrimary },
  tlSub: { fontSize: 13, lineHeight: 18, color: colors.textTertiary },
  tlMove: { fontSize: 12, lineHeight: 16, fontWeight: "600", color: colors.textSecondary, marginTop: spacing.sm },
  empty: { fontSize: 14, lineHeight: 20, color: colors.textTertiary, paddingVertical: spacing.lg },
  outlineBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.xs, height: 48, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, marginTop: spacing.sm },
  outlineText: { fontSize: 15, lineHeight: 22, fontWeight: "600", color: colors.textPrimary },

  dayCard: {
    position: "absolute",
    left: spacing.gutter,
    right: spacing.gutter,
    top: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: colors.divider,
    paddingVertical: spacing.sm,
  },
  dayArrow: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  dayCardTitle: { fontSize: 16, lineHeight: 24, fontWeight: "700", color: colors.textPrimary },
  dayCardSub: { fontSize: 12, lineHeight: 16, color: colors.textTertiary },

  sheet: { flex: 1, marginTop: -spacing.lg, backgroundColor: colors.surface, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, paddingHorizontal: spacing.gutter, paddingTop: spacing.lg },
  sheetHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.sm },
  sheetTitle: { fontSize: 18, lineHeight: 26, fontWeight: "700", color: colors.textPrimary },
  sheetEdit: { height: 36, paddingHorizontal: spacing.md, borderRadius: radius.full, borderWidth: 1, borderColor: colors.border, justifyContent: "center" },
  sheetEditText: { fontSize: 14, lineHeight: 20, fontWeight: "600", color: colors.textPrimary },
  listRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, minHeight: 60, borderBottomWidth: 1, borderBottomColor: colors.divider },
  pinNum: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  pinNumText: { fontSize: 13, lineHeight: 18, fontWeight: "700", color: colors.textWhite },
  listTime: { fontSize: 13, lineHeight: 18, fontWeight: "600", color: colors.textTertiary, fontVariant: ["tabular-nums"] },
  addRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, minHeight: 56 },
  addRowText: { fontSize: 15, lineHeight: 22, color: colors.textSecondary },
});
