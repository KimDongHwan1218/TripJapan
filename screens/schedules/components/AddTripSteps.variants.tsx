import React from "react";
import { View, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";
import { Calendar } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import Text from "@/components/ui/Text";
import { colors, radius, spacing } from "@/styles";
import { CITY_META, CITY_AREAS, type TripCity } from "@/constants/cities";

// 여행 만들기(AddTripModal) 시안 B·C의 단계별 본문. 상태·제출은 AddTripModal이 그대로 갖고, 여기는 모양만.
//  B "사진 카드 + 빠른 기간": 도시를 사진 카드 2열로, 날짜는 한국어 달력 + "2박3일" 같은 기간 칩
//  C "지역별 목록 + 안내형 달력": 도시를 권역(간토·간사이…)별 목록으로, 날짜는 큰 요약 + "출발일/돌아오는 날을 골라주세요" 안내

const POPULAR: TripCity[] = ["Tokyo", "Osaka", "Kyoto", "Fukuoka", "Sapporo", "Okinawa"];
const ORDERED: TripCity[] = [...POPULAR, ...(Object.keys(CITY_META) as TripCity[]).filter((c) => !POPULAR.includes(c))];
const WEEK = ["일", "월", "화", "수", "목", "금", "토"];

type CityStepProps = { selected: TripCity | null; onSelect: (c: TripCity) => void; title: string };

export function CityStepB({ selected, onSelect, title }: CityStepProps) {
  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.cardGrid}>
        {ORDERED.map((key) => {
          const c = CITY_META[key];
          const on = selected === key;
          return (
            <TouchableOpacity key={key} style={[styles.cityCard, on && styles.cityCardOn]} onPress={() => onSelect(key)} activeOpacity={0.85}>
              <Image source={c.image} style={styles.cityImg} resizeMode="cover" />
              <View style={styles.cityShade} />
              <View style={styles.cityText}>
                <Text style={styles.cityKo}>{c.label.ko}</Text>
                <Text style={styles.cityJa}>{c.label.ja}</Text>
              </View>
              {on && (
                <View style={styles.check}>
                  <Ionicons name="checkmark" size={16} color={colors.textPrimary} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

export function CityStepC({ selected, onSelect, title }: CityStepProps) {
  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>{title}</Text>
      {CITY_AREAS.map((area) => (
        <View key={area.label} style={styles.area}>
          <Text style={styles.areaLabel}>{area.label}</Text>
          {area.cities.map((key) => {
            const c = CITY_META[key];
            const on = selected === key;
            return (
              <TouchableOpacity key={key} style={styles.row} onPress={() => onSelect(key)} activeOpacity={0.7}>
                <Image source={c.image} style={styles.rowImg} resizeMode="cover" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowKo}>{c.label.ko}</Text>
                  <Text style={styles.rowJa}>{c.label.ja}</Text>
                </View>
                <Ionicons name={on ? "radio-button-on" : "radio-button-off"} size={24} color={on ? colors.textPrimary : colors.neutral300} />
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </ScrollView>
  );
}

type DateStepProps = {
  cityKo: string;
  start: string;
  end: string;
  marks: any;
  minDate: string;
  onDayPress: (d: string) => void;
  onSetRange: (start: string, end: string) => void;
};

function addDays(ymd: string, n: number) {
  const d = new Date(`${ymd}T00:00:00`);
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function fmtParts(ymd: string) {
  const d = new Date(`${ymd}T00:00:00`);
  return { md: `${d.getMonth() + 1}.${d.getDate()}`, w: WEEK[d.getDay()] };
}
// 큰 숫자(월.일) + 작은 요일 — 한 덩어리로 키우면 "10.10 (토)"가 두 줄로 깨졌음(실기기)
function BigDate({ ymd }: { ymd: string }) {
  if (!ymd) return <Text style={[styles.sumDate, styles.sumEmpty]}>—</Text>;
  const { md, w } = fmtParts(ymd);
  return (
    <Text style={styles.sumDate} numberOfLines={1}>
      {md}
      <Text style={styles.sumWeek}> {w}</Text>
    </Text>
  );
}
function nights(start: string, end: string) {
  if (!start || !end) return null;
  return Math.round((new Date(`${end}T00:00:00`).getTime() - new Date(`${start}T00:00:00`).getTime()) / 86400000);
}

// 달력 — 한국어는 config/calendarLocale(전역)에서. 시안에선 월 표기만 "2026년 10월"로, 화살표·오늘 색을 무채색 쪽으로
function KoCalendar({ marks, minDate, onDayPress }: { marks: any; minDate: string; onDayPress: (d: string) => void }) {
  return (
    <Calendar
      markingType="period"
      markedDates={marks}
      minDate={minDate}
      monthFormat="yyyy년 M월"
      onDayPress={(day: { dateString: string }) => onDayPress(day.dateString)}
      theme={{
        arrowColor: colors.textPrimary,
        todayTextColor: colors.primaryHover,
        textDayFontWeight: "500",
        textDayFontSize: 16,
        textMonthFontWeight: "700",
        textMonthFontSize: 18,
        textSectionTitleColor: colors.textTertiary,
      }}
    />
  );
}

export function DateStepB({ cityKo, start, end, marks, minDate, onDayPress, onSetRange }: DateStepProps) {
  const n = nights(start, end);
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>{`${cityKo}, 며칠 다녀오세요?`}</Text>
        {/* 기간 칩 — 출발일을 아직 안 골랐으면 오늘부터 */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {[0, 1, 2, 3, 4].map((k) => {
            const on = n === k;
            return (
              <TouchableOpacity
                key={k}
                style={[styles.chip, on && styles.chipOn]}
                onPress={() => {
                  const s = start || minDate;
                  onSetRange(s, addDays(s, k));
                }}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, on && styles.chipTextOn]}>{k === 0 ? "당일치기" : `${k}박${k + 1}일`}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      <KoCalendar marks={marks} minDate={minDate} onDayPress={onDayPress} />
    </ScrollView>
  );
}

export function DateStepC({ cityKo, start, end, marks, minDate, onDayPress }: DateStepProps) {
  const n = nights(start, end);
  const guide = !start ? "출발하는 날을 골라주세요" : !end ? "돌아오는 날을 골라주세요" : n === 0 ? "당일치기" : `${n}박 ${n! + 1}일`;
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.titleSmall}>{cityKo} 여행</Text>
        <View style={styles.summary}>
          <View style={styles.sumCol}>
            <Text style={styles.sumLabel}>출발</Text>
            <BigDate ymd={start} />
          </View>
          <Ionicons name="arrow-forward" size={20} color={colors.neutral500} />
          <View style={[styles.sumCol, { alignItems: "flex-end" }]}>
            <Text style={styles.sumLabel}>귀국</Text>
            <BigDate ymd={end} />
          </View>
        </View>
        <Text style={[styles.guide, start && end ? styles.guideDone : null]}>{guide}</Text>
      </View>
      <KoCalendar marks={marks} minDate={minDate} onDayPress={onDayPress} />
    </ScrollView>
  );
}

export function tripLengthLabel(start: string, end: string) {
  const n = nights(start, end);
  if (n === null) return "";
  return n === 0 ? "당일치기" : `${n}박${n + 1}일`;
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.gutter, paddingTop: spacing.md, paddingBottom: spacing.lg },
  title: { fontSize: 24, lineHeight: 32, fontWeight: "700", letterSpacing: -0.5, color: colors.textPrimary, marginBottom: spacing.xl },
  titleSmall: { fontSize: 16, lineHeight: 24, fontWeight: "600", color: colors.textSecondary },

  cardGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  cityCard: { width: "47%", flexGrow: 1, height: 120, borderRadius: radius.lg, borderCurve: "continuous", overflow: "hidden", justifyContent: "flex-end", borderWidth: 3, borderColor: "transparent" },
  cityCardOn: { borderColor: colors.textPrimary },
  cityImg: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%" },
  cityShade: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.3)" },
  cityText: { padding: spacing.md },
  cityKo: { fontSize: 18, lineHeight: 24, fontWeight: "700", color: colors.textWhite },
  cityJa: { fontSize: 12, lineHeight: 16, fontWeight: "500", color: colors.textWhite, opacity: 0.85 },
  check: { position: "absolute", top: spacing.sm, right: spacing.sm, width: 26, height: 26, borderRadius: 13, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" },

  area: { marginBottom: spacing.lg },
  areaLabel: { fontSize: 13, lineHeight: 18, fontWeight: "700", color: colors.textTertiary, marginBottom: spacing.xs },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md, minHeight: 64, paddingVertical: spacing.xs },
  rowImg: { width: 48, height: 48, borderRadius: radius.sm, borderCurve: "continuous" },
  rowKo: { fontSize: 16, lineHeight: 24, fontWeight: "600", color: colors.textPrimary },
  rowJa: { fontSize: 12, lineHeight: 16, color: colors.textTertiary },

  chips: { gap: spacing.sm },
  chip: { height: 40, paddingHorizontal: spacing.lg, borderRadius: radius.full, borderWidth: 1, borderColor: colors.border, justifyContent: "center" },
  chipOn: { borderColor: colors.textPrimary, borderWidth: 1.5 },
  chipText: { fontSize: 15, lineHeight: 22, fontWeight: "600", color: colors.textSecondary },
  chipTextOn: { color: colors.textPrimary, fontWeight: "700" },


  summary: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginTop: spacing.lg },
  sumCol: { gap: 2 },
  sumLabel: { fontSize: 12, lineHeight: 16, fontWeight: "600", color: colors.textTertiary },
  sumDate: { fontSize: 32, lineHeight: 40, fontWeight: "700", letterSpacing: -0.5, color: colors.textPrimary, fontVariant: ["tabular-nums"] },
  sumWeek: { fontSize: 16, fontWeight: "600", color: colors.textSecondary },
  sumEmpty: { color: colors.neutral300 },
  guide: { fontSize: 14, lineHeight: 20, fontWeight: "600", color: colors.textSecondary, marginTop: spacing.md },
  guideDone: { color: colors.textPrimary },
});
