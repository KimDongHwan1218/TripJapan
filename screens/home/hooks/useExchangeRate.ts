import { useEffect, useState } from "react";

// Frankfurter API: ¥100 = X원 → 1¥ = rate/100원. 전일 대비 변동폭도 여기서 같이
// 계산해서 홈 퀵액션 타일/환율 상세 화면 양쪽에서 공통으로 씀(예전엔 상세 화면이
// 어제 환율을 따로 fetch하고 있었음 — 중복이라 여기로 합침).
//
// 변동폭은 "최근 7일 범위"를 받아 실제 발표된 마지막 두 영업일을 비교한다. 예전엔 latest와
// "어제 날짜"를 따로 받아 비교했는데, ECB 환율은 한국 기준 밤에야 갱신돼서 낮·주말엔
// latest도 어제 날짜를 가리켜 변동폭이 늘 0으로 나왔음.
// 변동폭 단위는 exchangeRate와 같은 100엔 기준(1엔 기준으로 반올림하면 작은 변동이 0으로 사라짐).
export function useExchangeRate() {
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [exchangeRateDiff, setExchangeRateDiff] = useState<number | null>(null);

  useEffect(() => {
    const from = new Date();
    from.setDate(from.getDate() - 7);
    const fromStr = from.toISOString().split("T")[0];

    fetch(`https://api.frankfurter.app/${fromStr}..?from=JPY&to=KRW`)
      .then((res) => res.json())
      .then((data) => {
        const dates = Object.keys(data.rates ?? {}).sort();
        if (dates.length === 0) return;
        const latest = data.rates[dates[dates.length - 1]].KRW * 100;
        setExchangeRate(latest);
        if (dates.length >= 2) {
          const prev = data.rates[dates[dates.length - 2]].KRW * 100;
          setExchangeRateDiff(Math.round((latest - prev) * 100) / 100);
        }
      })
      .catch((err) => console.error("Exchange rate fetch error:", err));
  }, []);

  return { exchangeRate, exchangeRateDiff };
}
