// contexts/TripContext.tsx
import React, { createContext, useContext, useState, useCallback, useMemo  } from "react";
import axios from "axios";

const API = "https://tavi-server.onrender.com"; // 서버 주소

export type Trip = {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
};

export type TripDay = {
  id: number;
  date: string;
  trip_id: number;
};

export type Schedule = {
  id: number;
  trip_day_id: number;
  activity: string;
  time: string | null;
  notes?: string | null;
  location?: string | null;
};

type TripContextType = {
  activeTrip: Trip | null;
  tripDays: TripDay[];
  schedules: Schedule[];
  schedulesByDay: {
    id: number;
    date: string;
    trip_id: number;
    schedules: Schedule[];
  }[];
  loadTripData: (tripId: number) => Promise<void>;
  addSchedule: (trip_day_id: number, payload: Partial<Schedule>) => Promise<void>;
  updateSchedule: (id: number, payload: Partial<Schedule>) => Promise<void>;
  deleteSchedule: (id: number) => Promise<void>;
  reorderSchedules: (trip_day_id: number, newOrder: Schedule[]) => void;
};

const TripContext = createContext<TripContextType | null>(null);

export function TripProvider({ children }: { children: React.ReactNode }) {
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [tripDays, setTripDays] = useState<TripDay[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  // 여행 전체 로드
  const loadTripData = useCallback(async (tripId: number) => {
    const res = await axios.get(`${API}/trips/${tripId}/full`);
    setActiveTrip(res.data.trip);
    setTripDays(res.data.trip_days);
    setSchedules(res.data.schedules);
  }, []);

  // 일정 생성
  const addSchedule = useCallback(
    async (trip_day_id: number, payload: Partial<Schedule>) => {
      const res = await axios.post(`${API}/schedules`, {
        trip_day_id,
        ...payload,
      });

      setSchedules((prev) => [...prev, res.data]);
    },
    []
  );

  // 일정 수정
  const updateSchedule = useCallback(async (id: number, payload: Partial<Schedule>) => {
    await axios.patch(`${API}/schedules/${id}`, payload);

    setSchedules((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...payload } : item))
    );
  }, []);

  // 일정 삭제
  const deleteSchedule = useCallback(async (id: number) => {
    await axios.delete(`${API}/schedules/${id}`);

    setSchedules((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // 일정 순서 재배열(서버 저장은 상황에 따라 추가)
  const reorderSchedules = (trip_day_id: number, newOrder: Schedule[]) => {
    setSchedules((prev) => [
      ...prev.filter((s) => s.trip_day_id !== trip_day_id),
      ...newOrder,
    ]);
  };

  const schedulesByDay = useMemo(() => {
    return tripDays.map((day) => ({
      ...day,
      schedules: schedules.filter((s) => s.trip_day_id === day.id),
    }));
  }, [tripDays, schedules]);

  return (
    <TripContext.Provider
      value={{
        activeTrip,
        tripDays,
        schedules,
        schedulesByDay,
        loadTripData,
        addSchedule,
        updateSchedule,
        deleteSchedule,
        reorderSchedules,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export const useTrip = () => {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error("useTrip must be used within TripProvider");
  return ctx;
};
