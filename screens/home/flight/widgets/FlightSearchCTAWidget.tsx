import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

type Props = {
  onPress: () => void;
};

export default function FlightSearchCTAWidget({ onPress }: Props) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>항공권 전체 검색하기</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#000",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontWeight: "600",
  },
});
