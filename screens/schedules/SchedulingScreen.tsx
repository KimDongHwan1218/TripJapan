// screens/scheduling/SchedulingScreen.tsx
import React, { useEffect, useRef, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useTrip } from "@/contexts/TripContext";

import Header from "@/components/Header/Header";
import ScheduleCard from "./components/ScheduleCard";
import ScheduleDetailModal from "./components/ScheduleDetailModal";
import CalendarFullModal from "./components/CalendarFullModal";
import TripPickerModal from "./components/TripPickerModal";
import AddTripModal from "./components/AddTripModal";

export default function SchedulingScreen() {
  const {
    trips,
    activeTrip,
    tripDays,
    schedulesByDay,
    isTripsLoaded,

    loadAllTrips,
    autoSelectActiveTrip,
    selectActiveTrip,
  } = useTrip();

  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedDayId, setSelectedDayId] = useState<number | null>(null);

  const [calendarVisible, setCalendarVisible] = useState(false);
  const [tripModalVisible, setTripModalVisible] = useState(false);
  const [tripPickerVisible, setTripPickerVisible] = useState(false);

  const dayListRef = useRef<FlatList>(null);

  // 최초 여행 목록 로드 후 자동 선택
  useEffect(() => {
    (async () => {
      await loadAllTrips();
    })();
  }, []);

  const openEditModal = (plan: any) => {
    setSelectedPlan(plan);
    setSelectedDayId(plan.trip_day_id);
    setDetailVisible(true);
  };
  const openAddModal = (tripDayId: number) => {
    setSelectedPlan(null);
    setSelectedDayId(tripDayId);
    setDetailVisible(true);
  };

  const scrollToDay = (index: number) => {
    dayListRef.current?.scrollToIndex({ index, animated: true });
  };

  // 여행 없음 화면
  if (!isTripsLoaded) {
    return (
      <View style={styles.emptyContainer}>
        <Header middleContent="여행 일정" />
        <Text style={styles.emptyText}>아직 여행 계획이 없습니다.</Text>
        <TouchableOpacity
          style={styles.startBtn}
          onPress={() => setTripModalVisible(true)}
        >
          <Text style={styles.startBtnText}>여행 만들기</Text>
        </TouchableOpacity>

        <AddTripModal visible={tripModalVisible} onClose={() => setTripModalVisible(false)} />
      </View>
    );
  }

  console.log("Rendering SchedulingScreen with activeTrip:", activeTrip);

  return (
    <View style={styles.container}>
      {/* ------- Header 확장 사용 ------- */}
      <Header
        backwardButton={false}
        middleContent={
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 18, fontWeight: "700" }}>{activeTrip!.title}</Text>
            <TouchableOpacity onPress={() => setTripPickerVisible(true)}>
              <Text style={{ color: "#999", fontSize: 12 }}>
                {activeTrip!.start_date} ~ {activeTrip!.end_date} ▼
              </Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* 날짜 + 스케줄 카드 */}
      <FlatList
        ref={dayListRef}
        data={schedulesByDay}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.dayBox}>
            <Text style={styles.dayText}>{item.date}</Text>

            <View style={{ marginTop: 10 }}>
              {item.schedules.map((plan: any) => (
                <ScheduleCard key={plan.id} item={plan} onEdit={openEditModal} />
              ))}

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

      {/* Trip 생성 FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setTripModalVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* 일정 상세/추가 */}
      <ScheduleDetailModal
        visible={detailVisible}
        onClose={() => setDetailVisible(false)}
        plan={selectedPlan}
        tripDayId={selectedDayId ?? 0}
      />

      {/* 전체 달력 */}
      <CalendarFullModal
        visible={calendarVisible}
        onClose={() => setCalendarVisible(false)}
        onSelectDay={scrollToDay}
        openAddModal={openAddModal}
      />

      {/* Trip 생성 */}
      <AddTripModal
        visible={tripModalVisible}
        onClose={() => setTripModalVisible(false)}
      />

      {/* Trip 선택 Picker */}
      <TripPickerModal
        visible={tripPickerVisible}
        onClose={() => setTripPickerVisible(false)}
        trips={trips}
        selectedId={activeTrip?.id ?? null}
        onSelect={(id) => selectActiveTrip(id)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },

  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 16, color: "#555", marginBottom: 20 },
  startBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#007AFF",
    borderRadius: 10,
  },
  startBtnText: { color: "#fff", fontSize: 16 },

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
