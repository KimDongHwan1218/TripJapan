import { useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import { SearchStackParamList } from "@/navigation/SearchStackNavigator";
import { usePlaceDetail } from "./hooks/usePlaceDetail";
import DetailView from "./DetailScreen.view";

type RouteProps = RouteProp<SearchStackParamList, "DetailScreen">;

export default function DetailScreenContainer() {
  const route = useRoute<RouteProps>();
  const { placeId } = route.params;

  const { place, loading } = usePlaceDetail(placeId);

  return <DetailView place={place} loading={loading} />;
}
