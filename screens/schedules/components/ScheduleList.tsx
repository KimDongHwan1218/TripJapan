import React from "react";
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from "react-native";
import ScheduleCard from "./ScheduleCard";

type Props = {
  tripDays: any[];
  schedulesByDay: Record<string, any[]>;
  onEdit: (plan: any) => void;
  onAdd: (dayId: number) => void;
};

export default function ScheduleList({ tripDays, schedulesByDay, onEdit, onAdd }: Props) {
  return (
    <FlatList
      data={tripDays}
      horizontal
      keyExtractor={(item) => item.id.toString()}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 12 }}
      renderItem={({ item }) => (
        <View style={styles.dayBox}>
          <Text style={styles.dayText}>{item.date}</Text>

          {(schedulesByDay[item.id] || []).map((plan) => (
            <ScheduleCard key={plan.id} item={plan} onEdit={onEdit} />
          ))}

          <TouchableOpacity style={styles.addButton} onPress={() => onAdd(item.id)}>
            <Text style={styles.addText}>+ 일정 추가</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  dayBox: {
    width: 260,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 2,
    marginRight: 14,
  },
  dayText: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },
  addButton: {
    marginTop: 12,
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    alignItems: "center",
  },
  addText: { color: "#fff", fontWeight: "bold" },
});
