import { useState, useEffect } from "react";
import { ENV } from "@/config/env";

const API_BASE = ENV.API_BASE_URL;

type Segment = {
  carrierCode: string;
  number: string;
  departure: { iataCode: string; at: string };
  arrival: { iataCode: string; at: string };
  duration: string;
  numberOfStops: number;
};

export type FlightDetail = {
  offerId: string;
  price: { total: string; currency: string };
  itineraries?: { segments: Segment[] }[];
  mock?: boolean;
};

export function useFlightDetail(offerId: string) {
  const [detail, setDetail] = useState<FlightDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetail();
  }, [offerId]);

  async function fetchDetail() {
    try {
      const res = await fetch(`${API_BASE}/flights/offer/${offerId}`);
      const json = await res.json();
      setDetail(json);
    } catch (e) {
      console.error("flight detail fetch failed", e);
    } finally {
      setLoading(false);
    }
  }

  return { detail, loading };
}
