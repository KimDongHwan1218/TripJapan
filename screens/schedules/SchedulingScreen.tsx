// screens/Schedule/SchedulingScreen.tsx
import React, { useMemo, useRef, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useTrip } from "@/contexts/TripContext";
import { getScheduleStatus } from "@/domain/scheduleStatus";

import Header from "@/components/Header/Header";
import ScheduleCard from "./components/ScheduleCard";
import ScheduleDetailModal from "./components/ScheduleDetailModal";
import CalendarFullModal from "./components/CalendarFullModal";
import TripPickerModal from "./components/TripPickerModal";
import AddTripModal from "./components/AddTripModal";
import { CITY_META } from "@/constants/cities";

export default function SchedulingScreen() {
  const mapRef = useRef<MapView>(null);

  const {
    trips,
    activeTrip,
    tripDays,
    schedules,
    activeTripState,
    setActiveTripById,
  } = useTrip();

  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [tripPickerVisible, setTripPickerVisible] = useState(false);
  const [addTripVisible, setAddTripVisible] = useState(false);

  // day 기준으로 일정 묶기
  const schedulesByDay = useMemo(() => {
    return tripDays.map((day) => ({
      ...day,
      schedules: schedules
        .filter((s) => s.trip_day_id === day.id)
        .sort((a, b) => a.time.localeCompare(b.time)),
    }));
  }, [tripDays, schedules]);

  const currentDay = schedulesByDay[currentDayIndex];

  // 지도용 일정
  const schedulesForMap = useMemo(() => {
    if (!currentDay) return [];
    return currentDay.schedules.filter(
      (s) => s.latitude && s.longitude
    );
  }, [currentDay]);

  const moveDay = (dir: -1 | 1) => {
    setCurrentDayIndex((prev) => {
      const next = prev + dir;
      if (next < 0 || next >= schedulesByDay.length) return prev;
      return next;
    });
  };

  // if (activeTripState.status === "idle") {
  //   return <EmptyInitScreen />;
  // }

  // if (activeTripState.status === "loading") {
  //   return <LoadingScreen />;
  // }

  // if (activeTripState.status === "error") {
  //   return (
  //     <ErrorScreen
  //       message={activeTripState.error}
  //       onRetry={reloadTrip}
  //     />
  //   );
  // }

  const cityMeta = CITY_META[activeTrip!.city];

  return (
    <View style={styles.container}>
      <Header
        title={cityMeta.label.ko}
        rightButtons={[
          {
            type: "moveTo",
            target: "TripHistoryScreen",
            label: "history",
          },
        ]}
      />

      <View style={{ height: "40%" }}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          initialRegion={{
            latitude: 35.681236,
            longitude: 139.767125,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {schedulesForMap.map((s) => (
            <Marker
              key={s.id}
              coordinate={{
                latitude: s.latitude!,
                longitude: s.longitude!,
              }}
              title={s.place_name}
              pinColor={
                getScheduleStatus(s) === "ONGOING" ? "red" : "blue"
              }
              onPress={() => {
                setSelectedPlan(s);
                setDetailVisible(true);
              }}
            />
          ))}
        </MapView>
      </View>

      <View style={styles.dateNav}>
        <TouchableOpacity onPress={() => moveDay(-1)}>
          <Text style={styles.arrow}>{"<"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setCalendarVisible(true)}>
          <Text style={styles.dateText}>{currentDay?.date}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => moveDay(1)}>
          <Text style={styles.arrow}>{">"}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={currentDay?.schedules ?? []}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <ScheduleCard
            item={item}
            status={getScheduleStatus(item)}
            onEdit={() => {
              setSelectedPlan(item);
              setDetailVisible(true);
            }}
          />
        )}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.addCard}
            onPress={() => {
              setSelectedPlan(null);
              setDetailVisible(true);
            }}
          >
            <Text style={styles.addPlus}>+</Text>
          </TouchableOpacity>
        }
      />

      {/* 모달들 */}
      <ScheduleDetailModal
        visible={detailVisible}
        onClose={() => setDetailVisible(false)}
        plan={selectedPlan}
        tripDayId={currentDay.id}
        onPlaceSelected={(place) => { 
          mapRef.current?.animateToRegion({ 
            latitude: place.latitude, 
            longitude: place.longitude, 
            latitudeDelta: 0.01, 
            longitudeDelta: 0.01,
          }); 
        }}
      />

      <CalendarFullModal
        visible={calendarVisible}
        onClose={() => setCalendarVisible(false)}
        onSelectDay={(index) => {
          setCurrentDayIndex(index);
          setCalendarVisible(false);
        }}
        openAddModal={() => {}}
      />

      <TripPickerModal
        visible={tripPickerVisible}
        onClose={() => setTripPickerVisible(false)}
        trips={trips}
        selectedId={activeTrip!.id}
        onSelect={(id) => setActiveTripById(id)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  dateNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  arrow: { fontSize: 22, color: "#007AFF" },
  dateText: { fontSize: 14, fontWeight: "bold" },

  addCard: {
    marginTop: 12,
    paddingVertical: 24,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#007AFF",
    borderRadius: 12,
    alignItems: "center",
  },
  addPlus: { fontSize: 32, color: "#007AFF", fontWeight: "bold" },
});
