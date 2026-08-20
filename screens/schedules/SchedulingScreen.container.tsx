import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import SchedulingScreenView, { type VisitedPlace } from "./SchedulingScreen.view";
import { useTrip } from "@/contexts/TripContext";
import { useAuth } from "@/contexts/AuthContext";
import { getTripPhase } from "@/domain/tripPhase";
import { useRouteInfo, type TravelMode } from "./hooks/useRouteInfo";
import type { Schedule, Trip, TripDay } from "@/contexts/TripContext";
import type { ScheduleStackParamList } from "@/navigation/ScheduleStackNavigator";
import { ENV } from "@/config/env";

type DaySchedule = {
  day: TripDay;
  schedules: Schedule[];
};

type NavProp = NativeStackNavigationProp<ScheduleStackParamList>;

const TRIP_REVIEW_WINDOW_MS = 7 * 24 * 60 * 60 * 1000; // 여행 종료 후 7일 이내에만 방문 장소 리뷰쓰기 노출

export default function SchedulingScreenContainer() {
  const navigation = useNavigation<NavProp>();
  const { activeTrip, tripDays, schedules, tripsState, trips } = useTrip();
  const { user, accessToken } = useAuth();

  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const mapRef = useRef<any>(null);

  // 여행 종료 후 7일 이내인 가장 최근 여행 — 방문 장소 리뷰쓰기 리스트에 사용
  const recentlyEndedTrip: Trip | null = useMemo(() => {
    if (activeTrip) return null;
    return (
      trips.find((t) => {
        const phase = getTripPhase(t);
        return (
          phase.status === "POST" &&
          Date.now() - new Date(t.end_date).getTime() < TRIP_REVIEW_WINDOW_MS
        );
      }) ?? null
    );
  }, [trips, activeTrip]);

  const [visitedPlaces, setVisitedPlaces] = useState<VisitedPlace[]>([]);
  const [visitedPlacesLoading, setVisitedPlacesLoading] = useState(false);

  useEffect(() => {
    if (!recentlyEndedTrip || !accessToken) {
      setVisitedPlaces([]);
      return;
    }
    setVisitedPlacesLoading(true);
    fetch(`${ENV.API_BASE_URL}/trips/${recentlyEndedTrip.id}/visited-places`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setVisitedPlaces(Array.isArray(data) ? data : []))
      .catch(() => setVisitedPlaces([]))
      .finally(() => setVisitedPlacesLoading(false));
  }, [recentlyEndedTrip, accessToken]);

  const handleWriteVisitedReview = (place: VisitedPlace) => {
    navigation.navigate("ReviewWrite", { placeId: place.id, placeName: place.name });
  };

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
      recentlyEndedTrip={recentlyEndedTrip}
      visitedPlaces={visitedPlaces}
      visitedPlacesLoading={visitedPlacesLoading}
      onWriteVisitedReview={handleWriteVisitedReview}
    />
  );
}
