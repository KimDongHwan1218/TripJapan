import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "@/styles/colors";
import { spacing } from "@/styles/spacing";

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
      {/* <Text style={styles.title}>나의 여행 일정 보기</Text> */}
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
    paddingVertical: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: spacing.sm,
  },
  button: {
    backgroundColor: colors.strongbutton,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: 8,
  },
  buttonText: {
    color: colors.textWhite,
    fontWeight: "bold",
  },
});
