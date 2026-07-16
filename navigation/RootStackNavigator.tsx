import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "@/contexts/AuthContext";

import IntroScreen from "../screens/auth/IntroScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import MainTabs from "./MainTabNavigator";

export type RootStackParamList = {
  Intro: undefined;
  Login: undefined;
  MainTabs: undefined;
  // Signup은 소셜 로그인 전환으로 제거됨
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const { loading, user } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {loading ? (
        // 로그인 여부 확인 중 — 자동 로그인 여부와 무관하게 동일한 인트로 화면을 보여준다
        <Stack.Screen name="Intro" component={IntroScreen} />
      ) : user ? (
        // ✅ 로그인 상태
        <Stack.Screen name="MainTabs" component={MainTabs} />
      ) : (
        // ❌ 비로그인 상태
        <>
          <Stack.Screen name="Intro" component={IntroScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}