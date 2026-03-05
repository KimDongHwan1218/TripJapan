import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TourHomeScreen from "../screens/home/Tour/TourHomeScreen";
import TourWebViewScreen from "../screens/home/Tour/TourWebViewScreen";

export type TourStackParamList = {
  TourHome: undefined;
  TourWebView: { url: string };
};

const Stack = createNativeStackNavigator<TourStackParamList>();

export function TourStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TourHome"
        component={TourHomeScreen}
        options={{ title: "여행" }}
      />

      <Stack.Screen
        name="TourWebView"
        component={TourWebViewScreen}
        options={{ title: "여행 검색" }}
      />
    </Stack.Navigator>
  );
}
