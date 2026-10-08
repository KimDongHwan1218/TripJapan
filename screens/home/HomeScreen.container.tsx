// screens/Home/HomeScreen.container.tsx

import React from "react";
import HomeScreenView from "./HomeScreen.view";
import HomeScreenViewV2 from "./HomeScreen.view.v2";
import HomeScreenViewV3 from "./HomeScreen.view.v3";
import HomeScreenViewV4 from "./HomeScreen.view.v4";
import type { HomeVariantProps } from "./homeVariantShared";
import { useAuth } from "@/contexts/AuthContext";
import { useScreenVariant } from "@/contexts/DesignContext";
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

  // 디자인 시안: A 현재 / B 상황별 홈(진단 H1~H4) — 우상단 선택 버튼으로 전환
  const variant = useScreenVariant("home", ["현재", "상황별 홈", "도시 매거진", "위젯 대시보드"]);
  const { user } = useAuth();

  const { activeTrip, tripDays, schedules } = useTrip();
  const city = activeTrip?.city ?? "Tokyo";

  const { destinations, tips, loading } = useHomeData();
  const { weatherCode, temperature } = useWeather(city);
  const { exchangeRate, exchangeRateDiff } = useExchangeRate();

  const tripPhase = activeTrip ? getTripPhase(activeTrip) : null;

  // 시안 C·D용 오늘 일정(시안 B는 아래에 같은 계산이 있음 — A 승격 시 하나로 합칠 것)
  function getTodaySchedules() {
    const t = new Date();
    const todayStr = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
    const day = tripDays.find((d) => d.date?.slice(0, 10) === todayStr);
    return day
      ? schedules.filter((s) => s.trip_day_id === day.id).sort((a, b) => (a.time ?? "").localeCompare(b.time ?? ""))
      : [];
  }

  if (variant === 2 || variant === 3) {
    const vp: HomeVariantProps = {
      nickname: user?.nickname ?? "",
      city,
      destinations,
      activeTrip,
      tripPhase,
      todaySchedules: getTodaySchedules(),
      temperature,
      weatherCode,
      exchangeRate,
      exchangeRateDiff,
      onPressMyTrip: () => tabNavigation.navigate("일정"),
      onPressCreateTrip: () =>
        tabNavigation.navigate("일정", { screen: "TripHistoryScreen", params: { openCreate: true }, initial: false } as any),
      onPressWeather: () => stackNavigation.navigate("WeatherDetail", { city: CITY_META[city]?.label.ko ?? "도쿄" }),
      onPressExchange: () => stackNavigation.navigate("ExchangeRateDetail"),
      onPressTranslation: () => stackNavigation.navigate("TranslationSelect"),
      onPressTravelAlert: () => stackNavigation.navigate("TravelAlertDetail"),
      onPressTaviTalk: () => tabNavigation.navigate("타비톡"),
      onPressTaviTalkPost: (postId) =>
        tabNavigation.navigate("타비톡", { screen: "PostDetailScreen", params: { postId }, initial: false } as any),
      onPressTaviPickAll: () => tabNavigation.navigate("검색", { screen: "SearchHomeScreen", params: { query: "" } } as any),
    };
    return variant === 2 ? <HomeScreenViewV3 {...vp} /> : <HomeScreenViewV4 {...vp} />;
  }

  if (variant === 1) {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const todayDay = tripDays.find((d) => d.date?.slice(0, 10) === todayStr);
    const todaySchedules = todayDay
      ? schedules.filter((s) => s.trip_day_id === todayDay.id).sort((a, b) => (a.time ?? "").localeCompare(b.time ?? ""))
      : [];
    return (
      <HomeScreenViewV2
        destinations={destinations}
        activeTrip={activeTrip}
        tripPhase={tripPhase}
        todaySchedules={todaySchedules}
        temperature={temperature}
        exchangeRate={exchangeRate}
        exchangeRateDiff={exchangeRateDiff}
        onPressMyTrip={() => tabNavigation.navigate("일정")}
        onPressCreateTrip={() =>
          tabNavigation.navigate("일정", { screen: "TripHistoryScreen", params: { openCreate: true }, initial: false } as any)
        }
        onPressWeather={() => stackNavigation.navigate("WeatherDetail", { city: CITY_META[city]?.label.ko ?? "도쿄" })}
        onPressExchange={() => stackNavigation.navigate("ExchangeRateDetail")}
        onPressTranslation={() => stackNavigation.navigate("TranslationSelect")}
        onPressTravelAlert={() => stackNavigation.navigate("TravelAlertDetail")}
        onPressTaviTalk={() => tabNavigation.navigate("타비톡")}
        onPressTaviTalkPost={(postId) =>
          tabNavigation.navigate("타비톡", { screen: "PostDetailScreen", params: { postId }, initial: false } as any)
        }
        onPressTaviPickAll={() => tabNavigation.navigate("검색", { screen: "SearchHomeScreen", params: { query: "" } } as any)}
      />
    );
  }

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
