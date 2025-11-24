import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Plan = {
  time: string;
  title: string;
  detail: string;
};

type Props = {
  plan: Plan;
  date: string;
  onPress: () => void;
};

export default function ScheduleCard({ plan, onPress }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTime}>{plan.time}</Text>
        <Text style={styles.cardTitle}>{plan.title}</Text>
        <TouchableOpacity style={styles.detailButton} onPress={onPress}>
          <Ionicons name="chevron-forward" size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>
      <Text style={styles.cardDetail}>{plan.detail}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  cardTime: { fontWeight: "bold", marginRight: 12, fontSize: 16 },
  cardTitle: { fontSize: 16, flex: 1 },
  cardDetail: { fontSize: 14, color: "#555", marginTop: 4 },
  detailButton: { paddingHorizontal: 4 },
});
