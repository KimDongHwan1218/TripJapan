import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FlightStackParamList } from "@/navigation/FlightStackNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type NavigationProp = NativeStackNavigationProp<
  FlightStackParamList,
  "FlightDetail"
>;

type Flight = {
  offerId: string;
  airline: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  currency: string;
};

type Props = {
  flight: Flight;
};

export default function FlightResultCard({ flight}: Props) {
  const navigation = useNavigation<NavigationProp>();

  const onPress = () => {
    navigation.navigate("FlightDetail", {
      offerId: flight.offerId
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* 항공사 */}
      <Text style={styles.airline}>{flight.airline}</Text>

      {/* 시간 정보 */}
      <View style={styles.timeRow}>
        <Text style={styles.time}>{formatTime(flight.departureTime)}</Text>
        <Text style={styles.arrow}>→</Text>
        <Text style={styles.time}>{formatTime(flight.arrivalTime)}</Text>
      </View>

      {/* 소요 시간 */}
      <Text style={styles.duration}>
        소요 시간 {formatDuration(flight.duration)}
      </Text>

      {/* 가격 */}
      <View style={styles.priceRow}>
        <Text style={styles.price}>
          {flight.price.toLocaleString()} {flight.currency}
        </Text>
        <Text style={styles.detailText}>자세히 보기</Text>
      </View>
    </TouchableOpacity>
  );
}

/**
 * ======================================================
 * Utils
 * ======================================================
 */

function formatTime(iso: string) {
  const date = new Date(iso);
  const hh = date.getHours().toString().padStart(2, "0");
  const mm = date.getMinutes().toString().padStart(2, "0");
  return `${hh}:${mm}`;
}

function formatDuration(duration: string) {
  // PT10H30M → 10시간 30분
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return duration;

  const h = match[1] ? `${match[1]}시간 ` : "";
  const m = match[2] ? `${match[2]}분` : "";

  return `${h}${m}`.trim();
}

/**
 * ======================================================
 * Styles
 * ======================================================
 */
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2
  },
  airline: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center"
  },
  time: {
    fontSize: 20,
    fontWeight: "700"
  },
  arrow: {
    marginHorizontal: 8,
    fontSize: 18
  },
  duration: {
    marginTop: 6,
    fontSize: 13,
    color: "#6B7280"
  },
  priceRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  price: {
    fontSize: 18,
    fontWeight: "700"
  },
  detailText: {
    fontSize: 13,
    color: "#2563EB"
  }
});
