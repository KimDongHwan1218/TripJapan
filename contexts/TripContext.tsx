import React, { createContext, useContext, useEffect, useCallback, useState } from "react";
import axios from "axios";
import type { TripCity } from "@/constants/cities";
import { ENV } from "@/config/env";

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

  loadTrips: () => Promise<void>;
  loadTripFull: (tripId: number) => Promise<void>;
  setActiveTripById: (tripId: number) => Promise<void>;
};

const TripContext = createContext<TripContextType | null>(null);
const API_BASE = ENV.API_BASE_URL;

export function TripProvider({ children }: { children: React.ReactNode }) {
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
    setTripsState({ status: "loading", data: null });
    try {
      const res = await axios.get(`${API_BASE}/trips`);
      setTrips(res.data);
      setTripsState({ status: "success", data: res.data });
    } catch (e) {
      setTripsState({
        status: "error",
        data: null,
        error: "여행 목록 로딩 실패",
      });
    }
  }, []);

  const loadTripFull = useCallback(async (tripId: number) => {
    setActiveTripState({ status: "loading", data: null });
    try {
      const res = await axios.get(`${API_BASE}/trips/${tripId}/full`);
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
  }, []);

  const setActiveTripById = useCallback(
    async (tripId: number) => {
      await loadTripFull(tripId);
    },
    [loadTripFull]
  );

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  return (
    <TripContext.Provider
      value={{
        trips,
        tripsState,
        activeTrip,
        activeTripState,
        tripDays,
        schedules,
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
