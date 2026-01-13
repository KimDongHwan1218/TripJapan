import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function CheapestFlightWidget() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>지금 가장 저렴한 항공권</Text>

      {/* TODO: API 붙이면 여기만 교체 */}
      <Text style={styles.route}>서울 → 도쿄</Text>
      <Text style={styles.price}>₩320,000</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  title: {
    fontWeight: "600",
    marginBottom: 8,
  },
  route: {
    fontSize: 14,
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 4,
  },
});
