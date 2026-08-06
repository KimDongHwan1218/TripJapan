import React, { useMemo, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import SchedulingScreenView from "./SchedulingScreen.view";
import { useTrip } from "@/contexts/TripContext";
import { useAuth } from "@/contexts/AuthContext";
import { getTripPhase } from "@/domain/tripPhase";
import { useRouteInfo, type TravelMode } from "./hooks/useRouteInfo";
import type { Schedule, TripDay } from "@/contexts/TripContext";
import type { ScheduleStackParamList } from "@/navigation/ScheduleStackNavigator";

type DaySchedule = {
  day: TripDay;
  schedules: Schedule[];
};

type NavProp = NativeStackNavigationProp<ScheduleStackParamList>;

export default function SchedulingScreenContainer() {
  const navigation = useNavigation<NavProp>();
  const { activeTrip, tripDays, schedules, tripsState, trips } = useTrip();
  const { user } = useAuth();

  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const mapRef = useRef<any>(null);

  const schedulesByDay: DaySchedule[] = useMemo(() => {
    return tripDays.map((day) => ({
      day,
      schedules: schedules.filter((s) => s.trip_day_id === day.id),
    }));
  }, [tripDays, schedules]);

  // 오늘이 여행 몇 일차인지 계산 (진행중일 때만 의미 있음 — 시작 전/종료 후는 dayNumber가 없음)
  const todayDayNumber = useMemo(() => {
    if (!activeTrip) return 1;
    const phase = getTripPhase(activeTrip);
    if (phase.status === "ONGOING") return phase.dayNumber!;
    if (phase.status === "PRE") return 1;
    return phase.totalDays; // POST — activeTrip은 정상적으로 여기 도달하지 않지만 방어적으로 마지막 날 표시
  }, [activeTrip]);

  const currentDay = schedulesByDay[currentDayIndex];

  const mapSchedules = useMemo(
    () => currentDay?.schedules.filter((s) => s.latitude !== null && s.longitude !== null) ?? [],
    [currentDay]
  );

  // 도보/대중교통 경로 — 현재 스와이프된 day 기준
  const [travelMode, setTravelMode] = useState<TravelMode>("walking");
  const routeCoordinates = useMemo(
    () => mapSchedules.map((s) => ({ latitude: s.latitude!, longitude: s.longitude! })),
    [mapSchedules]
  );
  const routeInfo = useRouteInfo(routeCoordinates, travelMode);

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
      hasTripHistory={trips.length > 0}
      todayDayNumber={todayDayNumber}
      mapRef={mapRef}
      mapSchedules={mapSchedules}
      routeInfo={routeInfo}
      travelMode={travelMode}
      onChangeTravelMode={setTravelMode}
      onEditDay={handleEditDay}
      onPressViewHistory={handlePressViewHistory}
      onPressNewTrip={handlePressNewTrip}
    />
  );
}
