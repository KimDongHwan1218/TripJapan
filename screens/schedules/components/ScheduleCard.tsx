import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Schedule } from "@/contexts/TripContext";
import { colors, spacing, radius } from "@/styles";

type Props = {
  item: Schedule;
  onEdit: (item: Schedule) => void;
};

export default function ScheduleCard({ item, onEdit }: Props) {
  return (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.time}>{item.time || "시간 없음"}</Text>
        <Text style={styles.activity}>{item.activity}</Text>
        {item.notes ? <Text style={styles.notes}>{item.notes}</Text> : null}
      </View>

      <TouchableOpacity onPress={() => onEdit(item)} style={styles.editButton}>
        <Ionicons name="pencil" size={14} color={colors.textWhite} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
    borderRadius: radius.md,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },
  time: { fontSize: 14, color: colors.textSecondary },
  activity: { fontSize: 16, fontWeight: "bold", color: colors.textPrimary },
  notes: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: radius.lg,
    backgroundColor: colors.strongbutton,
    justifyContent: "center",
    alignItems: "center",
  },
});
