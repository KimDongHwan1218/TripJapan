import { useState, useMemo, useCallback } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDebounce } from "@/hooks/useDebounce";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SearchStackParamList } from "@/navigation/SearchStackNavigator";
import { usePlaces } from "./hooks/usePlaces";
import SearchHomeView, { type Category } from "./SearchHomeScreen.view";

type NavigationProp = NativeStackNavigationProp<SearchStackParamList, "SearchHomeScreen">;

const CATEGORIES: Category[] = [
  { key: "favorites", label: "즐겨찾기" },
  { key: "popular", label: "인기검색어" },
  { key: "event_place", label: "관광정보" },
  { key: "restaurant", label: "맛집" },
  { key: "cafe", label: "카페" },
  { key: "goods", label: "굿즈/쇼핑" },
  { key: "shop", label: "쇼핑" },
];

export default function SearchHomeScreenContainer() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const initialQuery = (route.params as { query?: string })?.query?.trim() ?? "";

  const [selectedCategory, setSelectedCategory] = useState("popular");
  const [searchInput, setSearchInput] = useState(initialQuery);

  const query = useDebounce(searchInput, 300);

  const isFavoritesMode = selectedCategory === "favorites";
  const [refreshing, setRefreshing] = useState(false);
  const apiCategory = isFavoritesMode ? "" : (selectedCategory === "popular" ? "" : selectedCategory);
  const { places, loading, refresh } = usePlaces(apiCategory, query, isFavoritesMode);

  // 검색 결과용 카테고리별 카운트 (즐겨찾기 제외)
  const { places: allPlaces } = usePlaces("", query, !query);
  const categoryCounts = useMemo(() => {
    if (!query) return undefined;
    const counts: Record<string, number> = { popular: allPlaces.length };
    for (const cat of CATEGORIES.filter((c) => c.key !== "favorites" && c.key !== "popular")) {
      counts[cat.key] = allPlaces.filter((p) => p.category === cat.key).length;
    }
    return counts;
  }, [allPlaces, query]);

  const handleSubmitSearch = () => setSelectedCategory("popular");
  const handleClearSearch = () => {
    setSearchInput("");
    setSelectedCategory("popular");
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  return (
    <SearchHomeView
      categories={CATEGORIES}
      selectedCategory={selectedCategory}
      onSelectCategory={setSelectedCategory}
      query={query}
      searchInput={searchInput}
      onChangeSearchInput={setSearchInput}
      onSubmitSearch={handleSubmitSearch}
      onClearSearch={handleClearSearch}
      places={places}
      loading={loading}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      onPressPlace={(placeId, source) => navigation.navigate("DetailScreen", { placeId, source })}
      categoryCounts={categoryCounts}
    />
  );
}
