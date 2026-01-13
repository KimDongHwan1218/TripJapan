import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlightStackParamList } from "@/navigation/FlightStackNavigator";

type Props = NativeStackScreenProps<
  FlightStackParamList,
  "FlightHome"
>;

export default function FlightHomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("FlightWebView")}
      >
        <Text style={styles.title}>항공권 검색</Text>
        <Text style={styles.desc}>
          전 세계 항공권을 한 번에 비교해보세요
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  card: {
    padding: 24,
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
    marginTop: 8,
  },
});
