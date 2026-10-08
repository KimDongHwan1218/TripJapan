// Open-Meteo weather_code → 표시용 정보(아이콘 이름·한글 설명).
// 이모지 버전이 QuickActions·WeatherDetailScreen에 따로 복제돼 있음 — 새 화면은 이걸 쓰고, 기존 것은 시안 정리 때 합칠 것.
// 구간은 기존 이모지 매핑과 같게 맞춤(0 맑음 / ≤3 구름 / ≤48 안개 / ≤67 비 / ≤77 눈 / 그 외 뇌우)
export type WeatherInfo = {
  icon: "sunny" | "partly-sunny" | "cloudy" | "rainy" | "snow" | "thunderstorm";
  label: string;
};

export function getWeatherInfo(code: number | null): WeatherInfo {
  if (code === null) return { icon: "partly-sunny", label: "" };
  if (code === 0) return { icon: "sunny", label: "맑음" };
  if (code <= 3) return { icon: "partly-sunny", label: "구름 조금" };
  if (code <= 48) return { icon: "cloudy", label: "안개" };
  if (code <= 67) return { icon: "rainy", label: "비" };
  if (code <= 77) return { icon: "snow", label: "눈" };
  return { icon: "thunderstorm", label: "뇌우" };
}
