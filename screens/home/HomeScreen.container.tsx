// screens/Home/HomeScreen.container.tsx

import React, { useEffect, useState } from "react";
import HomeScreenView from "./HomeScreen.view";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

import { HomeStackParamList } from "@/navigation/HomeStackNavigator";
import { MainTabParamList } from "@/navigation/MainTabNavigator";

import { useTrip } from "@/contexts/TripContext";
import { getTripPhase } from "@/domain/tripPhase";
import { ENV } from "@/config/env";

type MainTabNav = BottomTabNavigationProp<MainTabParamList, "홈">;
type HomeNav = NativeStackNavigationProp<HomeStackParamList, "Home">;

const API_BASE = ENV.API_BASE_URL;

// 일본 주요 도시 좌표 (Open-Meteo용)
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

export default function HomeScreenContainer() {
  const stackNavigation = useNavigation<HomeNav>();
  const tabNavigation = useNavigation<MainTabNav>();

  const { activeTrip } = useTrip();

  const [destinations, setDestinations] = useState<any[]>([]);
  const [tips, setTips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [temperature, setTemperature] = useState<number | null>(null);
  const [weatherCode, setWeatherCode] = useState<number | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

  const city = activeTrip?.city ?? "Tokyo";

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [slidesRes, tipsRes] = await Promise.all([
          fetch(`${API_BASE}/slides`),
          fetch(`${API_BASE}/tips`),
        ]);
        const [slideData, tipData] = await Promise.all([
          slidesRes.json(),
          tipsRes.json(),
        ]);
        setDestinations(slideData ?? []);
        setTips(tipData ?? []);
      } catch (err) {
        console.error("Home fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // 날씨 (Open-Meteo - 무료, API 키 불필요)
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const coords = CITY_COORDS[city] ?? CITY_COORDS["Tokyo"];
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,weather_code&timezone=Asia%2FTokyo`
        );
        const data = await res.json();
        setTemperature(data.current.temperature_2m);
        setWeatherCode(data.current.weather_code);
      } catch (err) {
        console.error("Weather fetch error:", err);
      }
    };
    fetchWeather();
  }, [city]);

  // 환율 (Frankfurter - 유럽중앙은행 데이터, 무료)
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const res = await fetch(
          "https://api.frankfurter.app/latest?from=JPY&to=KRW"
        );
        const data = await res.json();
        setExchangeRate(data.rates.KRW * 100); // 100엔 기준 원화
      } catch (err) {
        console.error("Exchange rate fetch error:", err);
      }
    };
    fetchExchangeRate();
  }, []);

  const tripPhase = activeTrip ? getTripPhase(activeTrip) : null;

  return (
    <HomeScreenView
      loading={loading}
      destinations={destinations}
      tips={tips}
      activeTrip={activeTrip}
      tripPhase={tripPhase}
      city={city}
      temperature={temperature}
      weatherCode={weatherCode}
      exchangeRate={exchangeRate}
      onPressMyTrip={() => tabNavigation.navigate("일정")}
      onPressFlight={() => stackNavigation.navigate("FlightStack")}
      onPressHotel={() => stackNavigation.navigate("HotelStack")}
      onPressTour={() => stackNavigation.navigate("TourStack")}
      onPressShopping={() =>
        tabNavigation.navigate("검색", {
          screen: "SearchHomeScreen",
          params: { query: "" },
        })
      }
      onPressInsurance={() =>
        tabNavigation.navigate("검색", {
          screen: "SearchHomeScreen",
          params: { query: "" },
        })
      }
      onPressDestination={(id: number) =>
        tabNavigation.navigate("검색", {
          screen: "DetailScreen",
          params: { placeId: id },
        })
      }
      onPressFAB={(action) => {
        if (action === "myTickets") tabNavigation.navigate("일정");
      }}
    />
  );
}
