import { useState, useEffect } from "react";
import { ENV } from "@/config/env";

const API_BASE = ENV.API_BASE_URL;

export type PlaceDetail = {
  id: number;
  name: string;
  address: string;
  description: string;
  thumbnail_url: string;
  latitude: number | null;
  longitude: number | null;
  category: string | null;
};

export function usePlaceDetail(placeId: number) {
  const [place, setPlace] = useState<PlaceDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlaceDetail();
  }, [placeId]);

  async function fetchPlaceDetail() {
    try {
      const res = await fetch(`${API_BASE}/places/${placeId}`);
      const data = await res.json();
      setPlace(data);
    } catch (err) {
      console.error("place detail fetch 실패", err);
    } finally {
      setLoading(false);
    }
  }

  return { place, loading };
}
