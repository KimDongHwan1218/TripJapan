import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SchedulingScreen from "../screens/schedules/SchedulingScreen";
import ScheduleDetailScreen from "../screens/schedules/ScheduleDetailScreen";
import TripHistoryScreen from "../screens/schedules/TripHistoryScreen";
import AddTripScreen from "../screens/schedules/AddTripScreen";
import { TripProvider } from "@/contexts/TripContext";

// ✅ 일정 타입 정의
export type Plan = {
  time: string;
  title: string;
  detail: string;
  place?: string;
};

// ✅ 네비게이션 ParamList 정의
export type ScheduleStackParamList = {
  AddTripScreen: {region?: string} | undefined;
  TripHistoryScreen: undefined;
  SchedulingScreen: undefined;
  ScheduleDetailScreen: {
    date: string;
    plan?: Plan;
  };
};

const Stack = createNativeStackNavigator<ScheduleStackParamList>();

export default function ScheduleStackNavigator() {
  return (
    <TripProvider>
      <Stack.Navigator
        screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen 
          name="SchedulingScreen" 
          component={SchedulingScreen} 
        />
        <Stack.Screen 
          name="AddTripScreen" 
          component={AddTripScreen} 
        />
        <Stack.Screen 
          name="TripHistoryScreen" 
          component={TripHistoryScreen} 
        />
        <Stack.Screen 
          name="ScheduleDetailScreen" 
          component={ScheduleDetailScreen} 
        />
      </Stack.Navigator>
    </TripProvider>
    
  );
}
