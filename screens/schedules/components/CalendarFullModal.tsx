import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useTrip } from "@/contexts/TripContext";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelectDay: (dayIndex: number) => void;   // 날짜 선택 → 스크롤 이동
  openAddModal: (tripDayId: number) => void; // 일정 추가 모달 열기
};

export default function CalendarFullModal({
  visible,
  onClose,
  onSelectDay,
  openAddModal,
}: Props) {
  const { tripDays } = useTrip();

  // 캘린더 마킹 데이터 구성
  const marked: any = {};
  tripDays.forEach((d) => {
    marked[d.date] = { marked: true };
  });

  const handleDayPress = (day: any) => {
    const index = tripDays.findIndex((t) => t.date === day.dateString);
    if (index !== -1) {
      onSelectDay(index);
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.close}>닫기</Text>
        </TouchableOpacity>
        <Text style={styles.title}>전체 일정 달력</Text>
        <View style={{ width: 50 }} />
      </View>

      <Calendar
        onDayPress={handleDayPress}
        markedDates={marked}
        theme={{
          todayTextColor: "#007AFF",
          selectedDayBackgroundColor: "#007AFF",
        }}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          if (tripDays.length > 0) openAddModal(tripDays[0].id);
        }}
      >
        <Text style={styles.addText}>+ 일정 추가</Text>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  close: { fontSize: 16, color: "#007AFF" },
  title: { fontSize: 18, fontWeight: "bold" },

  addButton: {
    marginTop: "auto",
    marginBottom: 40,
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: "#007AFF",
    borderRadius: 12,
    alignItems: "center",
  },
  addText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
