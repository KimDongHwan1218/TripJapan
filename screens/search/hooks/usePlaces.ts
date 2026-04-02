import { useState, useCallback, useEffect } from "react";
import { ENV } from "@/config/env";

const API_BASE = ENV.API_BASE_URL;

type BadgeType = "HOT" | "NEAR_MY_TRIP" | "TRENDING" | "LOCAL_PICK" | "HIGH_BOOKING" | "HIGH_REVIEW";

export type Place = {
  id: number;
  name: string;
  address: string;
  category: string | null;
  thumbnail_url: string;
  badges?: BadgeType[];
};

export function usePlaces(selectedCategory: string, query: string) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPlaces = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("category", selectedCategory);
      if (query) params.append("keyword", query);

      const res = await fetch(`${API_BASE}/places?${params.toString()}`);
      const data = await res.json();
      setPlaces(data);
    } catch (err) {
      console.error("places fetch 실패", err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, query]);

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  return { places, loading };
}
