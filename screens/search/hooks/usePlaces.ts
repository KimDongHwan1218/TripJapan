import { useCallback, useEffect, useRef, useState } from "react";
import { ENV } from "@/config/env";
import { supabase } from "@/utils/supabaseClient";
import { mapYoutuberCategoryToAppCategory } from "../utils/mapYoutuberCategory";
import type { BadgeType } from "../types";

const API_BASE = ENV.API_BASE_URL;
const PAGE_SIZE = 30;

export type Place = {
  id: number | string;
  name: string;
  name_ko?: string | null;
  address: string;
  category: string | null;
  thumbnail_url: string;
  avg_rating?: number | null;
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

async function fetchPlacesPage(selectedCategory: string, query: string, offset: number): Promise<Place[]> {
  const params = new URLSearchParams();
  if (selectedCategory) params.append("category", selectedCategory);
  if (query) params.append("keyword", query);
  params.append("limit", String(PAGE_SIZE));
  params.append("offset", String(offset));

  try {
    const res = await fetch(`${API_BASE}/places?${params.toString()}`);
    return await res.json();
  } catch (err) {
    console.error("places fetch 실패", err);
    return [];
  }
}

// 장소가 13만 건이 넘어서 한 번에 다 불러올 수 없음 — 페이지 단위로 불러오고
// 스크롤이 끝에 닿으면 loadMore()로 다음 페이지를 이어붙임
export function usePlaces(selectedCategory: string, query: string, skip = false) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const offsetRef = useRef(0);
  const requestIdRef = useRef(0);

  const loadPage = useCallback(
    async (reset: boolean) => {
      if (skip) return;
      const requestId = ++requestIdRef.current;
      const offset = reset ? 0 : offsetRef.current;

      if (reset) {
        setLoading(true);
        setPlaces([]);
        setHasMore(true);
      } else {
        setLoadingMore(true);
      }

      const [apiPlaces, youtuberPlaces] = await Promise.all([
        fetchPlacesPage(selectedCategory, query, offset),
        reset ? fetchYoutuberPlaces(selectedCategory, query) : Promise.resolve([]),
      ]);

      if (requestId !== requestIdRef.current) return; // 그새 다른 요청으로 대체됨 — 무시

      const combined = reset ? [...apiPlaces, ...youtuberPlaces] : apiPlaces;
      setPlaces((prev) => (reset ? combined : [...prev, ...combined]));
      offsetRef.current = offset + apiPlaces.length;
      setHasMore(apiPlaces.length === PAGE_SIZE);
      setLoading(false);
      setLoadingMore(false);
    },
    [selectedCategory, query, skip]
  );

  useEffect(() => {
    loadPage(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, query, skip]);

  const loadMore = useCallback(() => {
    if (loading || loadingMore || !hasMore) return;
    loadPage(false);
  }, [loading, loadingMore, hasMore, loadPage]);

  return { places, loading, loadingMore, hasMore, loadMore, refresh: () => loadPage(true) };
}
