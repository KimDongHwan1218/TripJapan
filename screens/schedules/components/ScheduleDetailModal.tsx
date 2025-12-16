import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useTrip } from "@/contexts/TripContext";
import TimePicker from "./TimePicker";

type Props = {
  visible: boolean;
  onClose: () => void;
  plan?: any | null;
  tripDayId: number;
};

export default function ScheduleDetailModal({
  visible,
  onClose,
  plan,
  tripDayId,
}: Props) {
  const { addSchedule, updateSchedule } = useTrip();

  const [activity, setActivity] = useState("");
  const [notes, setNotes] = useState("");

  const [ampm, setAmpm] = useState("AM");
  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("00");

  useEffect(() => {
    if (plan) {
      setActivity(plan.activity || "");
      setNotes(plan.notes || "");

      if (plan.time) {
        const [h, m] = plan.time.split(":");
        let hh = parseInt(h);

        if (hh >= 12) {
          setAmpm("PM");
          setHour((hh === 12 ? 12 : hh - 12).toString().padStart(2, "0"));
        } else {
          setAmpm("AM");
          setHour((hh === 0 ? 12 : hh).toString().padStart(2, "0"));
        }

        setMinute(m);
      }
    } else {
      setActivity("");
      setNotes("");
      setAmpm("AM");
      setHour("12");
      setMinute("00");
    }
  }, [plan]);

  const convertTo24 = useCallback(() => {
    let h = parseInt(hour);

    if (ampm === "AM") {
      if (h === 12) h = 0;
    } else {
      if (h !== 12) h = h + 12;
    }

    return `${String(h).padStart(2, "0")}:${minute}`;
  }, [ampm, hour, minute]);

  const handleSave = async () => {
    const time24 = convertTo24();

    if (plan) {
      await updateSchedule(plan.id, {
        activity,
        notes,
        time: time24,
      });
    } else {
      if (activity.trim()) {
        await addSchedule(tripDayId, {
          activity,
          notes,
          time: time24,
        });
      }
    }

    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          <Text style={styles.title}>
            {plan ? "일정 수정" : "일정 추가"}
          </Text>

          <TimePicker
            ampm={ampm}
            hour={hour}
            minute={minute}
            onChangeAmpm={setAmpm}
            onChangeHour={setHour}
            onChangeMinute={setMinute}
          />

          <TextInput
            style={styles.input}
            placeholder="활동 제목"
            value={activity}
            onChangeText={setActivity}
          />

          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="메모"
            multiline
            value={notes}
            onChangeText={setNotes}
          />

          {/* 확인 버튼 */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveText}>확인</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  container: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  saveButton: {
    marginTop: 16,
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  saveText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
