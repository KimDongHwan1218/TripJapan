import React, { useMemo, useRef, useState } from "react";
import SchedulingScreenView from "./SchedulingScreen.view";
import { useTrip } from "@/contexts/TripContext";
import { useUI } from "@/contexts/UIContext";
import type { Schedule, TripDay } from "@/contexts/TripContext";

type DaySchedule = {
  day: TripDay;
  schedules: Schedule[];
};

export default function SchedulingScreenContainer() {
  const { activeTrip, tripDays, schedules } = useTrip();
  const { openScheduleEdit, openScheduleCreate } = useUI();

  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const mapRef = useRef<any>(null);

  const schedulesByDay: DaySchedule[] = useMemo(() => {
    return tripDays.map((day) => ({
      day,
      schedules: schedules.filter(
        (s) => s.trip_day_id === day.id
      ),
    }));
  }, [tripDays, schedules]);

  const currentDay = schedulesByDay[currentDayIndex];

  const handlePrevDay = () => {
    setCurrentDayIndex((idx) => Math.max(idx - 1, 0));
  };

  const handleNextDay = () => {
    setCurrentDayIndex((idx) =>
      Math.min(idx + 1, schedulesByDay.length - 1)
    );
  };

  const handleSelectSchedule = (schedule: Schedule) => {
    // 지도 쪽으로 포커싱 (있으면)
    mapRef.current?.focusSchedule?.(schedule);
  };

  const handleCreateSchedule = () => {
    openScheduleCreate(currentDay?.day.id);
  }

  const handleEditSchedule = (schedule: Schedule) => {
    // UIContext 기반 모달 오픈
    openScheduleEdit(schedule);
  };

  return (
    <SchedulingScreenView
      activeTrip={activeTrip}
      schedulesByDay={schedulesByDay}
      currentDayIndex={currentDayIndex}
      onPrevDay={handlePrevDay}
      onNextDay={handleNextDay}
      mapRef={mapRef}
      mapSchedules={currentDay?.schedules.filter((s) => s.latitude !== null && s.longitude !== null) ?? []}
      onSelectSchedule={handleSelectSchedule}
      onCreateSchedule={handleCreateSchedule}
      onEditSchedule={handleEditSchedule}
    />
  );
}
