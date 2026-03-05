import type { TripCity } from "@/constants/cities";

export type Trip = {
  id: number;
  city: TripCity;
  startDate: string;
  endDate: string;
};

export function isActiveTrip(trip: Trip, today: string) {
  return trip.startDate <= today && today <= trip.endDate;
}