import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SchedulingScreen from "../screens/schedules/SchedulingScreen";
import ScheduleDetailScreen from "../screens/schedules/ScheduleDetailScreen";

// ✅ 일정 타입 정의
export type Plan = {
  time: string;
  title: string;
  detail: string;
  place?: string;
};

// ✅ 네비게이션 ParamList 정의
export type ScheduleStackParamList = {
  SchedulingScreen: undefined;
  ScheduleDetailScreen: {
    date: string;   // 날짜 키 (yyyy-MM-dd)
    plan?: Plan;    // 있으면 수정, 없으면 새 일정 추가
  };
};

const Stack = createNativeStackNavigator<ScheduleStackParamList>();

export default function ScheduleStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="SchedulingScreen" 
        component={SchedulingScreen} 
        options={{ title: "스케쥴홈" }} 
      />
      <Stack.Screen 
        name="ScheduleDetailScreen" 
        component={ScheduleDetailScreen} 
        options={{ title: "세부계획" }} 
      />
    </Stack.Navigator>
  );
}
