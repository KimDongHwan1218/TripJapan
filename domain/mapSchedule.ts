import type { Schedule } from "@/contexts/TripContext";

export function selectMapSchedules(
  schedules: Schedule[]
): Schedule[] {
  return schedules.filter(
    (s) => s.latitude !== null && s.longitude !== null
  );
}