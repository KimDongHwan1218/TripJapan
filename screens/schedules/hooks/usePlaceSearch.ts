import { useState } from "react";
import { ENV } from "@/config/env";

const API_BASE = ENV.API_BASE_URL;

export type Place = {
  id: number | string; // 우리 DB의 places.id (지도 롱프레스로 임의 지점을 찍은 경우만 "tap-..." 문자열)
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  category?: string | null;
  thumbnail_url: string | null;
  avg_rating?: number | null;
  review_count?: number;
};

export function usePlaceSearch() {
  const [results, setResults] = useState<Place[]>([]);

  const search = async (query: string) => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/places/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) {
        setResults([]);
        return;
      }
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("[usePlaceSearch] 검색 실패:", err?.message);
      setResults([]);
    }
  };

  const clear = () => setResults([]);

  return { results, search, clear };
}

// 지도를 길게 눌러 좌표만 있을 때, 우리 DB에서 가장 가까운 장소(반경 50m 이내)를 찾아
// 이름/주소를 채워준다 — 임의 좌표를 구글 지오코딩으로 되돌리면 실제 탭 지점과 무관한
// 주소 텍스트가 나오는 문제가 있어서 우리 장소 데이터 기준으로 바꿈
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<{ name: string; address: string; placeId: number } | null> {
  try {
    const res = await fetch(`${API_BASE}/places/nearest?lat=${latitude}&lng=${longitude}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.place) return null;
    return { name: data.place.name, address: data.place.address, placeId: data.place.id };
  } catch (err: any) {
    console.error("[reverseGeocode] 실패:", err?.message);
    return null;
  }
}
