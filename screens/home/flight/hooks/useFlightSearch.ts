import { useEffect, useState, useCallback } from "react";
import { ENV } from "@/config/env";
import { FlightStackParamList } from "@/navigation/FlightStackNavigator";
import { RouteProp } from "@react-navigation/native";

const API_BASE = ENV.API_BASE_URL;

type SearchParams = RouteProp<FlightStackParamList, "FlightSearchResult">["params"];

export function useFlightSearch(params: SearchParams) {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams({
        origin: params.from,
        destination: params.to,
        departureDate: params.departDate,
        adults: String(params.adults ?? 1),
      });
      if (params.returnDate) qs.append("returnDate", params.returnDate);

      const res = await fetch(`${API_BASE}/flights/search?${qs.toString()}`);
      if (!res.ok) throw new Error("API 요청 실패");

      const json = await res.json();
      if (!Array.isArray(json)) throw new Error("응답 형식 오류");

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

  return { loading, results, error, refetch: fetchResults };
}
