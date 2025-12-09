import React, { useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useTrip } from "@/contexts/TripContext";

import ScheduleCard from "./components/ScheduleCard";
import ScheduleDetailModal from "./components/ScheduleDetailModal";
import CalendarFullModal from "./components/CalendarFullModal";
import { Schedule } from "@/contexts/TripContext";

export default function SchedulingScreen() {
  const { tripDays, schedulesByDay } = useTrip();

  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [selectedDayId, setSelectedDayId] = useState<number | null>(null);

  const [calendarVisible, setCalendarVisible] = useState(false);

  const dayListRef = useRef<FlatList>(null);

  // 일정 수정
  const openEditModal = (plan: any) => {
    setSelectedPlan(plan);
    setSelectedDayId(plan.trip_day_id);
    setDetailVisible(true);
  };

  // 일정 추가
  const openAddModal = (tripDayId: number) => {
    setSelectedPlan(null);
    setSelectedDayId(tripDayId);
    setDetailVisible(true);
  };

  // 달력에서 날짜 선택 → 해당 날짜로 스크롤
  const scrollToDay = (index: number) => {
    dayListRef.current?.scrollToIndex({ index, animated: true });
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>여행 일정</Text>
        <TouchableOpacity onPress={() => setCalendarVisible(true)}>
          <Text style={styles.calendarIcon}>📅</Text>
        </TouchableOpacity>
      </View>

      {/* 날짜 수평 스크롤 */}
      <FlatList
        ref={dayListRef}
        data={schedulesByDay}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.dayBox}>
            <Text style={styles.dayText}>{item.date}</Text>

            {/* 일정 목록 */}
            <View style={{ marginTop: 10 }}>
              {item.schedules.map((plan: Schedule) => (
                <ScheduleCard key={plan.id} item={plan} onEdit={openEditModal} />
              ))}

              {/* 일정 추가 버튼 */}
              <TouchableOpacity
                style={styles.addSmall}
                onPress={() => openAddModal(item.id)}
              >
                <Text style={styles.addSmallText}>+ 일정 추가</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* 화면 하단 + 버튼 */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          if (tripDays.length > 0) openAddModal(tripDays[0].id);
        }}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* 상세/추가 모달 */}
      <ScheduleDetailModal
        visible={detailVisible}
        onClose={() => setDetailVisible(false)}
        plan={selectedPlan}
        tripDayId={selectedDayId ?? 0}
      />

      {/* 전체 달력 모달 */}
      <CalendarFullModal
        visible={calendarVisible}
        onClose={() => setCalendarVisible(false)}
        onSelectDay={scrollToDay}
        openAddModal={openAddModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },

  header: {
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  title: { fontSize: 22, fontWeight: "bold" },
  calendarIcon: { fontSize: 24 },

  dayBox: {
    width: 260,
    padding: 12,
    marginRight: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 2,
  },
  dayText: { fontSize: 16, fontWeight: "bold", marginBottom: 6 },

  addSmall: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    alignItems: "center",
  },
  addSmallText: { color: "white", fontWeight: "bold" },

  fab: {
    position: "absolute",
    bottom: 40,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  fabText: { color: "white", fontSize: 32, marginTop: -3 },
});
