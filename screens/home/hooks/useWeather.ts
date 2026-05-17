import { useEffect, useState } from "react";

const CITY_COORDS: Record<string, { lat: number; lon: number }> = {
  Tokyo: { lat: 35.69, lon: 139.69 },
  도쿄: { lat: 35.69, lon: 139.69 },
  Osaka: { lat: 34.69, lon: 135.5 },
  오사카: { lat: 34.69, lon: 135.5 },
  Kyoto: { lat: 35.01, lon: 135.77 },
  교토: { lat: 35.01, lon: 135.77 },
  Sapporo: { lat: 43.06, lon: 141.35 },
  삿포로: { lat: 43.06, lon: 141.35 },
  Fukuoka: { lat: 33.59, lon: 130.4 },
  후쿠오카: { lat: 33.59, lon: 130.4 },
  Okinawa: { lat: 26.21, lon: 127.68 },
  오키나와: { lat: 26.21, lon: 127.68 },
  Nara: { lat: 34.69, lon: 135.83 },
  나라: { lat: 34.69, lon: 135.83 },
  Kobe: { lat: 34.69, lon: 135.2 },
  고베: { lat: 34.69, lon: 135.2 },
  Nagoya: { lat: 35.18, lon: 136.9 },
  나고야: { lat: 35.18, lon: 136.9 },
  Hakone: { lat: 35.23, lon: 139.11 },
  하코네: { lat: 35.23, lon: 139.11 },
  Yokohama: { lat: 35.44, lon: 139.64 },
  요코하마: { lat: 35.44, lon: 139.64 },
};

export function useWeather(city: string) {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [weatherCode, setWeatherCode] = useState<number | null>(null);

  useEffect(() => {
    const coords = CITY_COORDS[city] ?? CITY_COORDS["Tokyo"];
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
