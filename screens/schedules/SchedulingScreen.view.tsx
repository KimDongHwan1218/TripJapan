import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./SchedulingScreen.styles";
import type { Trip, TripDay, Schedule } from "@/contexts/TripContext";
import ScheduleCard from "./components/ScheduleCard";
import ScheduleMap from "./components/ScheduleMap";
import ScheduleDetailModal from "./components/ScheduleDetailModal";

type DaySchedule = {
  day: TripDay;
  schedules: Schedule[];
};

type Props = {
  activeTrip: Trip | null;
  schedulesByDay: DaySchedule[];
  currentDayIndex: number;
  onPrevDay: () => void;
  onNextDay: () => void;

  mapRef: React.RefObject<any>;
  mapSchedules: Schedule[];
  onSelectSchedule: (s: Schedule) => void;
  onEditSchedule: (s: Schedule) => void;
  onCreateSchedule: (i: String) => void;
};

export default function SchedulingScreenView({
  activeTrip,
  schedulesByDay,
  currentDayIndex,
  onPrevDay,
  onNextDay,
  mapRef,
  mapSchedules,
  onSelectSchedule,
  onEditSchedule,
  onCreateSchedule,
}: Props) {
  if (!activeTrip) {
    return (
      <View style={styles.center}>
        <Text>여행을 선택해주세요</Text>
      </View>
    );
  }

  const currentDay = schedulesByDay[currentDayIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{activeTrip.city} 여행</Text>

      <View>
        <ScheduleDetailModal />
      </View>

      <ScheduleMap ref={mapRef} schedules={mapSchedules} />

      {currentDay?.schedules.map((schedule) => (
        <TouchableOpacity
          key={schedule.id}
          onPress={() => onSelectSchedule(schedule)}
        >
          <ScheduleCard
            item={schedule}
            onEdit={onEditSchedule}
          />
        </TouchableOpacity>
      ))}

      <View style={styles.dayHeader}>
        <TouchableOpacity onPress={onPrevDay}>
          <Text>{"<"}</Text>
        </TouchableOpacity>

        <Text>{currentDay?.day.date}</Text>

        <TouchableOpacity onPress={onNextDay}>
          <Text>{">"}</Text>
        </TouchableOpacity>
      </View>

      
    </View>
  );
}
