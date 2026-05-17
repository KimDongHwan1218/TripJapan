import { useState, useEffect } from "react";
import { ENV } from "@/config/env";

const API_BASE = ENV.API_BASE_URL;

export type TravelInfoItem = {
  id: number;
  name: string;
  address: string;
  description: string;
  thumbnail_url: string;
  category: string | null;
};

const TRAVEL_CATEGORIES = ["cafe", "restaurant", "shop", "goods", "event_place"] as const;
export type TravelCategory = (typeof TRAVEL_CATEGORIES)[number] | "전체";

export { TRAVEL_CATEGORIES };

export function useTravelInfo(category: TravelCategory) {
  const [items, setItems] = useState<TravelInfoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, [category]);

  async function fetchItems() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (category !== "전체") params.append("category", category);

      const res = await fetch(`${API_BASE}/places?${params.toString()}`);
      if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError("여행 정보를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return { items, loading, error, refresh: fetchItems };
}
