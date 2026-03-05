import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreenContainer from "../screens/home/HomeScreen.container";
import { FlightStackNavigator } from "./FlightStackNavigator";
import { HotelStackNavigator } from "./HotelStackNavigator";
import { TourStackNavigator } from "./TourStackNavigator";

export type HomeStackParamList = {
  Home: undefined;
  FlightStack: undefined;
  HotelStack: undefined;
  TourStack: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreenContainer}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="FlightStack"
        component={FlightStackNavigator}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="HotelStack"
        component={HotelStackNavigator}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="TourStack"
        component={TourStackNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
