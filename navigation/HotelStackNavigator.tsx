import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HotelHomeScreen from "../screens/home/Hotel/HotelHomeScreen";
import HotelWebViewScreen from "../screens/home/Hotel/HotelWebViewScreen";

export type HotelStackParamList = {
  HotelHome: undefined;
  HotelWebView: { url: string };
};

const Stack = createNativeStackNavigator<HotelStackParamList>();

export function HotelStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HotelHome"
        component={HotelHomeScreen}
        options={{ title: "숙소" }}
      />

      <Stack.Screen
        name="HotelWebView"
        component={HotelWebViewScreen}
        options={{ title: "숙소 검색" }}
      />
    </Stack.Navigator>
  );
}
