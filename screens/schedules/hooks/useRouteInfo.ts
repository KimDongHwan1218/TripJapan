import { useState, useEffect } from "react";
import Constants from "expo-constants";

const MAPS_KEY =
  (Constants.expoConfig?.extra?.MAPS_PLATFORM_API_KEY as string) ?? "";

export type TravelMode = "walking" | "transit";

export type RouteSegment = {
  distance: string; // "1.2 km"
  duration: string; // "15분"
};

export type RouteInfo = {
  segments: RouteSegment[]; // 길이 = 일정 수 - 1
  polylinePoints: { latitude: number; longitude: number }[];
};

// Google 인코딩 폴리라인 디코더
function decodePolyline(encoded: string): { latitude: number; longitude: number }[] {
  const points: { latitude: number; longitude: number }[] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let b: number;
    let shift = 0;
    let result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lat += result & 1 ? ~(result >> 1) : result >> 1;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lng += result & 1 ? ~(result >> 1) : result >> 1;

    points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }
  return points;
}

// 세션 내 메모리 캐시 (앱 재시작 전까지 유지)
const cache = new Map<string, RouteInfo>();

export function useRouteInfo(
  coordinates: { latitude: number; longitude: number }[],
  mode: TravelMode = "walking"
) {
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);

  const coordKey = coordinates.map((c) => `${c.latitude},${c.longitude}`).join("|");
  const cacheKey = `${coordKey}__${mode}`;

  useEffect(() => {
    if (coordinates.length < 2) {
      setRouteInfo(null);
      return;
    }

    // 캐시 히트
    if (cache.has(cacheKey)) {
      setRouteInfo(cache.get(cacheKey)!);
      return;
    }

    const fetchSegment = async (
      from: { latitude: number; longitude: number },
      to: { latitude: number; longitude: number }
    ) => {
      const departureTime =
        mode === "transit"
          ? `&departure_time=${Math.floor(Date.now() / 1000)}`
          : "";

      const url =
        `https://maps.googleapis.com/maps/api/directions/json` +
        `?origin=${from.latitude},${from.longitude}` +
        `&destination=${to.latitude},${to.longitude}` +
        `&mode=${mode}` +
        departureTime +
        `&language=ko` +
        `&key=${MAPS_KEY}`;

      const res = await fetch(url);
      return res.json();
    };

    const fetchRoute = async () => {
      try {
        if (mode === "walking") {
          // 도보: waypoints 지원 → 한 번에 호출
          const midpoints = coordinates.slice(1, -1);
          const waypoints = midpoints.length
            ? `&waypoints=${midpoints.map((c) => `${c.latitude},${c.longitude}`).join("|")}`
            : "";

          const url =
            `https://maps.googleapis.com/maps/api/directions/json` +
            `?origin=${coordinates[0].latitude},${coordinates[0].longitude}` +
            `&destination=${coordinates[coordinates.length - 1].latitude},${coordinates[coordinates.length - 1].longitude}` +
            waypoints +
            `&mode=walking` +
            `&language=ko` +
            `&key=${MAPS_KEY}`;

          const res = await fetch(url);
          const data = await res.json();

          if (data.status !== "OK") {
            setRouteInfo(null);
            return;
          }

          const route = data.routes[0];
          const segments: RouteSegment[] = route.legs.map((leg: any) => ({
            distance: leg.distance.text,
            duration: leg.duration.text,
          }));
          const polylinePoints = decodePolyline(route.overview_polyline.points);
          const result: RouteInfo = { segments, polylinePoints };
          cache.set(cacheKey, result);
          setRouteInfo(result);
        } else {
          // 대중교통: waypoints 미지원 → 구간별 개별 호출
          const pairs = coordinates.slice(0, -1).map((from, i) => ({
            from,
            to: coordinates[i + 1],
          }));

          const results = await Promise.all(
            pairs.map(({ from, to }) => fetchSegment(from, to))
          );

          const segments: RouteSegment[] = [];
          const polylinePoints: { latitude: number; longitude: number }[] = [];

          for (const data of results) {
            if (data.status !== "OK") {
              segments.push({ distance: "-", duration: "-" });
              continue;
            }
            const leg = data.routes[0].legs[0];
            segments.push({
              distance: leg.distance.text,
              duration: leg.duration.text,
            });
            polylinePoints.push(
              ...decodePolyline(data.routes[0].overview_polyline.points)
            );
          }

          const result: RouteInfo = { segments, polylinePoints };
          cache.set(cacheKey, result);
          setRouteInfo(result);
        }
      } catch (err) {
        console.error("[useRouteInfo]", err);
        setRouteInfo(null);
      }
    };

    fetchRoute();
  }, [cacheKey]);

  return routeInfo;
}
