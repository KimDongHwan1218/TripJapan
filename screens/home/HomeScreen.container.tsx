// screens/Home/HomeScreen.container.tsx

import React from "react";
import HomeScreenView from "./HomeScreen.view";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

import { HomeStackParamList } from "@/navigation/HomeStackNavigator";
import { MainTabParamList } from "@/navigation/MainTabNavigator";

import { useTrip } from "@/contexts/TripContext";
import { getTripPhase } from "@/domain/tripPhase";
import { useHomeData } from "./hooks/useHomeData";
import { useWeather } from "./hooks/useWeather";
import { useExchangeRate } from "./hooks/useExchangeRate";

type MainTabNav = BottomTabNavigationProp<MainTabParamList, "홈">;
type HomeNav = NativeStackNavigationProp<HomeStackParamList, "Home">;

export default function HomeScreenContainer() {
  const stackNavigation = useNavigation<HomeNav>();
  const tabNavigation = useNavigation<MainTabNav>();

  const { activeTrip } = useTrip();
  const city = activeTrip?.city ?? "Tokyo";

  const { destinations, tips, loading } = useHomeData();
  const { temperature, weatherCode } = useWeather(city);
  const { exchangeRate } = useExchangeRate();

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
