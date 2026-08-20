import { useEffect, useState } from "react";
import { ENV } from "@/config/env";

const API_BASE = ENV.API_BASE_URL;

export type AnimeTitle = {
  id: number;
  title: string;
  cover_image_url: string | null;
  spot_count: number;
};

export function useAnimeTitles(skip: boolean) {
  const [titles, setTitles] = useState<AnimeTitle[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (skip) return;
    if (titles.length > 0) return; // 목록은 자주 안 바뀌니 한 번만 로드
    setLoading(true);
    fetch(`${API_BASE}/anime-pilgrimage/titles`)
      .then((res) => res.json())
      .then((data) => setTitles(Array.isArray(data) ? data : []))
      .catch(() => setTitles([]))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip]);

  return { titles, loading };
}
