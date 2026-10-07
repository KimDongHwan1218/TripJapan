import { View, FlatList, StyleSheet } from "react-native";
import Text from "@/components/ui/Text";
import { useFlightHotDeals } from "../hooks/useFlightHotDeals";
import { colors, radius } from "@/styles";

export default function FlightHotDeals() {
  const { deals } = useFlightHotDeals();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔥 특가 항공권</Text>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={deals}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.route}>
              {item.origin} → {item.destination}
            </Text>
            <Text style={styles.price}>
              ₩{item.value.toLocaleString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 16
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12
  },
  card: {
    backgroundColor: colors.surface,
    padding: 16,
    marginRight: 12,
    borderRadius: radius.md, borderCurve: "continuous",
    elevation: 2,
    width: 150
  },
  route: {
    fontWeight: "600"
  },
  price: {
    marginTop: 8,
    color: colors.info,
    fontWeight: "700"
  }
});
