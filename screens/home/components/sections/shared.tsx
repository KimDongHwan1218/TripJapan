import React, { useEffect, useState } from "react";
import { View, Image, StyleProp, ViewStyle, ImageStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { MainTabParamList } from "@/navigation/MainTabNavigator";
import { usePlaces, type Place } from "@/screens/search/hooks/usePlaces";
import { useCommunity } from "@/contexts/CommunityContext";
import { selectLatestPosts } from "@/screens/community/utils/postSelectors";
import { tones, CATEGORY_TONE } from "@/styles/tones";

// 홈 시안 B·C·D의 타비 PICK / 실시간 타비톡 — 데이터·이동은 여기서 한 번만, 모양은 시안별 파일에서.
// (A의 TaviPick·TaviTalkPreview와 로직이 겹침 — 시안 채택 시 A 쪽을 이 훅으로 합칠 것)

type TabNav = BottomTabNavigationProp<MainTabParamList>;

export const PICK_CATEGORIES = [
  { key: "all", label: "전체", apiKey: "", screenLabel: "" },
  { key: "attraction", label: "관광", apiKey: "attraction", screenLabel: "관광지" },
  { key: "restaurant", label: "맛집", apiKey: "restaurant", screenLabel: "맛집" },
  { key: "cafe", label: "카페", apiKey: "cafe", screenLabel: "카페" },
  { key: "shopping", label: "쇼핑", apiKey: "shopping", screenLabel: "쇼핑" },
] as const;
export type PickCategory = (typeof PICK_CATEGORIES)[number];

export const PLACE_CATEGORY_LABEL: Record<string, string> = { attraction: "관광", restaurant: "맛집", cafe: "카페", shopping: "쇼핑" };
export const PLACE_CATEGORY_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  attraction: "location",
  restaurant: "restaurant",
  cafe: "cafe",
  shopping: "bag-handle",
};

export function useTaviPick(region = "") {
  const navigation = useNavigation<TabNav>();
  const [cat, setCat] = useState<PickCategory>(PICK_CATEGORIES[0]);
  const { places, loading } = usePlaces(cat.apiKey, "", region);

  const openPlace = (place: Place) =>
    navigation.navigate("검색", { screen: "DetailScreen", params: { placeId: place.id, source: place.source }, initial: false } as any);

  const openMore = () => {
    if (!cat.apiKey) return navigation.navigate("검색", { screen: "SearchHomeScreen", params: { query: "" } } as any);
    navigation.navigate("검색", {
      screen: "CategoryScreen",
      params: { categoryKey: cat.apiKey, categoryLabel: cat.screenLabel },
      initial: false,
    } as any);
  };

  return { cat, setCat, places, loading, openPlace, openMore };
}

export function useLatestTalk(limit: number) {
  const { getPosts, fetchPostsIfNeeded, isLoading } = useCommunity();
  useEffect(() => {
    fetchPostsIfNeeded("전체");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { posts: selectLatestPosts(getPosts("전체"), limit), loading: isLoading("전체") };
}

// "방금 / N분 전 / N시간 전 / 어제 / 26.04.02"
export function timeAgo(dateStr: string) {
  const t = new Date(dateStr).getTime();
  if (Number.isNaN(t)) return "";
  const m = Math.floor((Date.now() - t) / 60000);
  if (m < 1) return "방금";
  if (m < 60) return `${m}분 전`;
  if (m < 60 * 24) return `${Math.floor(m / 60)}시간 전`;
  if (m < 60 * 48) return "어제";
  const d = new Date(t);
  return `${String(d.getFullYear()).slice(2)}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

// 장소 썸네일 — 주소가 없거나 안 열리면(더미 데이터) 회색 상자 대신 카테고리 색 + 아이콘
export function PlaceThumb({
  uri,
  category,
  style,
  iconSize = 22,
  onBroken,
}: {
  uri?: string | null;
  category?: string | null;
  style: StyleProp<ViewStyle & ImageStyle>;
  iconSize?: number;
  onBroken?: () => void; // 사진이 안 열려 색 면으로 바뀔 때(사진 위 글씨 색을 바꾸려는 쪽에서 씀)
}) {
  const [broken, setBroken] = useState(false);
  const tone = tones[CATEGORY_TONE[category ?? ""] ?? "blue"];
  if (uri && !broken) {
    return <Image
        source={{ uri }}
        style={style as StyleProp<ImageStyle>}
        resizeMode="cover"
        onError={() => {
          setBroken(true);
          onBroken?.();
        }}
      />;
  }
  return (
    <View style={[style as StyleProp<ViewStyle>, { backgroundColor: tone.bg, alignItems: "center", justifyContent: "center" }]}>
      <Ionicons name={PLACE_CATEGORY_ICON[category ?? ""] ?? "location"} size={iconSize} color={tone.fg} />
    </View>
  );
}
