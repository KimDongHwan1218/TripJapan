import { ENV } from "@/config/env";
import { supabase } from "@/utils/supabaseClient";
import { useCachedQuery } from "@/hooks/useCachedQuery";
import { mapYoutuberCategoryToAppCategory } from "../utils/mapYoutuberCategory";
import type { BadgeType } from "../types";

const API_BASE = ENV.API_BASE_URL;

export type Place = {
  id: number | string;
  name: string;
  address: string;
  category: string | null;
  thumbnail_url: string;
  latitude?: number | null;
  longitude?: number | null;
  badges?: BadgeType[];
  source?: "youtuber";
};

async function fetchYoutuberPlaces(selectedCategory: string, query: string): Promise<Place[]> {
  const { data, error } = await supabase
    .from("youtuber_places")
    .select("id, name, address, category, thumbnail_url, latitude, longitude, info");

  if (error) {
    console.error("youtuber_places fetch 실패", error);
    return [];
  }

  return (data ?? [])
    .map((row) => ({
      id: row.id as string,
      name: row.name as string,
      address: (row.address as string) ?? "",
      category: mapYoutuberCategoryToAppCategory(row.category as string | null),
      thumbnail_url: (row.thumbnail_url as string) ?? "",
      latitude: row.latitude as number | null,
      longitude: row.longitude as number | null,
      info: (row.info as string) ?? "",
      badges: ["YOUTUBER_PICK"] as BadgeType[],
      source: "youtuber" as const,
    }))
    .filter((p) => !selectedCategory || p.category === selectedCategory)
    .filter((p) => {
      if (!query) return true;
      const q = query.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.info.toLowerCase().includes(q);
    });
}

async function fetchPlaces(selectedCategory: string, query: string): Promise<Place[]> {
  const params = new URLSearchParams();
  if (selectedCategory) params.append("category", selectedCategory);
  if (query) params.append("keyword", query);

  const [apiPlaces, youtuberPlaces] = await Promise.all([
    fetch(`${API_BASE}/places?${params.toString()}`)
      .then((res) => res.json())
      .catch((err) => {
        console.error("places fetch 실패", err);
        return [];
      }),
    fetchYoutuberPlaces(selectedCategory, query),
  ]);

  return [...apiPlaces, ...youtuberPlaces];
}

export function usePlaces(selectedCategory: string, query: string, skip = false) {
  const key = `places::${selectedCategory}::${query}`;
  const { data, loading, refresh } = useCachedQuery(key, () => fetchPlaces(selectedCategory, query), { skip });

  return { places: data ?? [], loading, refresh };
}
