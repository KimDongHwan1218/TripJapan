import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SearchHubScreen from "../screens/search/SearchHubScreen";
import CategoryScreen from "../screens/search/CategoryScreen";
import AnimePilgrimageListScreen from "../screens/search/AnimePilgrimageListScreen";
import FavoritesScreen from "../screens/search/FavoritesScreen";
import DetailScreen from "../screens/search/DetailScreen";
import ReviewWriteScreen from "../screens/home/ReviewWriteScreen";
import AnimePilgrimageDetailScreen from "../screens/search/AnimePilgrimageDetailScreen";

export type SearchStackParamList = {
  // 허브 화면(검색탭 루트). query는 다른 탭에서 검색어를 들고 들어올 때만 채워짐 —
  // 채워지면 허브를 거치지 않고 CategoryScreen(전체검색)으로 바로 넘어감.
  SearchHomeScreen: { query?: string };
  CategoryScreen: {
    categoryKey: string; // "" = 전체(허브 검색 아이콘 / 외부 검색어 진입)
    categoryLabel: string;
    initialQuery?: string;
    autoFocusSearch?: boolean;
  };
  AnimePilgrimageList: undefined;
  FavoritesScreen: undefined;
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
      <Stack.Screen name="SearchHomeScreen" component={SearchHubScreen} />
      <Stack.Screen name="CategoryScreen" component={CategoryScreen} />
      <Stack.Screen name="AnimePilgrimageList" component={AnimePilgrimageListScreen} />
      <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} />
      <Stack.Screen name="DetailScreen" component={DetailScreen} />
      <Stack.Screen name="ReviewWrite" component={ReviewWriteScreen} />
      <Stack.Screen name="AnimePilgrimageDetail" component={AnimePilgrimageDetailScreen} />
    </Stack.Navigator>
  );
}
