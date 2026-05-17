import { View, FlatList, Text, StyleSheet } from "react-native";
import { colors } from "@/styles/colors";
import { FlightStackParamList } from "@/navigation/FlightStackNavigator";
import SearchSummaryBar from "./components/SearchSummaryBar";
import FlightResultCard from "./components/FlightResultCard";
import FilterSortBar from "./components/FilterSortBar";
import FlightListSkeleton from "./components/skeleton/FlightListSkeleton";

type Params = FlightStackParamList["FlightSearchResult"];

type Props = {
  params: Params;
  loading: boolean;
  results: any[];
  error: string | null;
};

export default function FlightSearchResultView({ params, loading, results, error }: Props) {
  return (
    <View style={styles.container}>
      <SearchSummaryBar params={params} />
      <FilterSortBar />

      {error && (
        <View>
          <Text style={styles.errorText}>{error} (목데이터 표시 중)</Text>
          <FlightResultCard flight={{
            offerId: "string", airline: "string", departureTime: "string",
            arrivalTime: "string", duration: "string", price: 0, currency: "string",
          }} />
        </View>
      )}

      {loading ? (
        <FlightListSkeleton />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.offerId}
          renderItem={({ item }) => <FlightResultCard flight={item} />}
          contentContainerStyle={results.length === 0 && styles.emptyContainer}
          ListEmptyComponent={<Text style={styles.emptyText}>검색 결과가 없습니다.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  errorText: { paddingHorizontal: 16, paddingVertical: 8, color: colors.danger, fontSize: 14 },
  emptyContainer: { flexGrow: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: colors.textTertiary, fontSize: 14 },
});
