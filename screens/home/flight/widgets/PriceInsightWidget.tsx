import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function PriceInsightWidget() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>가격 인사이트</Text>

      {/* 나중에 차트/캘린더 들어갈 자리 */}
      <Text style={styles.text}>
        이번 달은 평균보다 항공권이 저렴해요
      </Text>
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
    marginBottom: 6,
  },
  text: {
    fontSize: 14,
  },
});
