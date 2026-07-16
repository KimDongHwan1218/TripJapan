import { useRoute, useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SearchStackParamList } from "@/navigation/SearchStackNavigator";
import { usePlaceDetail } from "./hooks/usePlaceDetail";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useToast } from "@/contexts/ToastContext";
import DetailView from "./DetailScreen.view";

type RouteProps = RouteProp<SearchStackParamList, "DetailScreen">;
type NavProp = NativeStackNavigationProp<SearchStackParamList, "DetailScreen">;

export default function DetailScreenContainer() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavProp>();
  const { placeId, source } = route.params;
  const isYoutuberPlace = source === "youtuber";

  const { place, youtuberMeta, loading, error, refetch } = usePlaceDetail(placeId, source);

  // 리뷰 작성 후 돌아왔을 때 새로고침 (유튜버 추천 장소는 리뷰 대상이 아니므로 해당 없음)
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );
  const { isFavorite, toggleFavorite } = useFavorites();
  const { showToast } = useToast();

  const favorited = !isYoutuberPlace && typeof placeId === "number" && isFavorite(placeId);

  const handleToggleFavorite = async () => {
    if (!place || isYoutuberPlace || typeof place.id !== "number") return;
    try {
      await toggleFavorite({
        id: place.id,
        name: place.name,
        address: place.address,
        thumbnail_url: place.thumbnail_url ?? "",
        latitude: place.latitude,
        longitude: place.longitude,
        category: place.category,
      });
      showToast(
        favorited ? "즐겨찾기에서 제거됐습니다." : "즐겨찾기에 추가됐습니다.",
        favorited ? "info" : "success"
      );
    } catch {
      showToast("즐겨찾기 저장에 실패했습니다. 다시 시도해주세요.", "error");
    }
  };

  return (
    <DetailView
      place={place}
      youtuberMeta={youtuberMeta}
      loading={loading}
      error={error}
      onRetry={refetch}
      favorited={favorited}
      onBack={() => navigation.goBack()}
      onToggleFavorite={isYoutuberPlace ? undefined : handleToggleFavorite}
      onPressWriteReview={
        isYoutuberPlace || typeof placeId !== "number"
          ? undefined
          : () => navigation.navigate("ReviewWrite", { placeId, placeName: place?.name ?? "" })
      }
    />
  );
}
