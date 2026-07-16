import { useState, useEffect, useCallback } from "react";
import { ENV } from "@/config/env";
import { supabase } from "@/utils/supabaseClient";

const API_BASE = ENV.API_BASE_URL;

export type Review = {
  id: number;
  user_id: string | null;
  rating: number;
  title: string | null;
  content: string;
  image_url: string | null;
  created_at: string;
};

export type PlaceDetail = {
  id: number | string;
  name: string;
  address: string;
  description: string;
  thumbnail_url: string | null;
  latitude: number | null;
  longitude: number | null;
  category: string | null;
  reviews: Review[];
};

export type YoutuberMeta = {
  youtuber: string;
  sourceVideoUrl: string | null;
  ratingNote: string | null;
};

export function usePlaceDetail(placeId: number | string, source?: "youtuber") {
  const [place, setPlace] = useState<PlaceDetail | null>(null);
  const [youtuberMeta, setYoutuberMeta] = useState<YoutuberMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchPlaceDetail = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      if (source === "youtuber") {
        const { data, error: sbError } = await supabase
          .from("youtuber_places")
          .select(
            "id, name, address, latitude, longitude, category, info, thumbnail_url, youtuber, rating_note, source_video_url"
          )
          .eq("id", placeId)
          .single();
        if (sbError) throw sbError;

        setPlace({
          id: data.id,
          name: data.name,
          address: data.address ?? "",
          description: data.info ?? "",
          thumbnail_url: data.thumbnail_url ?? "",
          latitude: data.latitude,
          longitude: data.longitude,
          category: data.category,
          reviews: [],
        });
        setYoutuberMeta({
          youtuber: data.youtuber,
          sourceVideoUrl: data.source_video_url,
          ratingNote: data.rating_note,
        });
      } else {
        const res = await fetch(`${API_BASE}/places/${placeId}`);
        if (!res.ok) throw new Error(`장소 조회 실패: ${res.status}`);
        const data = await res.json();
        setPlace({ ...data, reviews: data.reviews ?? [] });
        setYoutuberMeta(null);
      }
    } catch (err) {
      console.error("place detail fetch 실패", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [placeId, source]);

  useEffect(() => {
    fetchPlaceDetail();
  }, [fetchPlaceDetail]);

  return { place, youtuberMeta, loading, error, refetch: fetchPlaceDetail };
}
