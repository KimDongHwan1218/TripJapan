import { useState, useCallback } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SearchStackParamList } from "@/navigation/SearchStackNavigator";
import { usePlaces } from "./hooks/usePlaces";
import { useAnimeTitles } from "./hooks/useAnimeTitles";
import SearchHomeView, { type Category } from "./SearchHomeScreen.view";

type NavigationProp = NativeStackNavigationProp<SearchStackParamList, "SearchHomeScreen">;

const CATEGORIES: Category[] = [
  { key: "favorites", label: "즐겨찾기" },
  { key: "popular", label: "인기검색어" },
  { key: "attraction", label: "관광지" },
  { key: "restaurant", label: "맛집" },
  { key: "cafe", label: "카페" },
  { key: "shopping", label: "쇼핑" },
  { key: "anime_pilgrimage", label: "애니성지" },
];

export default function SearchHomeScreenContainer() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const initialQuery = (route.params as { query?: string })?.query?.trim() ?? "";

  const [selectedCategory, setSelectedCategory] = useState("popular");
  const [searchInput, setSearchInput] = useState(initialQuery);
  // 검색창에 타이핑하는 즉시가 아니라, 검색 버튼(또는 엔터)을 눌렀을 때만 실제 검색어로 반영
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery);

  const isFavoritesMode = selectedCategory === "favorites";
  const isAnimeMode = selectedCategory === "anime_pilgrimage";
  const [refreshing, setRefreshing] = useState(false);
  const apiCategory = isFavoritesMode ? "" : (selectedCategory === "popular" ? "" : selectedCategory);
  const { places, loading, loadingMore, hasMore, loadMore, refresh } = usePlaces(
    apiCategory,
    submittedQuery,
    isFavoritesMode || isAnimeMode
  );
  const { titles: animeTitles, loading: animeLoading } = useAnimeTitles(!isAnimeMode);

  const handleChangeSearchInput = (text: string) => {
    setSearchInput(text);
    if (text.length === 0) setSubmittedQuery("");
  };
  const handleSubmitSearch = () => setSubmittedQuery(searchInput.trim());
  const handleClearSearch = () => {
    setSearchInput("");
    setSubmittedQuery("");
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const handlePressPlace = useCallback(
    (placeId: number | string, source?: "youtuber") => {
      navigation.navigate("DetailScreen", { placeId, source });
    },
    [navigation]
  );

  const handlePressAnimeTitle = useCallback(
    (titleId: number, titleName: string) => {
      navigation.navigate("AnimePilgrimageDetail", { titleId, titleName });
    },
    [navigation]
  );

  return (
    <SearchHomeView
      categories={CATEGORIES}
      selectedCategory={selectedCategory}
      onSelectCategory={setSelectedCategory}
      searchInput={searchInput}
      onChangeSearchInput={handleChangeSearchInput}
      onSubmitSearch={handleSubmitSearch}
      onClearSearch={handleClearSearch}
      places={places}
      loading={loading}
      loadingMore={loadingMore}
      hasMore={hasMore}
      onLoadMore={loadMore}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      onPressPlace={handlePressPlace}
      animeTitles={animeTitles}
      animeLoading={animeLoading}
      onPressAnimeTitle={handlePressAnimeTitle}
    />
  );
}
