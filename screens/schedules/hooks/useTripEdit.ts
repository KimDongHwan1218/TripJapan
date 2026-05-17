import { useState } from "react";
import { Alert } from "react-native";
import { useTrip } from "@/contexts/TripContext";
import type { Schedule } from "@/contexts/TripContext";

export function useTripEdit(tripDayId: number) {
  const { schedules, addSchedule, updateSchedule, deleteSchedule } = useTrip();
  const [saving, setSaving] = useState(false);

  const daySchedules = schedules
    .filter((s) => s.trip_day_id === tripDayId)
    .sort((a, b) => (a.time ?? "").localeCompare(b.time ?? ""));

  async function handleAdd(payload: {
    activity: string;
    time: string;
    notes?: string;
    place_name?: string;
    latitude?: number;
    longitude?: number;
    place_id?: string;
  }) {
    setSaving(true);
    try {
      await addSchedule(tripDayId, payload);
    } catch {
      Alert.alert("오류", "일정 추가에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(scheduleId: number, payload: Partial<Schedule>) {
    setSaving(true);
    try {
      await updateSchedule(scheduleId, payload);
    } catch {
      Alert.alert("오류", "일정 수정에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(scheduleId: number) {
    Alert.alert("일정 삭제", "이 일정을 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          setSaving(true);
          try {
            await deleteSchedule(scheduleId);
          } catch {
            Alert.alert("오류", "일정 삭제에 실패했습니다.");
          } finally {
            setSaving(false);
          }
        },
      },
    ]);
  }

  return { daySchedules, saving, handleAdd, handleUpdate, handleDelete };
}
