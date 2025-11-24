import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function TomyTrip() {
  const navigation = useNavigation<any>();

  const goToDetail = () => {
    navigation.navigate("일정", {
      screen: "SchedulingScreen",
      params: { date: "2025-10-09" },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>나의 여행 일정 보기</Text>
      <TouchableOpacity style={styles.button} onPress={goToDetail}>
        <Text style={styles.buttonText}>여행 일정 보러가기 ✈️</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
