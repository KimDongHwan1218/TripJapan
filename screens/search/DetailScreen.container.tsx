import { useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import { SearchStackParamList } from "@/navigation/SearchStackNavigator";
import { usePlaceDetail } from "./hooks/usePlaceDetail";
import DetailView from "./DetailScreen.view";

type RouteProps = RouteProp<SearchStackParamList, "DetailScreen">;

export default function DetailScreenContainer() {
  const route = useRoute<RouteProps>();
  const { placeId, source } = route.params;

  const { place, youtuberMeta, loading, error, retry } = usePlaceDetail(placeId, source);

  return (
    <DetailView place={place} youtuberMeta={youtuberMeta} loading={loading} error={error} onRetry={retry} />
  );
}
