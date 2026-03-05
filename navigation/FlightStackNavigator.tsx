import { createNativeStackNavigator } from "@react-navigation/native-stack";

import FlightHomeScreen from "@/screens/home/flight/FlightHomeScreen";
import FlightSearchResultScreen from "@/screens/home/flight/FlightSearchResultScreen";
import FlightDetailScreen from "@/screens/home/flight/FlightDetailScreen";
import ExternalWebViewScreen from "@/screens/home/flight/ExternalWebViewScreen";

/**
 * ======================================================
 * Stack Param List
 * ======================================================
 */
export type FlightStackParamList = {
  FlightHome: undefined;

  FlightSearchResult: {
    searchId: string;
    from: string;
    to: string;
    departDate: string;
    returnDate?: string;
    adults: number;
    cabin: "economy" | "business";
    tripType: "oneway" | "roundtrip";
  };

  FlightDetail: {
    offerId: string;
  };

  ExternalWebView: {
    url: string;
  };
};

const Stack = createNativeStackNavigator<FlightStackParamList>();

/**
 * ======================================================
 * Navigator
 * ======================================================
 */
export function FlightStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="FlightHome"
    >
      <Stack.Screen
        name="FlightHome"
        component={FlightHomeScreen}
        options={{ title: "항공권 검색" }}
      />

      <Stack.Screen
        name="FlightSearchResult"
        component={FlightSearchResultScreen}
        options={{ title: "검색 결과" }}
      />

      <Stack.Screen
        name="FlightDetail"
        component={FlightDetailScreen}
        options={{ title: "항공편 상세" }}
      />

      <Stack.Screen
        name="ExternalWebView"
        component={ExternalWebViewScreen}
        options={{ title: "예약 진행" }}
      />
    </Stack.Navigator>
  );
}
