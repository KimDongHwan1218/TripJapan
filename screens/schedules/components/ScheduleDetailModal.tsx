import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useTrip } from "@/contexts/TripContext";

type Props = {
  visible: boolean;
  onClose: () => void;
  plan?: any | null;        // 일정 수정 모드
  tripDayId: number;        // 일정이 소속될 날짜
};

export default function ScheduleDetailModal({
  visible,
  onClose,
  plan,
  tripDayId,
}: Props) {
  const { addSchedule, updateSchedule, deleteSchedule } = useTrip();

  const [activity, setActivity] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (plan) {
      setActivity(plan.activity || "");
      setTime(plan.time || "");
      setNotes(plan.notes || "");
    } else {
      setActivity("");
      setTime("");
      setNotes("");
    }
  }, [plan]);

  const handleSave = async () => {
    if (!activity.trim()) return;

    if (plan) {
      await updateSchedule(plan.id, { activity, time, notes });
    } else {
      await addSchedule(tripDayId, { activity, time, notes });
    }
    onClose();
  };

  const handleDelete = async () => {
    if (plan) {
      await deleteSchedule(plan.id);
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>
            {plan ? "일정 수정" : "일정 추가"}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="활동 제목"
            value={activity}
            onChangeText={setActivity}
          />

          <TextInput
            style={styles.input}
            placeholder="시간 (예: 14:00)"
            value={time}
            onChangeText={setTime}
          />

          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="메모"
            multiline
            value={notes}
            onChangeText={setNotes}
          />

          <View style={styles.row}>
            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>저장</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancel} onPress={onClose}>
              <Text style={styles.cancelText}>닫기</Text>
            </TouchableOpacity>
          </View>

          {plan && (
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Text style={styles.deleteText}>삭제하기</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  button: {
    flex: 1,
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 6,
  },
  cancel: {
    flex: 1,
    backgroundColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginLeft: 6,
  },
  buttonText: { color: "white", fontWeight: "bold" },
  cancelText: { color: "#333", fontWeight: "bold" },
  deleteButton: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#ff4d4d",
    alignItems: "center",
    borderRadius: 10,
  },
  deleteText: { color: "white", fontWeight: "bold" },
});
