import { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SearchStackParamList } from "@/navigation/SearchStackNavigator";
import { usePlaces } from "./hooks/usePlaces";
import SearchHomeView from "./SearchHomeScreen.view";

type NavigationProp = NativeStackNavigationProp<SearchStackParamList, "SearchHomeScreen">;

const CATEGORIES = ["cafe", "shop", "restaurant", "goods", "event_place"];

export default function SearchHomeScreenContainer() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const query = (route.params as { query?: string })?.query?.trim() || "";

  const [selectedCategory, setSelectedCategory] = useState("cafe");
  const { places, loading } = usePlaces(selectedCategory, query);

  return (
    <SearchHomeView
      categories={CATEGORIES}
      selectedCategory={selectedCategory}
      places={places}
      loading={loading}
      onSelectCategory={setSelectedCategory}
      onPressPlace={(placeId) => navigation.navigate("DetailScreen", { placeId })}
    />
  );
}
