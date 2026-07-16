import React, { useCallback, useEffect, useState } from "react";
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing, radius } from "@/styles";
import { ENV } from "@/config/env";
import type { Trip, TripDay, Schedule } from "@/contexts/TripContext";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";

type RouteParams = { tripId: number; city: string; start_date: string; end_date: string };

type DaySchedule = { day: TripDay; schedules: Schedule[] };

export default function PastTripScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { tripId, city, start_date, end_date } = useRoute<any>().params as RouteParams;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [schedulesByDay, setSchedulesByDay] = useState<DaySchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadTrip = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`${ENV.API_BASE_URL}/trips/${tripId}/full`);
      if (!res.ok) throw new Error(`지난 여행 조회 실패: ${res.status}`);
      const data = await res.json();
      setTrip(data.trip);
      const days: DaySchedule[] = (data.trip_days ?? []).map((day: TripDay) => ({
        day,
        schedules: (data.schedules ?? []).filter((s: Schedule) => s.trip_day_id === day.id),
      }));
      setSchedulesByDay(days);
    } catch (e) {
      console.error("PastTripScreen 로딩 실패", e);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    loadTrip();
  }, [loadTrip]);

  const nights = (() => {
    try {
      const diff = Math.round(
        (new Date(end_date).getTime() - new Date(start_date).getTime()) / (1000 * 60 * 60 * 24)
      );
      return diff > 0 ? `${diff}박${diff + 1}일` : "당일치기";
    } catch { return ""; }
  })();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerCity}>{city}</Text>
          <Text style={styles.headerDate}>{start_date} · {nights}</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <Spinner />
        </View>
      ) : error ? (
        <EmptyState
          icon="alert-circle-outline"
          title="여행 정보를 불러오지 못했습니다"
          description="네트워크 상태를 확인하고 다시 시도해주세요."
          actionLabel="다시 시도"
          onAction={loadTrip}
        />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {schedulesByDay.map((ds, idx) => (
            <View key={ds.day.id} style={styles.daySection}>
              <Text style={styles.dayTitle}>
                Day {idx + 1} | {formatDate(ds.day.date)}
              </Text>
              {ds.schedules.length === 0 ? (
                <Text style={styles.empty}>일정이 없습니다</Text>
              ) : (
                ds.schedules.map((s, i) => (
                  <View key={s.id} style={styles.item}>
                    <View style={styles.numBadge}>
                      <Text style={styles.numText}>{i + 1}</Text>
                    </View>
                    <View style={styles.info}>
                      <Text style={styles.activity}>{s.activity}</Text>
                      {s.place_name ? <Text style={styles.place}>{s.place_name}</Text> : null}
                    </View>
                  </View>
                ))
              )}
            </View>
          ))}
          <View style={{ height: 32 }} />
        </ScrollView>
      )}
    </View>
  );
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("ko-KR", { month: "numeric", day: "numeric", weekday: "short" });
  } catch { return dateStr; }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    gap: 12,
  },
  backBtn: { padding: 4 },
  headerInfo: { flex: 1 },
  headerCity: { fontSize: 17, fontWeight: "700", color: colors.textPrimary },
  headerDate: { fontSize: 12, color: colors.textTertiary, marginTop: 2 },

  daySection: {
    backgroundColor: colors.surface,
    marginTop: 8,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  dayTitle: {
    fontSize: 14, fontWeight: "700", color: colors.textPrimary,
    paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: colors.borderSubtle,
  },
  empty: { fontSize: 13, color: colors.textTertiary, paddingVertical: 20, textAlign: "center" },
  item: {
    flexDirection: "row", alignItems: "flex-start",
    gap: 12, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: colors.borderSubtle,
  },
  numBadge: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: colors.primary, alignItems: "center", justifyContent: "center",
    marginTop: 1,
  },
  numText: { fontSize: 13, fontWeight: "700", color: colors.textWhite },
  info: { flex: 1 },
  activity: { fontSize: 14, fontWeight: "600", color: colors.textPrimary },
  place: { fontSize: 12, color: colors.textTertiary, marginTop: 2 },
});
