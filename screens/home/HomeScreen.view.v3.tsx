import React from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Text from "@/components/ui/Text";
import SectionLink from "@/components/ui/SectionLink";
import { colors, radius, spacing } from "@/styles";
import { tones, type ToneKey } from "@/styles/tones";
import { CITY_META, type TripCity } from "@/constants/cities";
import { getWeatherInfo } from "@/domain/weather";

import { TaviPickC, TaviTalkC } from "./components/sections/sections.v3";
import Slides from "./components/Slides";
import { HomeVariantProps, fmtTripRange, daysUntil, scheduleTime } from "./homeVariantShared";

// 홈 시안 C "도시 매거진".
//  - 맨 위를 광고형 배너(돈가스 사진) 대신 "내 여행 도시" 사진으로 — 도시명·일차·기온이 사진 위에 바로 보임
//  - 그 아래 시트가 사진 위로 겹쳐 올라오고, 도구는 컬러 아이콘 4칸(날씨는 사진 위로 옮겨서 뺌)
//  - 여행 중이면 "오늘 일정"이 시트 첫 섹션
const HERO_H = 400;

function ToolChip({ icon, tone, label, value, onPress }: { icon: keyof typeof Ionicons.glyphMap; tone: ToneKey; label: string; value?: string; onPress: () => void }) {
  const t = tones[tone];
  return (
    <TouchableOpacity style={styles.tool} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.toolIcon, { backgroundColor: t.bg }]}>
        <Ionicons name={icon} size={22} color={t.fg} />
      </View>
      <Text style={styles.toolLabel}>{label}</Text>
      {value ? <Text style={styles.toolValue}>{value}</Text> : null}
    </TouchableOpacity>
  );
}

export default function HomeScreenViewV3(p: HomeVariantProps) {
  const insets = useSafeAreaInsets();
  const meta = CITY_META[p.city as TripCity] ?? CITY_META.Tokyo;
  const trip = p.activeTrip;
  const weather = getWeatherInfo(p.weatherCode);
  const ongoing = !!trip && p.tripPhase?.status === "ONGOING";

  const status = !trip
    ? "다음 일본 여행, 어디로 떠날까요?"
    : p.tripPhase?.status === "PRE"
      ? `D-${daysUntil(trip.start_date)} · ${fmtTripRange(trip)}`
      : p.tripPhase?.status === "POST"
        ? `여행을 마쳤어요 · ${fmtTripRange(trip)}`
        : `${p.tripPhase?.dayNumber ?? 1}일차 · ${fmtTripRange(trip)}`;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xxxl }}>
        <TouchableOpacity activeOpacity={0.95} onPress={trip ? p.onPressMyTrip : p.onPressCreateTrip} style={styles.hero}>
          {/* absoluteFill만 주면 require 이미지가 원본 크기로 그려져 일부만 덮였음(실기기) → 크기 명시 */}
          <Image source={meta.image} style={styles.heroImg} resizeMode="cover" />
          <View style={styles.shade} />
          {/* 글씨가 놓이는 아래쪽만 한 겹 더 — 밝은 사진(교토 석양)에서 일차·날짜가 흐렸음 */}
          <View style={styles.shadeBottom} />
          <Text style={styles.logo}>tabi</Text>
          <View style={styles.heroBottom}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cityJa}>{trip ? meta.label.ja : "日本"}</Text>
              <Text style={styles.cityKo}>{trip ? meta.label.ko : "일본"}</Text>
              <Text style={styles.status}>{status}</Text>
            </View>
            {trip && p.temperature !== null && (
              <TouchableOpacity style={styles.weather} onPress={p.onPressWeather} activeOpacity={0.7}>
                <Ionicons name={weather.icon} size={22} color={colors.textWhite} />
                <Text style={styles.temp}>{Math.round(p.temperature)}°</Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>

        <View style={styles.sheet}>
          <View style={styles.tools}>
            <ToolChip icon="language" tone="purple" label="번역" onPress={p.onPressTranslation} />
            <ToolChip
              icon="cash"
              tone="green"
              label="환율"
              value={p.exchangeRate !== null ? `${Math.round(p.exchangeRate)}원` : undefined}
              onPress={p.onPressExchange}
            />
            <ToolChip
              icon={trip ? "shield-checkmark" : weather.icon}
              tone={trip ? "yellow" : "blue"}
              label={trip ? "여행 경보" : "날씨"}
              value={!trip && p.temperature !== null ? `${Math.round(p.temperature)}°` : undefined}
              onPress={trip ? p.onPressTravelAlert : p.onPressWeather}
            />
            <ToolChip icon="chatbubbles" tone="orange" label="타비톡" onPress={p.onPressTaviTalk} />
          </View>

          {!trip && (
            <View style={styles.block}>
              <TouchableOpacity style={styles.cta} onPress={p.onPressCreateTrip} activeOpacity={0.7}>
                <Text style={styles.ctaText}>여행 만들기</Text>
              </TouchableOpacity>
            </View>
          )}

          {ongoing && (
            <View style={styles.section}>
              <SectionLink title="오늘 일정" onPress={p.onPressMyTrip} />
              <View style={styles.timeline}>
                {p.todaySchedules.length === 0 ? (
                  <Text style={styles.empty}>오늘 일정이 비어 있어요</Text>
                ) : (
                  p.todaySchedules.slice(0, 4).map((s, i, arr) => (
                    <View key={s.id} style={styles.tlRow}>
                      <View style={styles.tlRail}>
                        <View style={styles.tlDot} />
                        {i < arr.length - 1 && <View style={styles.tlLine} />}
                      </View>
                      <View style={styles.tlBody}>
                        {scheduleTime(s) && <Text style={styles.tlTime}>{scheduleTime(s)}</Text>}
                        <Text style={styles.tlPlace} numberOfLines={1}>{s.activity}</Text>
                      </View>
                    </View>
                  ))
                )}
              </View>
            </View>
          )}

          <View style={styles.section}>
            <SectionLink title={trip ? `${meta.label.ko} PICK` : "타비 PICK"} onPress={p.onPressTaviPickAll} />
            {/* 여행이 있으면 그 도시 장소만 */}
            <TaviPickC region={trip ? p.city : ""} />
          </View>

          <View style={styles.section}>
            <SectionLink title="실시간 타비톡" onPress={p.onPressTaviTalk} />
            <TaviTalkC onPressPost={p.onPressTaviTalkPost} onPressTaviTalk={p.onPressTaviTalk} />
          </View>

          {p.destinations?.length > 0 && (
            <View style={styles.section}>
              <SectionLink title="추천 여행지" />
              <Slides data={p.destinations} />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  hero: { height: HERO_H, justifyContent: "space-between" },
  heroImg: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%" },
  shade: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.25)" },
  shadeBottom: { position: "absolute", left: 0, right: 0, bottom: 0, height: 200, backgroundColor: "rgba(0,0,0,0.25)" },
  logo: { fontSize: 22, lineHeight: 28, fontWeight: "700", color: colors.textWhite, paddingHorizontal: spacing.gutter, paddingTop: spacing.lg },
  heroBottom: { flexDirection: "row", alignItems: "flex-end", paddingHorizontal: spacing.gutter, paddingBottom: spacing.xxl + spacing.lg },
  cityJa: { fontSize: 14, lineHeight: 20, fontWeight: "600", color: colors.textWhite, opacity: 0.85 },
  cityKo: { fontSize: 40, lineHeight: 48, fontWeight: "700", letterSpacing: -0.8, color: colors.textWhite }, // D7 큰 숫자·제목 예외
  status: { fontSize: 14, lineHeight: 20, fontWeight: "600", color: colors.textWhite, marginTop: spacing.xs },
  weather: { alignItems: "center", gap: 2 },
  temp: { fontSize: 32, lineHeight: 40, fontWeight: "700", color: colors.textWhite },

  sheet: {
    marginTop: -spacing.xl,
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingTop: spacing.xl,
  },
  tools: { flexDirection: "row", paddingHorizontal: spacing.gutter, justifyContent: "space-between" },
  tool: { width: 72, alignItems: "center", gap: spacing.xs },
  toolIcon: { width: 52, height: 52, borderRadius: radius.lg, borderCurve: "continuous", alignItems: "center", justifyContent: "center", marginBottom: 2 },
  toolLabel: { fontSize: 12, lineHeight: 16, fontWeight: "600", color: colors.textPrimary },
  toolValue: { fontSize: 11, lineHeight: 14, fontWeight: "600", color: colors.textTertiary, fontVariant: ["tabular-nums"] },

  block: { paddingHorizontal: spacing.gutter, marginTop: spacing.xl },
  cta: { height: 52, borderRadius: radius.full, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  ctaText: { fontSize: 16, lineHeight: 24, fontWeight: "700", color: colors.textWhite },

  section: { marginTop: spacing.xxl },
  timeline: { paddingHorizontal: spacing.gutter },
  tlRow: { flexDirection: "row", minHeight: 52 },
  tlRail: { width: 20, alignItems: "center" },
  tlDot: { width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: colors.textPrimary, backgroundColor: colors.surface, marginTop: 6 },
  tlLine: { flex: 1, width: 2, backgroundColor: colors.divider, marginVertical: 2 },
  tlBody: { flex: 1, paddingLeft: spacing.md, paddingBottom: spacing.md },
  tlTime: { fontSize: 12, lineHeight: 16, fontWeight: "600", color: colors.textTertiary, fontVariant: ["tabular-nums"] },
  tlPlace: { fontSize: 16, lineHeight: 24, fontWeight: "600", color: colors.textPrimary },
  empty: { fontSize: 14, lineHeight: 20, color: colors.textTertiary },
});
