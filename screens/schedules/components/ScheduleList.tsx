import React from "react";
import { View, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import Text from "@/components/ui/Text";
import ScheduleCard from "./ScheduleCard";
import { colors, radius } from "@/styles";

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
    backgroundColor: colors.surface,
    borderRadius: radius.md, borderCurve: "continuous",
    elevation: 2,
    marginRight: 16,
  },
  dayText: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 12,
  },
  addButton: {
    marginTop: 12,
    padding: 12,
    backgroundColor: colors.info,
    borderRadius: radius.sm, borderCurve: "continuous",
    alignItems: "center",
  },
  addText: { color: colors.textWhite, fontWeight: "700" },
});
