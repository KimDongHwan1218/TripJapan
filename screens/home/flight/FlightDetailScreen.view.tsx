import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { FlightDetail } from "./hooks/useFlightDetail";
import { colors, spacing, radius } from "@/styles";

type Props = {
  detail: FlightDetail | null;
  loading: boolean;
};

const AIRLINE_NAME: Record<string, string> = {
  RS: "에어서울",
  KE: "대한항공",
  OZ: "아시아나항공",
  LJ: "진에어",
  TW: "티웨이항공",
};

const BAGGAGE_POLICY: Record<string, string> = {
  RS: "무료 수하물 15kg",
  LJ: "무료 수하물 15kg",
  TW: "무료 수하물 15kg",
  KE: "무료 수하물 23kg",
  OZ: "무료 수하물 23kg",
};

export default function FlightDetailView({ detail, loading }: Props) {
  if (loading || !detail) {
    return (
      <View style={styles.center}>
        <Text>불러오는 중...</Text>
      </View>
    );
  }

  const segment =
    detail.mock || !detail.itineraries?.length
      ? {
          carrierCode: "RS",
          number: "703",
          departure: { iataCode: "ICN", at: "2026-01-24T15:20:00" },
          arrival: { iataCode: "KIX", at: "2026-01-24T17:00:00" },
          duration: "PT1H40M",
          numberOfStops: 0,
        }
      : detail.itineraries![0].segments[0];

  const airlineName = AIRLINE_NAME[segment.carrierCode] ?? segment.carrierCode;
  const baggageText = BAGGAGE_POLICY[segment.carrierCode] ?? "수하물 규정 확인 필요";

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>선택한 항공편 정보</Text>

        <View style={styles.card}>
          <Text style={styles.tripType}>편도</Text>
          <Text style={styles.route}>
            인천 {segment.departure.iataCode} → 오사카 {segment.arrival.iataCode}
          </Text>
          <Text style={styles.airline}>{airlineName}</Text>
          <Text style={styles.baggage}>{baggageText}</Text>

          <View style={styles.timeRow}>
            <Text style={styles.time}>{formatTime(segment.departure.at)}</Text>
            <Text style={styles.plane}>✈︎</Text>
            <Text style={styles.time}>{formatTime(segment.arrival.at)}</Text>
          </View>

          <View style={styles.subInfoRow}>
            <Text style={styles.date}>{formatDate(segment.departure.at)}</Text>
            <Text style={styles.duration}>직항 · {formatDuration(segment.duration)}</Text>
            <Text style={styles.date}>{formatDate(segment.arrival.at)}</Text>
          </View>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>성인 1인</Text>
          <Text style={styles.priceValue}>{Number(detail.price.total).toLocaleString()} 원</Text>
        </View>

        <View style={styles.noticeBox}>
          <Text style={styles.noticeTitle}>항공사 운임 및 수하물 규정</Text>
          <Text style={styles.noticeText}>
            · 항공권 운임은 예약 시점에 따라 변동될 수 있습니다.{"\n"}
            · 무료 수하물은 항공사 및 운임 조건에 따라 상이할 수 있습니다.{"\n"}
            · 특가 운임의 경우 무료 수하물이 포함되지 않을 수 있습니다.{"\n"}
            · 정확한 규정은 예약 진행 단계에서 최종 확인 바랍니다.
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.bookButton}>
        <Text style={styles.bookText}>예약하기</Text>
      </TouchableOpacity>
    </View>
  );
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}.${d.getDate()}`;
}

function formatDuration(duration: string) {
  const m = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!m) return duration;
  return `${m[1] ? `${m[1]}시간 ` : ""}${m[2] ?? ""}분`.trim();
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: 140 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12, color: colors.textPrimary },

  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, marginBottom: 20 },
  tripType: { fontSize: 13, color: colors.primary, marginBottom: 6 },
  route: { fontSize: 16, fontWeight: "700", marginBottom: 8, color: colors.textPrimary },
  airline: { fontSize: 14, fontWeight: "600", color: colors.textPrimary },
  baggage: { fontSize: 13, color: colors.success, marginBottom: 16 },

  timeRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  time: { fontSize: 22, fontWeight: "700", color: colors.textPrimary },
  plane: { fontSize: 18, color: colors.textTertiary },

  subInfoRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  date: { fontSize: 12, color: colors.textTertiary },
  duration: { fontSize: 12, color: colors.textSecondary },

  priceRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  priceLabel: { fontSize: 14, color: colors.textSecondary },
  priceValue: { fontSize: 20, fontWeight: "700", color: colors.textPrimary },

  noticeBox: { backgroundColor: colors.backgroundSubtle, padding: 14, borderRadius: radius.md },
  noticeTitle: { fontSize: 14, fontWeight: "700", marginBottom: 6, color: colors.textPrimary },
  noticeText: { fontSize: 12, color: colors.textSecondary, lineHeight: 18 },

  bookButton: {
    position: "absolute",
    bottom: 24,
    left: spacing.md,
    right: spacing.md,
    backgroundColor: colors.strongbutton,
    paddingVertical: 16,
    borderRadius: radius.pill,
    alignItems: "center",
  },
  bookText: { color: colors.textWhite, fontSize: 16, fontWeight: "700" },
});
