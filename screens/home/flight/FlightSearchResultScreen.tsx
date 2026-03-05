import { View, FlatList, Text, StyleSheet } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState, useCallback } from "react";

import { FlightStackParamList } from "@/navigation/FlightStackNavigator";
import { ENV } from "@/config/env";

import SearchSummaryBar from "./components/SearchSummaryBar";
import FlightResultCard from "./components/FlightResultCard";
import FilterSortBar from "./components/FilterSortBar";
import FlightListSkeleton from "./components/skeleton/FlightListSkeleton";

const API_BASE = ENV.API_BASE_URL;

type RouteProps = RouteProp<
  FlightStackParamList,
  "FlightSearchResult"
>;

export default function FlightSearchResultScreen() {
  const { params } = useRoute<RouteProps>();

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = useCallback(async () => {
    setLoading(true);
    setError(null);

    console.log(
      "Fetching flight search results with params:",
      params
    );

    try {
      /**
       * ⚠️ 서버 /flights/search 기준 네이밍
       * origin
       * destination
       * departureDate
       * returnDate (optional)
       * adults
       */
      const qs = new URLSearchParams({
        origin: params.from,
        destination: params.to,
        departureDate: params.departDate,
        adults: String(params.adults ?? 1),
      });

      if (params.returnDate) {
        qs.append("returnDate", params.returnDate);
      }

      const res = await fetch(
        `${API_BASE}/flights/search?${qs.toString()}`
      );

      if (!res.ok) {
        throw new Error("API 요청 실패");
      }

      const json = await res.json();

      /**
       * 서버 응답은 배열 그대로 내려옴
       */
      if (!Array.isArray(json)) {
        throw new Error("응답 형식 오류");
      }

      setResults(json);
    } catch (e) {
      console.error(e);
      setError("항공권 검색에 실패했습니다.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  return (
    <View style={styles.container}>
      <SearchSummaryBar params={params} />
      <FilterSortBar />

      {error && (
        <View>
          <Text style={styles.errorText}>
            {error} (목데이터 표시 중)
          </Text>
          <FlightResultCard flight={{  
            offerId: "string",
            airline: "string",
            departureTime: "string",
            arrivalTime: "string",
            duration: "string",
            price: 0,
            currency: "string"}
          } />
        </View>

      )}

      {loading ? (
        <FlightListSkeleton />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.offerId}
          renderItem={({ item }) => (
            <FlightResultCard flight={item} />
          )}
          contentContainerStyle={
            results.length === 0 && styles.emptyContainer
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              검색 결과가 없습니다.
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorText: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: "#DC2626",
    fontSize: 14,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#6B7280",
    fontSize: 14,
  },
});
