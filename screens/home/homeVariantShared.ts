import type { Trip, Schedule } from "@/contexts/TripContext";
import type { TripPhase } from "@/domain/tripPhase";

// 홈 시안 C·D가 같이 쓰는 props/계산 — 컨테이너가 한 번 만들어 두 시안에 그대로 넘김
export type HomeVariantProps = {
  nickname: string;
  city: string; // TripCity 키(여행 없으면 Tokyo)
  destinations: any[];
  activeTrip: Trip | null;
  tripPhase: TripPhase | null;
  todaySchedules: Schedule[];
  temperature: number | null;
  weatherCode: number | null;
  exchangeRate: number | null;
  exchangeRateDiff: number | null;
  onPressMyTrip: () => void;
  onPressCreateTrip: () => void;
  onPressWeather: () => void;
  onPressExchange: () => void;
  onPressTranslation: () => void;
  onPressTravelAlert: () => void;
  onPressTaviTalk: () => void;
  onPressTaviTalkPost: (postId: number) => void;
  onPressTaviPickAll: () => void;
};

export function fmtTripRange(trip: Trip) {
  const f = (s: string) => {
    const d = new Date(s);
    const w = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
    return `${d.getMonth() + 1}.${d.getDate()}(${w})`;
  };
  return `${f(trip.start_date)} – ${f(trip.end_date)}`;
}

export function daysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) / 86400000);
}

// 시간이 없는 일정(00:00 기본값 포함)은 시간 칸을 그리지 않음
export function scheduleTime(s: Schedule) {
  return s.time && !s.time.startsWith("00:00") ? s.time.slice(0, 5) : null;
}
