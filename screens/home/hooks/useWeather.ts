import { useEffect, useState } from "react";
import { CITY_META, type TripCity } from "@/constants/cities";

// 좌표를 따로 하드코딩하지 않고 constants/cities.ts(CITY_META)를 그대로 씀 —
// 예전엔 이 파일에 도시 좌표를 따로 들고 있어서 Beppu/Takayama/Otaru/Yufuin처럼
// TripCity엔 있는데 여기엔 빠진 도시가 생기고, 그런 도시로 여행 중이면 조용히
// 도쿄 날씨로 fallback 되는 버그가 있었음.
function resolveCoords(city: string) {
  const meta = CITY_META[city as TripCity];
  const center = meta?.center ?? CITY_META.Tokyo.center;
  return { lat: center.lat, lon: center.lng };
}

export function useWeather(city: string) {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [weatherCode, setWeatherCode] = useState<number | null>(null);

  useEffect(() => {
    const coords = resolveCoords(city);
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,weather_code&timezone=Asia%2FTokyo`
    )
      .then((res) => res.json())
      .then((data) => {
        setTemperature(data.current.temperature_2m);
        setWeatherCode(data.current.weather_code);
      })
      .catch((err) => console.error("Weather fetch error:", err));
  }, [city]);

  return { temperature, weatherCode };
}
