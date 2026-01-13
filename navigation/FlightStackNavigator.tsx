import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import FlightHomeScreen from "../screens/home/flight/FlightHomeScreen";
import FlightWebViewScreen from "../screens/home/flight/FlightWebViewScreen";

export type FlightStackParamList = {
  FlightHome: undefined;
  FlightWebView: undefined;
};

const Stack = createNativeStackNavigator<FlightStackParamList>();

export function FlightStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="FlightHome"
        component={FlightHomeScreen}
        options={{ title: "항공권" }}
      />

      <Stack.Screen
        name="FlightWebView"
        component={FlightWebViewScreen}
        options={{ title: "항공권 검색" }}
      />
    </Stack.Navigator>
  );
}
