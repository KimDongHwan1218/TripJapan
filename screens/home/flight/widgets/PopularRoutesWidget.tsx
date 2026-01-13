import React from "react";
import { View, Text, StyleSheet } from "react-native";

const DUMMY_ROUTES = [
  { route: "서울 → 오사카", price: "₩280,000" },
  { route: "서울 → 후쿠오카", price: "₩250,000" },
];

export default function PopularRoutesWidget() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>인기 노선</Text>

      {DUMMY_ROUTES.map((item, idx) => (
        <View key={idx} style={styles.row}>
          <Text>{item.route}</Text>
          <Text>{item.price}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  title: {
    fontWeight: "600",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
});
