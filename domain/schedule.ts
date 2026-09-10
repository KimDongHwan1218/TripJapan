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

// 일정 카드의 굵은 글씨(activity) 아래에 보여줄 얇은 글씨 텍스트.
// 검색/지도로 장소를 추가하면 activity와 place_name이 같은 값(장소명)으로 저장돼서
// 두 줄이 완전히 똑같은 텍스트를 반복하는 문제가 있었음 — notes(주소)를 우선 쓰고,
// activity와 같은 값이면(과거 데이터 등) 아예 안 보여줘서 "존재 의의 없는" 중복을 없앰
export function getScheduleSubtitle(s: {
  activity: string;
  notes: string | null;
  place_name: string | null;
}): string | null {
  if (s.notes && s.notes !== s.activity) return s.notes;
  if (s.place_name && s.place_name !== s.activity) return s.place_name;
  return null;
}

