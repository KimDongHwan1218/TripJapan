import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SearchHomeScreen from "../screens/search/SearchHomeScreen";
import DetailScreen from "../screens/search/DetailScreen";


export type SearchStackParamList = {
  SearchHomeScreen: {query: string},
  DetailScreen: { item: any };
};

const Stack = createNativeStackNavigator<SearchStackParamList>();

export default function SearchStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
      headerShown: false, // ✅ 모든 화면의 기본 헤더 비활성화
    }}>
      <Stack.Screen 
        name="SearchHomeScreen" 
        component={SearchHomeScreen} 
      />
      <Stack.Screen 
        name="DetailScreen" 
        component={DetailScreen} 
      />
    </Stack.Navigator>
  );
}