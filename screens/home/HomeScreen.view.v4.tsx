import React from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Text from "@/components/ui/Text";
import { colors, radius, spacing } from "@/styles";
import { tones, type ToneKey } from "@/styles/tones";
import { getCityLabel } from "@/constants/cities";
import { getWeatherInfo } from "@/domain/weather";

import { TaviPickD, TaviTalkD } from "./components/sections/sections.v4";
import { HomeVariantProps, fmtTripRange, daysUntil, scheduleTime } from "./homeVariantShared";

// 홈 시안 D "위젯 대시보드".
//  - 배너 사진 없음. 인사말 아래로 크기가 다른 위젯 격자(벤토) — 여행 카드(가로 전체) / 날씨·환율(반반) / 도구 3칸
//  - 날씨·환율은 숫자가 주인공(D7 큰 숫자), 위젯 배경은 카테고리 톤(연한 색)이라 회색 일색이 아님
//  - 버튼 채우기는 "여행 만들기" 하나뿐(D2)
function greeting() {
  const h = new Date().getHours();
  if (h < 11) return "좋은 아침이에요";
  if (h < 17) return "좋은 오후예요";
  return "좋은 저녁이에요";
}

function SmallTool({ icon, tone, label, onPress }: { icon: keyof typeof Ionicons.glyphMap; tone: ToneKey; label: string; onPress: () => void }) {
  const t = tones[tone];
  return (
    <TouchableOpacity style={[styles.small, { backgroundColor: t.bg }]} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name={icon} size={26} color={t.fg} />
      <Text style={styles.smallLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function TripWidget(p: HomeVariantProps) {
  const trip = p.activeTrip;
  if (!trip) {
    return (
      <View style={styles.tripCard}>
        <Text style={styles.tripTitle}>아직 계획한 여행이 없어요</Text>
        <Text style={styles.tripSub}>도시와 날짜만 고르면 일정표가 만들어져요</Text>
        <TouchableOpacity style={styles.cta} onPress={p.onPressCreateTrip} activeOpacity={0.7}>
          <Text style={styles.ctaText}>여행 만들기</Text>
        </TouchableOpacity>
      </View>
    );
  }
  const status = p.tripPhase?.status;
  const big = status === "PRE" ? `D-${daysUntil(trip.start_date)}` : status === "POST" ? "여행 끝" : `${p.tripPhase?.dayNumber ?? 1}일차`;
  return (
    <TouchableOpacity style={styles.tripCard} onPress={p.onPressMyTrip} activeOpacity={0.8}>
      <View style={styles.tripHead}>
        <View style={{ flex: 1 }}>
          <Text style={styles.tripBig}>{big}</Text>
          <Text style={styles.tripSub}>
            {getCityLabel(trip.city)} 여행 · {fmtTripRange(trip)}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.neutral500} />
      </View>
      {status === "ONGOING" && (
        <View style={styles.todayList}>
          {p.todaySchedules.length === 0 ? (
            <Text style={styles.empty}>오늘 일정이 비어 있어요</Text>
          ) : (
            p.todaySchedules.slice(0, 3).map((s) => (
              <View key={s.id} style={styles.todayRow}>
                <Text style={styles.todayTime}>{scheduleTime(s) ?? "·"}</Text>
                <Text style={styles.todayPlace} numberOfLines={1}>{s.activity}</Text>
              </View>
            ))
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function HomeScreenViewV4(p: HomeVariantProps) {
  const insets = useSafeAreaInsets();
  const weather = getWeatherInfo(p.weatherCode);
  const diff = p.exchangeRateDiff;
  const up = diff !== null && diff > 0;
  const cityLabel = getCityLabel(p.city);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xxxl }}>
        <View style={styles.header}>
          <Text style={styles.logo}>tabi</Text>
          <Text style={styles.hello}>
            {p.nickname ? `${p.nickname}님, ` : ""}
            {greeting()}
          </Text>
        </View>

        <View style={styles.grid}>
          <TripWidget {...p} />

          <View style={styles.row}>
            <TouchableOpacity style={[styles.half, { backgroundColor: tones.blue.bg }]} onPress={p.onPressWeather} activeOpacity={0.7}>
              <View style={styles.halfHead}>
                <Text style={styles.halfLabel}>{cityLabel} 날씨</Text>
                <Ionicons name={weather.icon} size={22} color={tones.blue.fg} />
              </View>
              <Text style={styles.bigNum}>{p.temperature !== null ? `${Math.round(p.temperature)}°` : "—"}</Text>
              <Text style={styles.halfSub}>{weather.label || "불러오는 중"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.half, { backgroundColor: tones.green.bg }]} onPress={p.onPressExchange} activeOpacity={0.7}>
              <View style={styles.halfHead}>
                <Text style={styles.halfLabel}>100엔</Text>
                <Ionicons name="cash" size={22} color={tones.green.fg} />
              </View>
              <Text style={styles.bigNum}>{p.exchangeRate !== null ? Math.round(p.exchangeRate) : "—"}</Text>
              <Text style={[styles.halfSub, diff ? { color: up ? colors.danger : colors.fall } : null]}>
                {diff ? `원 · 어제보다 ${up ? "▲" : "▼"}${Math.abs(diff)}` : "원"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <SmallTool icon="language" tone="purple" label="번역" onPress={p.onPressTranslation} />
            <SmallTool icon="shield-checkmark" tone="yellow" label="여행 경보" onPress={p.onPressTravelAlert} />
            <SmallTool icon="chatbubbles" tone="orange" label="타비톡" onPress={p.onPressTaviTalk} />
          </View>
        </View>

        {/* 섹션도 위젯 상자로 — 위 격자와 같은 결 */}
        <View style={styles.sectionTight}>
          <TaviTalkD onPressPost={p.onPressTaviTalkPost} onPressTaviTalk={p.onPressTaviTalk} />
        </View>
        <View style={styles.sectionTight}>
          <TaviPickD />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.gutter, paddingTop: spacing.lg, gap: spacing.sm },
  logo: { fontSize: 22, lineHeight: 28, fontWeight: "700", color: colors.textPrimary },
  hello: { fontSize: 24, lineHeight: 32, fontWeight: "700", letterSpacing: -0.5, color: colors.textPrimary, marginTop: spacing.md },

  grid: { paddingHorizontal: spacing.gutter, marginTop: spacing.xl, gap: 12 },
  row: { flexDirection: "row", gap: 12 },

  tripCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: colors.divider,
    padding: spacing.lg,
    gap: spacing.md,
  },
  tripHead: { flexDirection: "row", alignItems: "center" },
  tripTitle: { fontSize: 20, lineHeight: 28, fontWeight: "700", letterSpacing: -0.4, color: colors.textPrimary },
  tripBig: { fontSize: 32, lineHeight: 40, fontWeight: "700", letterSpacing: -0.64, color: colors.textPrimary },
  tripSub: { fontSize: 14, lineHeight: 20, fontWeight: "500", color: colors.textSecondary },
  todayList: { gap: spacing.sm, borderTopWidth: 1, borderTopColor: colors.divider, paddingTop: spacing.md },
  todayRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  todayTime: { width: 44, fontSize: 14, lineHeight: 20, fontWeight: "600", color: colors.textTertiary, fontVariant: ["tabular-nums"] },
  todayPlace: { flex: 1, fontSize: 16, lineHeight: 24, fontWeight: "600", color: colors.textPrimary },
  empty: { fontSize: 14, lineHeight: 20, color: colors.textTertiary },
  cta: { height: 52, borderRadius: radius.full, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  ctaText: { fontSize: 16, lineHeight: 24, fontWeight: "700", color: colors.textWhite },

  half: { flex: 1, borderRadius: radius.lg, borderCurve: "continuous", padding: spacing.lg, minHeight: 148, justifyContent: "space-between" },
  halfHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  halfLabel: { fontSize: 14, lineHeight: 20, fontWeight: "600", color: colors.textSecondary },
  bigNum: { fontSize: 40, lineHeight: 48, fontWeight: "700", letterSpacing: -0.8, color: colors.textPrimary, fontVariant: ["tabular-nums"] }, // D7
  halfSub: { fontSize: 12, lineHeight: 16, fontWeight: "600", color: colors.textTertiary },

  small: { flex: 1, height: 96, borderRadius: radius.lg, borderCurve: "continuous", alignItems: "center", justifyContent: "center", gap: spacing.sm },
  smallLabel: { fontSize: 12, lineHeight: 16, fontWeight: "700", color: colors.textPrimary },

  sectionTight: { marginTop: 12 },
});
