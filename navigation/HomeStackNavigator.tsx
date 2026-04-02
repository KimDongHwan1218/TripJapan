import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreenContainer from "../screens/home/HomeScreen.container";
import TravelInfoScreen from "../screens/home/TravelInfoScreen";
import ReviewWriteScreen from "../screens/home/ReviewWriteScreen";
import { FlightStackNavigator } from "./FlightStackNavigator";
import { HotelStackNavigator } from "./HotelStackNavigator";
import { TourStackNavigator } from "./TourStackNavigator";

export type HomeStackParamList = {
  Home: undefined;
  TravelInfo: undefined;
  TravelInfoDetail: { placeId: number };
  ReviewWrite: { placeId: number; placeName: string };
  FlightStack: undefined;
  HotelStack: undefined;
  TourStack: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreenContainer} />
      <Stack.Screen name="TravelInfo" component={TravelInfoScreen} />
      <Stack.Screen name="TravelInfoDetail" component={TravelInfoScreen} />
      <Stack.Screen name="ReviewWrite" component={ReviewWriteScreen} />
      <Stack.Screen name="FlightStack" component={FlightStackNavigator} />
      <Stack.Screen name="HotelStack" component={HotelStackNavigator} />
      <Stack.Screen name="TourStack" component={TourStackNavigator} />
    </Stack.Navigator>
  );
}
