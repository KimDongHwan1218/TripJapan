import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/home/HomeScreen";
import PostCreateScreen from "../screens/community/PostCreateScreen";
import CommentScreen from "../screens/community/CommentScreen";

export type HomeStackParamList = {
  HomeScreen: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
      headerShown: false, // ✅ 모든 화면의 기본 헤더 비활성화
    }}>
      <Stack.Screen 
        name="HomeScreen" 
        component={HomeScreen} 
        // options={{ title: "홈" }} 
      />
    </Stack.Navigator>
  );
}