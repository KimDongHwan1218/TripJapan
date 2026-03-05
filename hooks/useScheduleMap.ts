import { useMemo, useCallback, useRef } from "react";
import type { Schedule } from "@/contexts/TripContext";
import { selectMapSchedules } from "@/domain/mapSchedule";

export function useScheduleMap(
  schedules: Schedule[]
) {
  const mapRef = useRef<any>(null);

  const mapSchedules = useMemo(() => {
    return selectMapSchedules(schedules);
  }, [schedules]);

  const focusSchedule = useCallback(
    (schedule: Schedule) => {
      if (!mapRef.current) return;

      // mapRef.current.animateToRegion(...)
      // 여기선 "이런 역할이다"만 유지
    },
    []
  );

  return {
    mapRef,
    mapSchedules,
    focusSchedule,
  };
}