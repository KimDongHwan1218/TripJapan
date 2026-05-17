import { useEffect, useState } from "react";
import { ENV } from "@/config/env";

const API_BASE = ENV.API_BASE_URL;

export function useHomeData() {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [tips, setTips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const [slidesRes, tipsRes] = await Promise.all([
          fetch(`${API_BASE}/slides`),
          fetch(`${API_BASE}/tips`),
        ]);
        const [slideData, tipData] = await Promise.all([
          slidesRes.json(),
          tipsRes.json(),
        ]);
        setDestinations(slideData ?? []);
        setTips(tipData ?? []);
      } catch (err) {
        console.error("Home fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, []);

  return { destinations, tips, loading };
}
