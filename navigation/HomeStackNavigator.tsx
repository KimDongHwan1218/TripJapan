import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreenContainer from "../screens/home/HomeScreen.container";
import TravelInfoScreen from "../screens/home/TravelInfoScreen";
import ReviewWriteScreen from "../screens/home/ReviewWriteScreen";
import TranslationSelectScreen from "../screens/home/translation/TranslationSelectScreen";
import TextTranslationScreen from "../screens/home/translation/TextTranslationScreen";
import ImageTranslationScreen from "../screens/home/translation/ImageTranslationScreen";
import VoiceTranslationScreen from "../screens/home/translation/VoiceTranslationScreen";
import WeatherDetailScreen from "../screens/home/WeatherDetailScreen";
import ExchangeRateDetailScreen from "../screens/home/ExchangeRateDetailScreen";
import TravelAlertDetailScreen from "../screens/home/TravelAlertDetailScreen";
import TravelAlertItemScreen from "../screens/home/TravelAlertItemScreen";

export type HomeStackParamList = {
  Home: undefined;
  TravelInfo: undefined;
  TravelInfoDetail: { placeId: number };
  ReviewWrite: { placeId: number; placeName: string };
  TranslationSelect: undefined;
  TextTranslation: undefined;
  ImageTranslation: undefined;
  VoiceTranslation: undefined;
  WeatherDetail: { city: string };
  ExchangeRateDetail: undefined;
  TravelAlertDetail: undefined;
  TravelAlertItem: { alert: { id: string; title: string; date: string; content: string } };
  // 항공/호텔/투어 스택은 2026-10 제거(화면에 진입 버튼이 없던 미완성 기능, 파일은 screens/home/flight|Hotel|Tour에 남아있음)
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreenContainer} />
      <Stack.Screen name="TranslationSelect" component={TranslationSelectScreen} />
      <Stack.Screen name="TextTranslation" component={TextTranslationScreen} />
      <Stack.Screen name="ImageTranslation" component={ImageTranslationScreen} />
      <Stack.Screen name="VoiceTranslation" component={VoiceTranslationScreen} />
      <Stack.Screen name="TravelInfo" component={TravelInfoScreen} />
      <Stack.Screen name="TravelInfoDetail" component={TravelInfoScreen} />
      <Stack.Screen name="ReviewWrite" component={ReviewWriteScreen} />
      <Stack.Screen name="WeatherDetail" component={WeatherDetailScreen} />
      <Stack.Screen name="ExchangeRateDetail" component={ExchangeRateDetailScreen} />
      <Stack.Screen name="TravelAlertDetail" component={TravelAlertDetailScreen} />
      <Stack.Screen name="TravelAlertItem" component={TravelAlertItemScreen} />
    </Stack.Navigator>
  );
}
