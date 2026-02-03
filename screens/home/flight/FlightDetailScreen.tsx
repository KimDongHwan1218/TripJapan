import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";

import { FlightStackParamList } from "@/navigation/FlightStackNavigator";
import { ENV } from "@/config/env";

const API_BASE = ENV.API_BASE_URL;

type RouteProps = RouteProp<
  FlightStackParamList,
  "FlightDetail"
>;

type Segment = {
  carrierCode: string;
  number: string;
  departure: { iataCode: string; at: string };
  arrival: { iataCode: string; at: string };
  duration: string;
  numberOfStops: number;
};

type FlightDetail = {
  offerId: string;
  price: {
    total: string;
    currency: string;
  };
  itineraries?: { segments: Segment[] }[];
  mock?: boolean;
};

const AIRLINE_NAME: Record<string, string> = {
  RS: "에어서울",
  KE: "대한항공",
  OZ: "아시아나항공",
  LJ: "진에어",
  TW: "티웨이항공"
};

const BAGGAGE_POLICY: Record<string, string> = {
  RS: "무료 수하물 15kg",
  LJ: "무료 수하물 15kg",
  TW: "무료 수하물 15kg",
  KE: "무료 수하물 23kg",
  OZ: "무료 수하물 23kg"
};

export default function FlightDetailScreen() {
  const { params } = useRoute<RouteProps>();
  const navigation = useNavigation();
  const { offerId } = params;

  const [detail, setDetail] = useState<FlightDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetail();
  }, []);

  const fetchDetail = async () => {
    try {
      const res = await fetch(`${API_BASE}/flights/offer/${offerId}`);
      const json = await res.json();
      setDetail(json);
    } catch (e) {
      console.error("flight detail fetch failed", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !detail) {
    return (
      <View style={styles.center}>
        <Text>불러오는 중...</Text>
      </View>
    );
  }

  console.log("detail", detail);
  const segment: Segment =
    detail.mock || !detail.itineraries?.length
      ? {
          carrierCode: "RS",
          number: "703",
          departure: { iataCode: "ICN", at: "2026-01-24T15:20:00" },
          arrival: { iataCode: "KIX", at: "2026-01-24T17:00:00" },
          duration: "PT1H40M",
          numberOfStops: 0
        }
      : detail.itineraries[0].segments[0];

  const airlineName = AIRLINE_NAME[segment.carrierCode] ?? segment.carrierCode;
  const baggageText = BAGGAGE_POLICY[segment.carrierCode] ?? "수하물 규정 확인 필요";

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        <Text style={styles.sectionTitle}>선택한 항공편 정보</Text>

        {/* 항공편 카드 */}
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
            <Text style={styles.duration}>
              직항 · {formatDuration(segment.duration)}
            </Text>
            <Text style={styles.date}>{formatDate(segment.arrival.at)}</Text>
          </View>
        </View>

        {/* 가격 */}
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>성인 1인</Text>
          <Text style={styles.priceValue}>
            {Number(detail.price.total).toLocaleString()} 원
          </Text>
        </View>

        {/* 규정 안내 */}
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

/* ================= Utils ================= */

function formatTime(iso: string) {
  const d = new Date(iso);
  return `${d.getHours().toString().padStart(2, "0")}:${d
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
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

/* ================= Styles ================= */

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 140 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20
  },

  tripType: { fontSize: 13, color: "#2563EB", marginBottom: 6 },
  route: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
  airline: { fontSize: 14, fontWeight: "600" },
  baggage: { fontSize: 13, color: "#059669", marginBottom: 16 },

  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },

  time: { fontSize: 22, fontWeight: "700" },
  plane: { fontSize: 18, color: "#6B7280" },

  subInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8
  },

  date: { fontSize: 12, color: "#6B7280" },
  duration: { fontSize: 12, color: "#374151" },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16
  },

  priceLabel: { fontSize: 14 },
  priceValue: { fontSize: 20, fontWeight: "700" },

  noticeBox: {
    backgroundColor: "#F9FAFB",
    padding: 14,
    borderRadius: 12
  },

  noticeTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6
  },

  noticeText: { fontSize: 12, color: "#374151", lineHeight: 18 },

  bookButton: {
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center"
  },

  bookText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" }
});
