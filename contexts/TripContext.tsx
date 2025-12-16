// contexts/TripContext.tsx
import React, { useEffect, createContext, useContext, useState, useCallback, useMemo } from "react";
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

export type CreateTripResponse = {
  trip: Trip;
  trip_days: TripDay[];
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
  isTripsLoaded: boolean;

  /* 기존 기능 */
  loadTripData: (tripId: number) => Promise<void>;
  createTrip: (payload: Partial<Trip>) => Promise<CreateTripResponse>;
  updateTrip: (id: number, payload: Partial<Trip>) => Promise<void>;
  deleteTrip: (id: number) => Promise<void>;

  addSchedule: (trip_day_id: number, payload: Partial<Schedule>) => Promise<void>;
  updateSchedule: (id: number, payload: Partial<Schedule>) => Promise<void>;
  deleteSchedule: (id: number) => Promise<void>;
  reorderSchedules: (trip_day_id: number, newOrder: Schedule[]) => void;

  /* ★ 추가된 기능들 ★ */
  trips: Trip[];
  loadAllTrips: () => Promise<void>;
  selectActiveTrip: (id: number) => void;
  autoSelectActiveTrip: () => void;
};

const TripContext = createContext<TripContextType | null>(null);

// 날짜 비교용
const dateObj = (str: string) => new Date(str.split("T")[0]);

export function TripProvider({ children }: { children: React.ReactNode }) {
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [tripDays, setTripDays] = useState<TripDay[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isTripsLoaded, setIsTripsLoaded] = useState(false);

  /* -----------------------------
      ★ 1) 전체 여행 목록 가져오기
  ------------------------------*/
  const loadAllTrips = useCallback(async () => {
    console.log("Loading all trips from API");
    const res = await axios.get(`${API}/trips`);
    console.log("Loading all trips from API", res.data);
    setTrips(res.data || []);
  }, []);

  useEffect(() => {
    console.log("trips now", trips);
    if (trips.length==0) return;
    autoSelectActiveTrip();
    setIsTripsLoaded(true)
  }, [trips]);

  /* -----------------------------
      ★ 2) Travel 자동 선택
  ------------------------------*/
  const autoSelectActiveTrip = useCallback(() => {
    if (!trips.length) {
      setActiveTrip(null);
      return;
    }

    const today = new Date();

    const future = trips
      .filter((t) => dateObj(t.start_date) >= today)
      .sort((a, b) => dateObj(a.start_date).getTime() - dateObj(b.start_date).getTime());

    const past = trips
      .filter((t) => dateObj(t.end_date) < today)
      .sort((a, b) => dateObj(b.end_date).getTime() - dateObj(a.end_date).getTime());

    if (future.length > 0) {
      setActiveTrip(future[0]);
      loadTripData(future[0].id);
    } else if (past.length > 0) {
      setActiveTrip(past[0]);
      loadTripData(past[0].id);
    } else {
      setActiveTrip(null);
    }
  }, [trips]);

  /* -----------------------------
      ★ 3) activeTrip 변경
  ------------------------------*/
  const selectActiveTrip = useCallback(
    (id: number) => {
      const found = trips.find((t) => t.id === id) || null;
      setActiveTrip(found);
      if (found) loadTripData(found.id);
    },
    [trips]
  );

  /* -----------------------------
      기존 코드 그대로 유지
  ------------------------------*/
  const loadTripData = useCallback(async (tripId: number) => {
    const res = await axios.get(`${API}/trips/${tripId}/full`);
    setActiveTrip(res.data.trip);
    setTripDays(res.data.trip_days || []);
    setSchedules(res.data.schedules || []);
  }, []);

  const createTrip = useCallback(async (payload: Partial<Trip>) => {
    const res = await axios.post<CreateTripResponse>(`${API}/trips`, payload);
    const data = res.data;

    setActiveTrip(data.trip);
    setTripDays(data.trip_days || []);
    setSchedules([]);

    // trips 목록 다시 불러오기
    await loadAllTrips();

    return data;
  }, [loadAllTrips]);

  const updateTrip = useCallback(async (id: number, payload: Partial<Trip>) => {
    await axios.patch(`${API}/trips/${id}`, payload);
    setActiveTrip((prev) => (prev ? { ...prev, ...payload } : prev));

    await loadAllTrips();
  }, [loadAllTrips]);

  const deleteTrip = useCallback(async (id: number) => {
    await axios.delete(`${API}/trips/${id}`);

    if (activeTrip?.id === id) {
      setActiveTrip(null);
      setTripDays([]);
      setSchedules([]);
    }

    await loadAllTrips();
  }, [activeTrip, loadAllTrips]);

  const addSchedule = useCallback(async (trip_day_id: number, payload: Partial<Schedule>) => {
    const res = await axios.post(`${API}/schedules`, { trip_day_id, ...payload });
    setSchedules((prev) => [...prev, res.data]);
  }, []);

  const updateSchedule = useCallback(async (id: number, payload: Partial<Schedule>) => {
    await axios.patch(`${API}/schedules/${id}`, payload);
    setSchedules((prev) => prev.map((item) => (item.id === id ? { ...item, ...payload } : item)));
  }, []);

  const deleteSchedule = useCallback(async (id: number) => {
    await axios.delete(`${API}/schedules/${id}`);
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const reorderSchedules = (trip_day_id: number, newOrder: Schedule[]) => {
    setSchedules((prev) => [
      ...prev.filter((s) => s.trip_day_id !== trip_day_id),
      ...newOrder,
    ]);
  };

  const schedulesByDay = useMemo(
    () =>
      tripDays.map((d) => ({
        ...d,
        schedules: schedules.filter((s) => s.trip_day_id === d.id),
      })),
    [tripDays, schedules]
  );

  return (
    <TripContext.Provider
      value={{
        activeTrip,
        tripDays,
        schedules,
        schedulesByDay,
        isTripsLoaded,

        loadTripData,
        createTrip,
        updateTrip,
        deleteTrip,
        addSchedule,
        updateSchedule,
        deleteSchedule,
        reorderSchedules,

        /* 추가된 기능들 */
        trips,
        loadAllTrips,
        selectActiveTrip,
        autoSelectActiveTrip,
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
