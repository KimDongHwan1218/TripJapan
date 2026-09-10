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
import { CITY_META } from "@/constants/cities";

type MainTabNav = BottomTabNavigationProp<MainTabParamList, "홈">;
type HomeNav = NativeStackNavigationProp<HomeStackParamList, "Home">;

export default function HomeScreenContainer() {
  const stackNavigation = useNavigation<HomeNav>();
  const tabNavigation = useNavigation<MainTabNav>();

  const { activeTrip } = useTrip();
  const city = activeTrip?.city ?? "Tokyo";

  const { destinations, tips, loading } = useHomeData();
  const { weatherCode } = useWeather(city);
  const { exchangeRate, exchangeRateDiff } = useExchangeRate();

  const tripPhase = activeTrip ? getTripPhase(activeTrip) : null;

  return (
    <HomeScreenView
      loading={loading}
      destinations={destinations}
      activeTrip={activeTrip}
      tripPhase={tripPhase}
      city={city}
      weatherCode={weatherCode}
      exchangeRate={exchangeRate}
      exchangeRateDiff={exchangeRateDiff}
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
      onPressTranslation={() => stackNavigation.navigate("TranslationSelect")}
      onPressTaviTalk={() => tabNavigation.navigate("타비톡")}
      onPressTaviTalkShortcut={() => tabNavigation.navigate("타비톡")}
      onPressWeather={() =>
        // WeatherDetailScreen은 한글 도시명 문자열로 도시를 구분하는데, 여기 city는
        // TripCity(영문 키)라 그대로 넘기면 매칭이 안 돼서 항상 도쿄로 표시되던 버그가 있었음
        stackNavigation.navigate("WeatherDetail", { city: CITY_META[city]?.label.ko ?? "도쿄" })
      }
      onPressExchange={() => stackNavigation.navigate("ExchangeRateDetail")}
      onPressTravelAlert={() => stackNavigation.navigate("TravelAlertDetail")}
    />
  );
}
