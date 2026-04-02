import { useState } from "react";
import axios from "axios";
import { ENV } from "@/config/env";

const API_BASE = ENV.API_BASE_URL;

export type Place = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  thumbnail_url: string;
};

export function usePlaceSearch() {
  const [results, setResults] = useState<Place[]>([]);

  const search = async (query: string) => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const res = await axios.get(`${API_BASE}/places/search`, {
      params: { q: query },
    });

    setResults(res.data.slice(0, 3));
  };

  const clear = () => setResults([]);

  return { results, search, clear };
}
