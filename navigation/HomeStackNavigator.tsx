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
import { FlightStackNavigator } from "./FlightStackNavigator";
import { HotelStackNavigator } from "./HotelStackNavigator";
import { TourStackNavigator } from "./TourStackNavigator";

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
  TravelAlertItem: { alertId: string };
  FlightStack: undefined;
  HotelStack: undefined;
  TourStack: undefined;
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
      <Stack.Screen name="FlightStack" component={FlightStackNavigator} />
      <Stack.Screen name="HotelStack" component={HotelStackNavigator} />
      <Stack.Screen name="TourStack" component={TourStackNavigator} />
    </Stack.Navigator>
  );
}
