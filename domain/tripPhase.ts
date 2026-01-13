import type { Trip } from "@/contexts/TripContext";

export type TripPhase = "PRE" | "ONGOING" | "POST";

export function getTripPhase(
  trip: Trip,
  today = new Date()
): TripPhase {
  const start = new Date(trip.start_date);
  const end = new Date(trip.end_date);

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  today.setHours(0, 0, 0, 0);

  if (today < start) return "PRE";
  if (today > end) return "POST";
  return "ONGOING";
}
