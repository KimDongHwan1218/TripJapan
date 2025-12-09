// screens/home/HomeScreen.container.tsx
import React, { useEffect, useState } from "react";
import HomeScreenView from "./HomeScreen.view";
import { useNavigation } from "@react-navigation/native";

const API_URL = "https://tavi-server.onrender.com";

export default function HomeScreenContainer() {
  const navigation = useNavigation<any>();

  // --- States ---
  const [flights, setFlights] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [tips, setTips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Fetch Home Data (flights + slides + tips) ---
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [flightRes, slidesRes, tipsRes] = await Promise.all([
          fetch(`${API_URL}/flights`),
          fetch(`${API_URL}/slides`),
          fetch(`${API_URL}/tips`),
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

  // --- Handlers ---
  const onPressMyTrip = () => navigation.navigate("일정");
  const onPressFlight = () => navigation.navigate("검색");
  const onPressHotel = () => navigation.navigate("검색");
  const onPressTour = () => navigation.navigate("검색");

  const onPressDestination = (id: string) => {
    navigation.navigate("검색", { id });
  };

  const onPressFAB = (action: "translate" | "myTickets" | "pay") => {
    // 기존 FABMenu 내부에서 처리됨
  };

  return (
    <HomeScreenView
      loading={loading}

      flights={flights}
      hotels={[]}             // 추후 API 추가
      destinations={destinations}
      tips={tips}
      communityPreview={[]}   // 추후 API 추가
      upcomingTrip={null}

      onPressMyTrip={onPressMyTrip}
      onPressFlight={onPressFlight}
      onPressHotel={onPressHotel}
      onPressTour={onPressTour}
      onPressDestination={onPressDestination}
      onPressFAB={onPressFAB}
    />
  );
}
