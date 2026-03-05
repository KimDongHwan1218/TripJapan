import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SchedulingScreen from "../screens/schedules/SchedulingScreen";
import TripHistoryScreen from "../screens/schedules/TripHistoryScreen";

// ✅ 일정 타입 정의
export type Plan = {
  time: string;
  title: string;
  detail: string;
  place?: string;
};

// ✅ 네비게이션 ParamList 정의
export type ScheduleStackParamList = {
  SchedulingScreen: {
    id: number;
    title: string;
    start_date: string;
    end_date: string;
  };
  TripHistoryScreen: undefined;
};

const Stack = createNativeStackNavigator<ScheduleStackParamList>();

export default function ScheduleStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
      headerShown: false,
    }}>
      <Stack.Screen 
        name="SchedulingScreen" 
        component={SchedulingScreen} 
      />
      <Stack.Screen 
        name="TripHistoryScreen" 
        component={TripHistoryScreen} 
      />

    </Stack.Navigator>
  );
}
