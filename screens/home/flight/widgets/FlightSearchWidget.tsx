import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

type Props = {
  onPress: () => void;
};

export default function FlightSearchWidget({ onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>항공권 검색</Text>
      <Text style={styles.desc}>
        전 세계 항공권을 한 번에 비교해보세요
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#000",
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  desc: {
    color: "#ccc",
    marginTop: 6,
  },
});
