import { useState } from "react";
import Constants from "expo-constants";
import { ENV } from "@/config/env";

const API_BASE = ENV.API_BASE_URL;
const MAPS_KEY = (Constants.expoConfig?.extra?.MAPS_PLATFORM_API_KEY as string) ?? "";

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

type ReverseGeocodeResult = { name: string; address: string; placeId: number | string };

// 지도를 길게 눌러 좌표만 있을 때 그 위치의 실제 지명을 찾아준다. 3단계로 시도:
// 1) 우리 DB에서 가장 가까운 장소(반경 50m 이내, 무료·큐레이션된 데이터 우선)
// 2) 없으면 Google Places 근처 검색으로 실제 장소명을 찾음(반경 80m)
// 3) 그마저 없으면 역지오코딩으로 최소한 주소 텍스트라도 채움
// 셋 다 실패해야만 호출부가 "선택한 위치"라는 일반 텍스트로 남겨둠 — 예전엔 1번만
// 시도해서 우리 DB에 없는 곳은 전부 "선택한 위치"로만 떠서 어디인지 알 수가 없었음
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<ReverseGeocodeResult | null> {
  try {
    const res = await fetch(`${API_BASE}/places/nearest?lat=${latitude}&lng=${longitude}`);
    if (res.ok) {
      const data = await res.json();
      if (data.place) {
        return { name: data.place.name, address: data.place.address, placeId: data.place.id };
      }
    }
  } catch (err: any) {
    console.error("[reverseGeocode] DB 조회 실패:", err?.message);
  }

  if (!MAPS_KEY) return null;

  try {
    const nearbyRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=80&key=${MAPS_KEY}&language=ko`
    );
    const nearbyData = await nearbyRes.json();
    const nearest = nearbyData?.results?.[0];
    if (nearest?.name) {
      return {
        name: nearest.name,
        address: nearest.vicinity ?? "",
        placeId: `google-${nearest.place_id}`,
      };
    }
  } catch (err: any) {
    console.error("[reverseGeocode] Places 근처 검색 실패:", err?.message);
  }

  try {
    const geoRes = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${MAPS_KEY}&language=ko`
    );
    const geoData = await geoRes.json();
    const first = geoData?.results?.[0];
    if (first?.formatted_address) {
      return {
        name: first.formatted_address,
        address: first.formatted_address,
        placeId: `geo-${latitude}-${longitude}`,
      };
    }
  } catch (err: any) {
    console.error("[reverseGeocode] 역지오코딩 실패:", err?.message);
  }

  return null;
}
