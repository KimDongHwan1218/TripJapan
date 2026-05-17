import { useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import { FlightStackParamList } from "@/navigation/FlightStackNavigator";
import { useFlightSearch } from "./hooks/useFlightSearch";
import FlightSearchResultView from "./FlightSearchResultScreen.view";

type RouteProps = RouteProp<FlightStackParamList, "FlightSearchResult">;

export default function FlightSearchResultScreenContainer() {
  const { params } = useRoute<RouteProps>();
  const { loading, results, error } = useFlightSearch(params);

  return (
    <FlightSearchResultView
      params={params}
      loading={loading}
      results={results}
      error={error}
    />
  );
}
