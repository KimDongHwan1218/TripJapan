import { useEffect, useState } from "react";

export function useExchangeRate() {
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://api.frankfurter.app/latest?from=JPY&to=KRW")
      .then((res) => res.json())
      .then((data) => setExchangeRate(data.rates.KRW * 100))
      .catch((err) => console.error("Exchange rate fetch error:", err));
  }, []);

  return { exchangeRate };
}
