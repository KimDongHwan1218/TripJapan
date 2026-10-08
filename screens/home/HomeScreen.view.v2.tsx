import React from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Text from "@/components/ui/Text";
import SectionLink from "@/components/ui/SectionLink";
import { colors, radius, spacing } from "@/styles";
import { getCityLabel } from "@/constants/cities";
import type { Trip, Schedule } from "@/contexts/TripContext";
import type { TripPhase } from "@/domain/tripPhase";

import HeroBanner from "./components/HeroBanner";
import { TaviPickB, TaviTalkB } from "./components/sections/sections.v2";
import Slides from "./components/Slides";

// 홈 시안 B "상황별 홈"(사용성·미감 진단 H1-A·H2·H3-A·H4-A).
//  - 여행 중: 맨 위가 "오늘 카드"(일차·날씨·오늘 일정 3개) — 사진 배너 없음
//  - 여행 전: D-day 카드 / 여행 없음: 작은 배너(200) + "여행 만들기"
//  - 퀵액션: 단색 선 아이콘, 정보 타일만 숫자(기온·100엔당 원화). 색은 환율 변동에만
//  - 섹션 제목은 모두 SectionLink(18/700 + ›), 섹션 간격 32, MOCK 특가 배너 없음
type Props = {
  destinations: any[];
  activeTrip: Trip | null;
  tripPhase: TripPhase | null;
  todaySchedules: Schedule[];
  temperature: number | null;
  exchangeRate: number | null;
  exchangeRateDiff: number | null;
  onPressMyTrip: () => void;
  onPressCreateTrip: () => void;
  onPressWeather: () => void;
  onPressExchange: () => void;
  onPressTranslation: () => void;
  onPressTravelAlert: () => void;
  onPressTaviTalk: () => void;
  onPressTaviTalkPost: (postId: number) => void;
  onPressTaviPickAll: () => void;
};

function fmtRange(trip: Trip) {
  const f = (s: string) => {
    const d = new Date(s);
    const w = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
    return `${d.getMonth() + 1}.${d.getDate()}(${w})`;
  };
  return `${f(trip.start_date)} – ${f(trip.end_date)}`;
}

function TodayCard(p: Props) {
  const trip = p.activeTrip;
  if (!trip) {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>다음 일본 여행을 계획해 볼까요?</Text>
        <Text style={styles.cardSub}>도시와 날짜만 고르면 일정표가 만들어져요</Text>
        <TouchableOpacity style={styles.cta} onPress={p.onPressCreateTrip} activeOpacity={0.7}>
          <Text style={styles.ctaText}>여행 만들기</Text>
        </TouchableOpacity>
      </View>
    );
  }
  const city = getCityLabel(trip.city);
  const phase = p.tripPhase;
  if (phase?.status === "PRE") {
    const days = Math.ceil((new Date(trip.start_date).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) / 86400000);
    return (
      <View style={styles.card}>
        <Text style={styles.dday}>D-{days}</Text>
        <Text style={styles.cardTitle}>{city} 여행</Text>
        <Text style={styles.cardSub}>{fmtRange(trip)}</Text>
        <TouchableOpacity style={styles.cta} onPress={p.onPressMyTrip} activeOpacity={0.7}>
          <Text style={styles.ctaText}>일정 준비하기</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={styles.card}>
      <View style={styles.cardHead}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>
            {city} {phase?.dayNumber ?? 1}일차
          </Text>
          <Text style={styles.cardSub}>{fmtRange(trip)}</Text>
        </View>
        {p.temperature !== null && <Text style={styles.temp}>{Math.round(p.temperature)}°</Text>}
      </View>
      <View style={styles.todayList}>
        {p.todaySchedules.length === 0 ? (
          <Text style={styles.empty}>오늘 일정이 비어 있어요</Text>
        ) : (
          p.todaySchedules.slice(0, 3).map((s) => (
            <View key={s.id} style={styles.todayRow}>
              {/* 시간이 없는 일정(00:00 기본값 포함)은 시간 칸을 그리지 않음 */}
              {s.time && !s.time.startsWith("00:00") ? <Text style={styles.time}>{s.time.slice(0, 5)}</Text> : <View style={styles.dot} />}
              <Text style={styles.place} numberOfLines={1}>
                {s.activity}
              </Text>
            </View>
          ))
        )}
      </View>
      <TouchableOpacity style={styles.cta} onPress={p.onPressMyTrip} activeOpacity={0.7}>
        <Text style={styles.ctaText}>오늘 일정 보기</Text>
      </TouchableOpacity>
    </View>
  );
}

function QuickTile({ label, onPress, children }: { label: string; onPress: () => void; children: React.ReactNode }) {
  return (
    <TouchableOpacity style={styles.tile} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.tileBox}>{children}</View>
      <Text style={styles.tileLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function HomeScreenViewV2(p: Props) {
  const insets = useSafeAreaInsets();
  const diff = p.exchangeRateDiff;
  const up = diff !== null && diff > 0;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xxxl }}>
        {/* 여행이 없을 때만 작은 배너 — 여행 중/전엔 오늘 카드가 주인공 */}
        {!p.activeTrip && <HeroBanner compact />}

        <View style={[styles.block, !p.activeTrip && { marginTop: -spacing.xl }]}>
          <TodayCard {...p} />
        </View>

        <View style={styles.tiles}>
          <QuickTile label="날씨" onPress={p.onPressWeather}>
            {p.temperature !== null ? (
              <Text style={styles.tileNum}>{Math.round(p.temperature)}°</Text>
            ) : (
              <Ionicons name="partly-sunny-outline" size={24} color={colors.textPrimary} />
            )}
          </QuickTile>
          <QuickTile label="환율" onPress={p.onPressExchange}>
            <Text style={styles.tileNum}>{p.exchangeRate !== null ? Math.round(p.exchangeRate) : "—"}</Text>
            <Text style={[styles.tileUnit, diff ? { color: up ? colors.danger : colors.fall } : null]}>
              {diff ? `${up ? "▲" : "▼"}${Math.abs(diff)}` : "100엔당 원"}
            </Text>
          </QuickTile>
          <QuickTile label="번역" onPress={p.onPressTranslation}>
            <Ionicons name="language-outline" size={24} color={colors.textPrimary} />
          </QuickTile>
          <QuickTile label="여행 경보" onPress={p.onPressTravelAlert}>
            <Ionicons name="shield-checkmark-outline" size={24} color={colors.textPrimary} />
          </QuickTile>
          <QuickTile label="타비톡" onPress={p.onPressTaviTalk}>
            <Ionicons name="chatbubbles-outline" size={24} color={colors.textPrimary} />
          </QuickTile>
        </View>

        <View style={styles.section}>
          <SectionLink title="타비 PICK" onPress={p.onPressTaviPickAll} />
          <TaviPickB />
        </View>

        <View style={styles.section}>
          <SectionLink title="실시간 타비톡" onPress={p.onPressTaviTalk} />
          <TaviTalkB onPressPost={p.onPressTaviTalkPost} />
        </View>

        {p.destinations?.length > 0 && (
          <View style={styles.section}>
            <SectionLink title="추천 여행지" />
            <Slides data={p.destinations} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  block: { paddingHorizontal: spacing.gutter, marginTop: spacing.xl },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: colors.divider,
    padding: spacing.lg,
    gap: spacing.md,
  },
  cardHead: { flexDirection: "row", alignItems: "flex-start" },
  cardTitle: { fontSize: 20, lineHeight: 28, fontWeight: "700", letterSpacing: -0.4, color: colors.textPrimary },
  cardSub: { fontSize: 12, lineHeight: 16, fontWeight: "500", color: colors.textTertiary },
  dday: { fontSize: 12, lineHeight: 16, fontWeight: "700", color: colors.primaryHover },
  temp: { fontSize: 32, lineHeight: 40, fontWeight: "700", letterSpacing: -0.64, color: colors.textPrimary },
  todayList: { gap: spacing.sm, paddingVertical: spacing.xs },
  todayRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.neutral300, marginHorizontal: spacing.xs },
  time: { width: 44, fontSize: 14, lineHeight: 20, fontWeight: "600", color: colors.textSecondary, fontVariant: ["tabular-nums"] },
  place: { flex: 1, fontSize: 16, lineHeight: 24, fontWeight: "600", color: colors.textPrimary },
  empty: { fontSize: 14, lineHeight: 20, color: colors.textTertiary },
  cta: {
    height: 52,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: { fontSize: 16, lineHeight: 24, fontWeight: "700", color: colors.textWhite },
  tiles: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: spacing.gutter, marginTop: spacing.xl },
  tile: { alignItems: "center", gap: spacing.sm, width: 60 },
  tileBox: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  tileNum: { fontSize: 16, lineHeight: 20, fontWeight: "700", color: colors.textPrimary, fontVariant: ["tabular-nums"] },
  tileUnit: { fontSize: 11, lineHeight: 14, fontWeight: "700", color: colors.textTertiary },
  tileLabel: { fontSize: 12, lineHeight: 16, fontWeight: "500", color: colors.textSecondary },
  section: { marginTop: spacing.xxl },
});
