import React, { createContext, useContext, useEffect, useCallback, useState } from "react";
import axios from "axios";
import type { TripCity } from "@/constants/cities";
import { ENV } from "@/config/env";
import { useAuth } from "@/contexts/AuthContext";

export type Trip = {
  id: number;
  city: TripCity;
  start_date: string;
  end_date: string;
};

export type TripDay = {
  id: number;
  trip_id: number;
  date: string;
};

export type Schedule = {
  id: number;
  trip_day_id: number;
  activity: string;
  notes: string | null;
  time: string;

  place_name: string;
  latitude: number | null;
  longitude: number | null;
  place_id: string | null;
};

export type LoadState<T> = {
  status: "idle" | "loading" | "success" | "error";
  data: T | null;
  error?: string;
};

type TripContextType = {
  trips: Trip[];
  tripsState: LoadState<Trip[]>;

  activeTrip: Trip | null;
  activeTripState: LoadState<Trip | null>;

  tripDays: TripDay[];
  schedules: Schedule[];

  createTrip: (payload: { city: TripCity; start_date: string; end_date: string }) => Promise<Trip>;
  deleteTrip: (tripId: number) => Promise<void>;
  addSchedule: (tripdayid: number, payload: any) => Promise<void>;
  updateSchedule: (scheduleid: number, payload: any) => Promise<void>;
  deleteSchedule: (scheduleid: number) => Promise<void>;

  loadTrips: () => Promise<void>;
  loadTripFull: (tripId: number) => Promise<void>;
  setActiveTripById: (tripId: number) => Promise<void>;
};

const TripContext = createContext<TripContextType | null>(null);
const API_BASE = ENV.API_BASE_URL;

export function TripProvider({ children }: { children: React.ReactNode }) {
  const { accessToken } = useAuth();
  const authHeaders = accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;

  const [trips, setTrips] = useState<Trip[]>([]);
  const [tripsState, setTripsState] = 
  useState<LoadState<Trip[]>>({
    status: "idle",
    data: null,
  });

  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [activeTripState, setActiveTripState] =
    useState<LoadState<Trip | null>>({ 
      status: "idle" 
    , data: null 
  });

  const [tripDays, setTripDays] = useState<TripDay[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const loadTrips = useCallback(async () => {
    if (!accessToken) {
      setTrips([]);
      setTripsState({ status: "idle", data: null });
      return;
    }
    setTripsState({ status: "loading", data: null });
    try {
      const res = await axios.get(`${API_BASE}/trips`, { headers: authHeaders });
      setTrips(res.data);
      setTripsState({ status: "success", data: res.data });
    } catch (e) {
      setTripsState({
        status: "error",
        data: null,
        error: "여행 목록 로딩 실패",
      });
    }
  }, [accessToken]);

  const loadTripFull = useCallback(async (tripId: number) => {
    setActiveTripState({ status: "loading", data: null });
    try {
      const res = await axios.get(`${API_BASE}/trips/${tripId}/full`, { headers: authHeaders });
      const { trip, trip_days, schedules } = res.data;

      setActiveTrip(trip);
      setTripDays(trip_days);
      setSchedules(schedules);

      setActiveTripState({ status: "success", data: trip });
    } catch {
      setActiveTripState({
        status: "error",
        data: null,
        error: "여행 상세 로딩 실패",
      });
    }
  }, [accessToken]);

  const setActiveTripById = useCallback(
    async (tripId: number) => {
      await loadTripFull(tripId);
    },
    [loadTripFull]
  );

  const createTrip = async (payload: { city: TripCity; start_date: string; end_date: string }): Promise<Trip> => {
    const res = await axios.post(`${API_BASE}/trips`, payload, { headers: authHeaders });
    // 서버가 { trip, trip_days } 반환
    const newTrip: Trip = res.data.trip;
    const newTripDays: TripDay[] = res.data.trip_days ?? [];
    setTrips((prev) => [...prev, newTrip]);
    // 생성 즉시 active로 설정 (loadTripFull 없이)
    setActiveTrip(newTrip);
    setTripDays(newTripDays);
    setSchedules([]);
    return newTrip;
  };

  const addSchedule = async (tripdayid: number, payload: any) => {//trip은 activeTrip
    try {
      const res = await axios.post(`${API_BASE}/schedules`, {
        trip_day_id: tripdayid,
        ...payload
      }, { headers: authHeaders })
      setSchedules((prev) => [...prev, res.data]);
    }
    catch (e: any) {
      console.error("스케줄 추가 실패", e?.response?.data ?? e?.message);
      throw e;
    }
  };

  const updateSchedule = async (scheduleid: number, payload: any) => {
    try {
      console.log("payload", payload);
      const res = await axios.patch(`${API_BASE}/schedules/${scheduleid}`, payload, { headers: authHeaders });
      setSchedules((prev) => prev.map((sch) => sch.id === scheduleid ? res.data : sch));
    }
    catch (e) {
      console.error("스케줄 수정 실패", e);
    }
  };

  const deleteTrip = async (tripId: number) => {
    await axios.delete(`${API_BASE}/trips/${tripId}`, { headers: authHeaders });

    // functional update로 stale closure 방지
    let wasActive = false;
    let remaining: Trip[] = [];

    setTrips((prev) => {
      remaining = prev.filter((t) => t.id !== tripId);
      return remaining;
    });
    setActiveTrip((prev) => {
      if (prev?.id === tripId) {
        wasActive = true;
        return null;
      }
      return prev;
    });
    setTripDays((prev) => prev.filter((d) => d.trip_id !== tripId));

    // 삭제된 trip이 active였으면 schedules도 초기화
    // (다음 여행이 있으면 loadTripFull로 새로 로드)
    setSchedules([]);

    if (wasActive && remaining.length > 0) {
      const next = pickClosestUpcomingTrip(remaining) ?? remaining[0];
      await loadTripFull(next.id);
    }
  };

  const deleteSchedule = async (scheduleid: number) => {
    try {
      await axios.delete(`${API_BASE}/schedules/${scheduleid}`, { headers: authHeaders });
      setSchedules((prev) => prev.filter((sch) => sch.id !== scheduleid));
    }
    catch (e) {
      console.error("스케줄 삭제 실패", e);
    }
  };

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  // 로그아웃/계정 전환 시 이전 사용자의 일정이 화면에 남아있지 않도록 초기화
  useEffect(() => {
    if (!accessToken) {
      setActiveTrip(null);
      setTripDays([]);
      setSchedules([]);
      setActiveTripState({ status: "idle", data: null });
    }
  }, [accessToken]);

  function pickClosestUpcomingTrip(trips: Trip[]): Trip | null {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const candidates = trips.filter((trip) => {
      const end = new Date(trip.end_date);
      end.setHours(23, 59, 59, 999);

      // 아직 끝나지 않은 여행만
      return end >= today;
    });

    if (candidates.length === 0) return null;

    candidates.sort((a, b) => {
      const aStart = new Date(a.start_date).getTime();
      const bStart = new Date(b.start_date).getTime();
      return aStart - bStart;
    });

    return candidates[0];
  }

  useEffect(() => {
    if (
      tripsState.status === "success" &&
      trips.length > 0 &&
      activeTrip === null
    ) {
      const defaultTrip =
        pickClosestUpcomingTrip(trips) ?? trips[0];

      setActiveTripById(defaultTrip.id);
    }
  }, [tripsState.status, trips, activeTrip, setActiveTripById]);

  return (
    <TripContext.Provider
      value={{
        trips,
        tripsState,
        activeTrip,
        activeTripState,
        tripDays,
        schedules,
        createTrip,
        deleteTrip,
        addSchedule,
        updateSchedule,
        deleteSchedule,
        loadTrips,
        loadTripFull,
        setActiveTripById,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error("useTrip must be used within TripProvider");
  return ctx;
}
