import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SearchHomeScreen from "../screens/search/SearchHomeScreen";
import DetailScreen from "../screens/search/DetailScreen";
import ReviewWriteScreen from "../screens/home/ReviewWriteScreen";
import AnimePilgrimageDetailScreen from "../screens/search/AnimePilgrimageDetailScreen";

export type SearchStackParamList = {
  SearchHomeScreen: { query: string };
  DetailScreen: { placeId: number | string; source?: "youtuber" };
  ReviewWrite: {
    placeId: number;
    placeName: string;
    existingReview?: { id: number; rating: number; title: string | null; content: string; image_urls: string[] };
  };
  AnimePilgrimageDetail: { titleId: number; titleName: string };
};

const Stack = createNativeStackNavigator<SearchStackParamList>();

export default function SearchStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SearchHomeScreen" component={SearchHomeScreen} />
      <Stack.Screen name="DetailScreen" component={DetailScreen} />
      <Stack.Screen name="ReviewWrite" component={ReviewWriteScreen} />
      <Stack.Screen name="AnimePilgrimageDetail" component={AnimePilgrimageDetailScreen} />
    </Stack.Navigator>
  );
}
