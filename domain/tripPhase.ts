import type { Trip } from "@/contexts/TripContext";

export type TripPhaseStatus = "PRE" | "ONGOING" | "POST";

export type TripPhase = {
  status: TripPhaseStatus;
  // 여행 진행 중(ONGOING)일 때만 값이 있음 — 시작 전/종료 후에는 "며칠차"라는 개념이 없으므로 null
  dayNumber: number | null;
  totalDays: number;
};

export function getTripPhase(trip: Trip, today = new Date()): TripPhase {
  const start = new Date(trip.start_date);
  const end = new Date(trip.end_date);

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  today.setHours(0, 0, 0, 0);

  const totalDays =
    Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  if (today < start) return { status: "PRE", dayNumber: null, totalDays };
  if (today > end) return { status: "POST", dayNumber: null, totalDays };

  const dayNumber = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  return { status: "ONGOING", dayNumber, totalDays };
}
