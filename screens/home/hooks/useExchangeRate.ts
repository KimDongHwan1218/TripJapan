import { useEffect, useState } from "react";

// Frankfurter API: ¥100 = X원 → 1¥ = rate/100원. 전일 대비 변동폭도 여기서 같이
// 계산해서 홈 퀵액션 타일/환율 상세 화면 양쪽에서 공통으로 씀(예전엔 상세 화면이
// 어제 환율을 따로 fetch하고 있었음 — 중복이라 여기로 합침).
export function useExchangeRate() {
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [prevExchangeRate, setPrevExchangeRate] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://api.frankfurter.app/latest?from=JPY&to=KRW")
      .then((res) => res.json())
      .then((data) => setExchangeRate(data.rates.KRW * 100))
      .catch((err) => console.error("Exchange rate fetch error:", err));

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split("T")[0];
    fetch(`https://api.frankfurter.app/${dateStr}?from=JPY&to=KRW`)
      .then((res) => res.json())
      .then((data) => setPrevExchangeRate(data.rates.KRW * 100))
      .catch(() => {});
  }, []);

  const ratePerYen = exchangeRate !== null ? exchangeRate / 100 : null;
  const prevRatePerYen = prevExchangeRate !== null ? prevExchangeRate / 100 : null;
  const exchangeRateDiff =
    ratePerYen !== null && prevRatePerYen !== null
      ? Math.round((ratePerYen - prevRatePerYen) * 100) / 100
      : null;

  return { exchangeRate, exchangeRateDiff };
}
