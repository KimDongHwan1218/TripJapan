import { useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import { FlightStackParamList } from "@/navigation/FlightStackNavigator";
import { useFlightDetail } from "./hooks/useFlightDetail";
import FlightDetailView from "./FlightDetailScreen.view";

type RouteProps = RouteProp<FlightStackParamList, "FlightDetail">;

export default function FlightDetailScreenContainer() {
  const { params } = useRoute<RouteProps>();
  const { detail, loading } = useFlightDetail(params.offerId);

  return <FlightDetailView detail={detail} loading={loading} />;
}
