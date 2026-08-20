import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SchedulingScreen from "../screens/schedules/SchedulingScreen";
import TripHistoryScreen from "../screens/schedules/TripHistoryScreen";
import TripEditScreen from "../screens/schedules/TripEditScreen";
import PastTripScreen from "../screens/schedules/PastTripScreen";
import ReviewWriteScreen from "../screens/home/ReviewWriteScreen";

export type Plan = {
  time: string;
  title: string;
  detail: string;
  place?: string;
};

export type ScheduleStackParamList = {
  SchedulingScreen: {
    id: number;
    title: string;
    start_date: string;
    end_date: string;
  };
  TripHistoryScreen: undefined;
  TripEditScreen: {
    tripDayId: number;
    date: string;
  };
  PastTripScreen: {
    tripId: number;
    city: string;
    start_date: string;
    end_date: string;
  };
  ReviewWrite: {
    placeId: number;
    placeName: string;
    existingReview?: { id: number; rating: number; title: string | null; content: string; image_urls: string[] };
  };
};

const Stack = createNativeStackNavigator<ScheduleStackParamList>();

export default function ScheduleStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SchedulingScreen" component={SchedulingScreen} />
      <Stack.Screen name="TripHistoryScreen" component={TripHistoryScreen} />
      <Stack.Screen name="TripEditScreen" component={TripEditScreen} />
      <Stack.Screen name="PastTripScreen" component={PastTripScreen} />
      <Stack.Screen name="ReviewWrite" component={ReviewWriteScreen} />
    </Stack.Navigator>
  );
}
