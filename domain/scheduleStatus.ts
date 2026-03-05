import type { Schedule } from "@/contexts/TripContext";

export type ScheduleStatus = "UPCOMING" | "ONGOING" | "DONE";

export function getScheduleStatus(
  schedule: Schedule,
  now = new Date()
): ScheduleStatus {
  const [h, m, s] = schedule.time.split(":").map(Number);

  const scheduleTime = new Date(now);
  scheduleTime.setHours(h, m, s, 0);

  const diff = scheduleTime.getTime() - now.getTime();

  if (Math.abs(diff) <= 30 * 60 * 1000) return "ONGOING"; // ±30분
  if (diff > 0) return "UPCOMING";
  return "DONE";
}
