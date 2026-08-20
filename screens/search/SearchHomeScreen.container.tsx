import { useState, useCallback } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SearchStackParamList } from "@/navigation/SearchStackNavigator";
import { usePlaces } from "./hooks/usePlaces";
import { useAnimeTitles } from "./hooks/useAnimeTitles";
import SearchHomeView, { type Mode, type Category } from "./SearchHomeScreen.view";

type NavigationProp = NativeStackNavigationProp<SearchStackParamList, "SearchHomeScreen">;

// Tier 1 — 모드: 성격이 다른 세 가지(전체 탐색 / 내 즐겨찾기 / 애니 성지)를 분리
const MODES: Mode[] = [
  { key: "explore", label: "탐색" },
  { key: "favorites", label: "즐겨찾기" },
  { key: "anime", label: "애니성지" },
];

// Tier 2 — 카테고리 필터: "탐색" 모드일 때만 노출
const CATEGORIES: Category[] = [
  { key: "", label: "전체" },
  { key: "attraction", label: "관광지" },
  { key: "restaurant", label: "맛집" },
  { key: "cafe", label: "카페" },
  { key: "shopping", label: "쇼핑" },
];

export default function SearchHomeScreenContainer() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const initialQuery = (route.params as { query?: string })?.query?.trim() ?? "";

  const [mode, setMode] = useState("explore");
  const [category, setCategory] = useState("");
  const [searchInput, setSearchInput] = useState(initialQuery);
  // 검색창에 타이핑하는 즉시가 아니라, 검색 버튼(또는 엔터)을 눌렀을 때만 실제 검색어로 반영
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery);

  const isFavoritesMode = mode === "favorites";
  const isAnimeMode = mode === "anime";
  const [refreshing, setRefreshing] = useState(false);
  const { places, loading, loadingMore, hasMore, loadMore, refresh } = usePlaces(
    category,
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
      modes={MODES}
      mode={mode}
      onSelectMode={setMode}
      categories={CATEGORIES}
      category={category}
      onSelectCategory={setCategory}
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
