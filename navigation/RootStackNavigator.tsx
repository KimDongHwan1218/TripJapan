import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "@/contexts/AuthContext";

import IntroScreen from "../screens/auth/IntroScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import MainTabs from "./MainTabNavigator";

export type RootStackParamList = {
  Intro: undefined;
  Login: undefined;
  MainTabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
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