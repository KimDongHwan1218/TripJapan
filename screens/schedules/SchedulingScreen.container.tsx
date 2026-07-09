import React, { useMemo, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import SchedulingScreenView from "./SchedulingScreen.view";
import { useTrip } from "@/contexts/TripContext";
import { useAuth } from "@/contexts/AuthContext";
import type { Schedule, TripDay } from "@/contexts/TripContext";
import type { ScheduleStackParamList } from "@/navigation/ScheduleStackNavigator";

type DaySchedule = {
  day: TripDay;
  schedules: Schedule[];
};

type NavProp = NativeStackNavigationProp<ScheduleStackParamList>;

export default function SchedulingScreenContainer() {
  const navigation = useNavigation<NavProp>();
  const { activeTrip, tripDays, schedules, tripsState } = useTrip();
  const { user } = useAuth();

  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const mapRef = useRef<any>(null);

  const schedulesByDay: DaySchedule[] = useMemo(() => {
    return tripDays.map((day) => ({
      day,
      schedules: schedules.filter((s) => s.trip_day_id === day.id),
    }));
  }, [tripDays, schedules]);

  // 오늘이 여행 몇 일차인지 계산
  const todayDayNumber = useMemo(() => {
    if (!activeTrip) return 1;
    const start = new Date(activeTrip.start_date);
    const today = new Date();
    const diff = Math.floor(
      (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    return Math.max(1, Math.min(diff + 1, schedulesByDay.length || 1));
  }, [activeTrip, schedulesByDay.length]);

  const currentDay = schedulesByDay[currentDayIndex];

  const handleSelectDay = (idx: number) => {
    setCurrentDayIndex(idx);
  };

  const handleEditDay = (tripDayId: number, date: string) => {
    navigation.navigate("TripEditScreen", { tripDayId, date });
  };

  const handlePressViewHistory = () => {
    navigation.navigate("TripHistoryScreen");
  };

  const handlePressNewTrip = () => {
    navigation.navigate("TripHistoryScreen");
  };

  return (
    <SchedulingScreenView
      activeTrip={activeTrip}
      initialLoading={tripsState.status === "loading"}
      schedulesByDay={schedulesByDay}
      currentDayIndex={currentDayIndex}
      onSelectDay={handleSelectDay}
      nickname={user?.nickname ?? user?.name ?? ""}
      todayDayNumber={todayDayNumber}
      mapRef={mapRef}
      mapSchedules={
        currentDay?.schedules.filter(
          (s) => s.latitude !== null && s.longitude !== null
        ) ?? []
      }
      onEditDay={handleEditDay}
      onPressViewHistory={handlePressViewHistory}
      onPressNewTrip={handlePressNewTrip}
    />
  );
}
