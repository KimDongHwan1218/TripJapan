import { useEffect, useState } from "react";
import { ENV } from "@/config/env";

const API_BASE = ENV.API_BASE_URL;

export function useFlightHotDeals() {
  const [deals, setDeals] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/flights`)
      .then((res) => res.json())
      .then(setDeals)
      .catch((err) => console.error("FlightHotDeals fetch error:", err));
  }, []);

  return { deals };
}
