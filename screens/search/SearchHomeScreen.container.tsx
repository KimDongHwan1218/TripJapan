import { useState, useMemo } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SearchStackParamList } from "@/navigation/SearchStackNavigator";
import { usePlaces } from "./hooks/usePlaces";
import SearchHomeView, { type Category } from "./SearchHomeScreen.view";

type NavigationProp = NativeStackNavigationProp<SearchStackParamList, "SearchHomeScreen">;

const CATEGORIES: Category[] = [
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
  const [query, setQuery] = useState(initialQuery);

  // popular 탭은 카테고리 없이 전체 인기 순으로 가져옴
  const apiCategory = selectedCategory === "popular" ? "" : selectedCategory;
  const { places, loading } = usePlaces(apiCategory, query);

  // 검색 결과 화면용: 카테고리별 카운트 (검색 중일 때만 계산)
  const { places: allPlaces } = usePlaces("", query);
  const categoryCounts = useMemo(() => {
    if (!query) return undefined;
    const counts: Record<string, number> = { popular: allPlaces.length };
    for (const cat of CATEGORIES.slice(1)) {
      counts[cat.key] = allPlaces.filter((p) => p.category === cat.key).length;
    }
    return counts;
  }, [allPlaces, query]);

  const handleSubmitSearch = () => {
    if (searchInput.trim()) {
      setQuery(searchInput.trim());
      setSelectedCategory("popular");
    }
  };

  const handleClearSearch = () => {
    setQuery("");
    setSearchInput("");
    setSelectedCategory("popular");
  };

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
      onPressPlace={(place) => navigation.navigate("DetailScreen", { placeId: place.id, source: place.source })}
      categoryCounts={categoryCounts}
    />
  );
}
