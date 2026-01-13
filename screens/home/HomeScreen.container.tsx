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

export default function HomeScreenContainer() {
  const stackNavigation = useNavigation<HomeNav>();
  const tabNavigation = useNavigation<MainTabNav>();

  const { activeTrip } = useTrip();

  const [flights, setFlights] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [tips, setTips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [flightRes, slidesRes, tipsRes] = await Promise.all([
          fetch(`${API_BASE}/flights`),
          fetch(`${API_BASE}/slides`),
          fetch(`${API_BASE}/tips`),
        ]);

        const [flightData, slideData, tipData] = await Promise.all([
          flightRes.json(),
          slidesRes.json(),
          tipsRes.json(),
        ]);

        setFlights(flightData ?? []);
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

  // 🔹 여행 단계 계산 (UI 분기용)
  const tripPhase = activeTrip ? getTripPhase(activeTrip) : null;

  return (
    <HomeScreenView
      loading={loading}
      flights={flights}
      hotels={[]}
      destinations={destinations}
      tips={tips}
      upcomingTrip={null}

      activeTrip={activeTrip}
      tripPhase={tripPhase}

      onPressMyTrip={() => tabNavigation.navigate("일정")}
      onPressFlight={() => stackNavigation.navigate("FlightStack")}
      onPressHotel={() => stackNavigation.navigate("HotelStack")}
      onPressTour={() => stackNavigation.navigate("TourStack")}
      onPressShopping={() => tabNavigation.navigate("검색")}
      onPressInsurance={() => tabNavigation.navigate("검색")}
      onPressDestination={(id) =>
        tabNavigation.navigate("검색", { id })
      }
      onPressFAB={() => {}}
    />
  );
}
