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
      onPressTranslation={() => stackNavigation.navigate("TranslationSelect")}
      onPressTaviTalk={() => tabNavigation.navigate("타비톡")}
      onPressTaviTalkShortcut={() => tabNavigation.navigate("타비톡")}
      // 미리보기 카드를 눌러도 타비톡 탭 첫 화면으로만 가던 것 — 해당 글 상세로 바로 이동
      onPressTaviTalkPost={(postId) =>
        tabNavigation.navigate("타비톡", { screen: "PostDetailScreen", params: { postId }, initial: false } as any)
      }
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
