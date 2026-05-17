import { View, Text, FlatList, StyleSheet } from "react-native";
import { useFlightHotDeals } from "../hooks/useFlightHotDeals";

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
    marginBottom: 10
  },
  card: {
    backgroundColor: "#FFF",
    padding: 14,
    marginRight: 12,
    borderRadius: 14,
    elevation: 2,
    width: 150
  },
  route: {
    fontWeight: "600"
  },
  price: {
    marginTop: 6,
    color: "#2563EB",
    fontWeight: "700"
  }
});
