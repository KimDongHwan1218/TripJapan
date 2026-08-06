import { useRoute, useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { Alert } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SearchStackParamList } from "@/navigation/SearchStackNavigator";
import { usePlaceDetail, Review } from "./hooks/usePlaceDetail";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import { ENV } from "@/config/env";
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
  const { user, accessToken } = useAuth();

  const favorited = !isYoutuberPlace && typeof placeId === "number" && isFavorite(placeId);

  const myReview = user
    ? place?.reviews.find((r) => String(r.user_id) === String(user.id))
    : undefined;

  const handleEditReview = (review: Review) => {
    if (typeof placeId !== "number") return;
    navigation.navigate("ReviewWrite", {
      placeId,
      placeName: place?.name ?? "",
      existingReview: {
        id: review.id,
        rating: review.rating,
        title: review.title,
        content: review.content,
        image_urls: review.image_urls,
      },
    });
  };

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

  const handleDeleteReview = (reviewId: number) => {
    Alert.alert("리뷰 삭제", "정말 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await fetch(`${ENV.API_BASE_URL}/places/${placeId}/reviews/${reviewId}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (!res.ok) {
              const body = await res.json().catch(() => null);
              throw new Error(body?.message);
            }
            showToast("리뷰가 삭제되었습니다.", "success");
            refetch();
          } catch (err: any) {
            showToast(err.message || "리뷰 삭제에 실패했습니다. 다시 시도해주세요.", "error");
          }
        },
      },
    ]);
  };

  const handleReportReview = (reviewId: number) => {
    const submitReport = async (reason: string) => {
      try {
        const res = await fetch(`${ENV.API_BASE_URL}/places/${placeId}/reviews/${reviewId}/report`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify({ reason }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(body?.message);
        }
        showToast("신고가 접수되었습니다.", "success");
      } catch (err: any) {
        showToast(err.message || "신고 접수에 실패했습니다. 다시 시도해주세요.", "error");
      }
    };

    Alert.alert("신고 사유를 선택해주세요", "", [
      { text: "스팸", onPress: () => submitReport("스팸") },
      { text: "욕설/혐오", onPress: () => submitReport("욕설/혐오") },
      { text: "음란물", onPress: () => submitReport("음란물") },
      { text: "기타", onPress: () => submitReport("기타") },
      { text: "취소", style: "cancel" },
    ]);
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
      hasMyReview={!!myReview}
      currentUserId={user?.id}
      onDeleteReview={handleDeleteReview}
      onReportReview={handleReportReview}
      onEditReview={handleEditReview}
    />
  );
}
