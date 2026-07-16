import { useState } from "react";
import Constants from "expo-constants";

const MAPS_KEY =
  (Constants.expoConfig?.extra?.MAPS_PLATFORM_API_KEY as string) ?? "";

export type Place = {
  id: string; // Google place_id
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  thumbnail_url: string | null;
};

export function usePlaceSearch() {
  const [results, setResults] = useState<Place[]>([]);

  const search = async (query: string) => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    try {
      const url =
        `https://maps.googleapis.com/maps/api/place/textsearch/json` +
        `?query=${encodeURIComponent(query)}` +
        `&key=${MAPS_KEY}` +
        `&language=ko` +
        `&region=jp`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.status === "ZERO_RESULTS") {
        setResults([]);
        return;
      }

      if (data.status !== "OK") {
        console.error("[usePlaceSearch] Google Places 오류:", data.status, data.error_message);
        setResults([]);
        return;
      }

      const places: Place[] = (data.results ?? []).slice(0, 5).map((item: any) => ({
        id: item.place_id,
        name: item.name,
        latitude: item.geometry.location.lat,
        longitude: item.geometry.location.lng,
        address: item.formatted_address,
        thumbnail_url: item.photos?.[0]
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=120&photo_reference=${item.photos[0].photo_reference}&key=${MAPS_KEY}`
          : null,
      }));

      setResults(places);
    } catch (err: any) {
      console.error("[usePlaceSearch] 검색 실패:", err?.message);
      setResults([]);
    }
  };

  const clear = () => setResults([]);

  return { results, search, clear };
}

// 지도를 길게 눌러 좌표만 있을 때 이름/주소를 채워주기 위한 역지오코딩
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<{ name: string; address: string } | null> {
  try {
    const url =
      `https://maps.googleapis.com/maps/api/geocode/json` +
      `?latlng=${latitude},${longitude}` +
      `&key=${MAPS_KEY}` +
      `&language=ko`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== "OK" || !data.results?.[0]) return null;

    const result = data.results[0];
    const name = result.address_components?.[0]?.long_name ?? result.formatted_address;
    return { name, address: result.formatted_address };
  } catch (err: any) {
    console.error("[reverseGeocode] 실패:", err?.message);
    return null;
  }
}
