import type { TripDay, Schedule } from "@/contexts/TripContext";

export type DaySchedule = {
  day: TripDay;
  schedules: Schedule[];
};

// tripDays 기준으로 schedules를 day별로 묶는다
export function groupSchedulesByDay(
  tripDays: TripDay[],
  schedules: Schedule[]
): DaySchedule[] {
  return tripDays.map((day) => ({
    day,
    schedules: schedules
      .filter((s) => s.trip_day_id === day.id)
      .sort(sortByTime),
  }));
}

// 일정 시간 정렬 (HH:mm 기준)
function sortByTime(a: Schedule, b: Schedule) {
  return a.time.localeCompare(b.time);
}

// index 이동 (범위 보호)
export function clampDayIndex(
  index: number,
  max: number
) {
  if (index < 0) return 0;
  if (index > max) return max;
  return index;
}

