import { useMemo, useState, useCallback } from "react";
import type { TripDay, Schedule } from "@/contexts/TripContext";
import {
  groupSchedulesByDay,
  clampDayIndex,
} from "@/domain/schedule";

export function useScheduleDays(
  tripDays: TripDay[],
  schedules: Schedule[]
) {
  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  const daySchedules = useMemo(() => {
    if (!tripDays.length) return [];
    return groupSchedulesByDay(tripDays, schedules);
  }, [tripDays, schedules]);

  const maxIndex = daySchedules.length - 1;

  const movePrevDay = useCallback(() => {
    setCurrentDayIndex((prev) =>
      clampDayIndex(prev - 1, maxIndex)
    );
  }, [maxIndex]);

  const moveNextDay = useCallback(() => {
    setCurrentDayIndex((prev) =>
      clampDayIndex(prev + 1, maxIndex)
    );
  }, [maxIndex]);

  return {
    daySchedules,
    currentDayIndex,
    setCurrentDayIndex,
    movePrevDay,
    moveNextDay,
  };
}