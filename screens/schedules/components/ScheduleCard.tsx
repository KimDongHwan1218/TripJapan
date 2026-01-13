import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type Props = {
  item: any;
  status: string;
  onEdit: (plan: any) => void; // ← 부모(SchedulingScreen)에서 전달됨
};

type Plan = {
  time: string;
  title: string;
  detail: string;
};

export default function ScheduleCard({ item, status, onEdit }: Props) {
  return (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.time}>{item.time || "시간 없음"}</Text>
        <Text style={styles.activity}>{item.activity}</Text>
        {item.notes ? <Text style={styles.notes}>{item.notes}</Text> : null}
      </View>

      <TouchableOpacity style={styles.editButton} onPress={() => onEdit(item)}>
        <Text style={styles.editText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },
  time: { fontSize: 14, color: "#777" },
  activity: { fontSize: 16, fontWeight: "bold" },
  notes: { fontSize: 13, color: "#555", marginTop: 4 },

  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  editText: { color: "white", fontSize: 22, marginTop: -4 },
});
