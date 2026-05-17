import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import Header from "@/components/Header/Header";
import { layout, colors, spacing, radius } from "@/styles";

// ── 도시 설정 ─────────────────────────────────────────────────

const CITY_COORDS: Record<string, { lat: number; lon: number; ko: string }> = {
  도쿄:    { lat: 35.69, lon: 139.69, ko: "도쿄" },
  오사카:  { lat: 34.69, lon: 135.5,  ko: "오사카" },
  교토:    { lat: 35.01, lon: 135.77, ko: "교토" },
  고베:    { lat: 34.69, lon: 135.2,  ko: "고베" },
  나라:    { lat: 34.69, lon: 135.83, ko: "나라" },
  후쿠오카:{ lat: 33.59, lon: 130.4,  ko: "후쿠오카" },
  삿포로:  { lat: 43.06, lon: 141.35, ko: "삿포로" },
  오키나와:{ lat: 26.21, lon: 127.68, ko: "오키나와" },
  나고야:  { lat: 35.18, lon: 136.9,  ko: "나고야" },
};

// Figma 칩 행 1 + 행 2 + 그외
const CHIP_CITIES = ["오사카","교토","고베","나라","후쿠오카","삿포로","오키나와","나고야"];

// ── 날씨 유틸 ─────────────────────────────────────────────────

function getWeatherEmoji(code: number): string {
  if (code === 0) return "☀️";
  if (code <= 3) return "⛅";
  if (code <= 48) return "🌫️";
  if (code <= 67) return "🌧️";
  if (code <= 77) return "❄️";
  if (code <= 82) return "🌦️";
  return "⛈️";
}

function getWeatherDesc(code: number): string {
  if (code === 0) return "맑아요!";
  if (code <= 3) return "대체로 화창해요!";
  if (code <= 48) return "안개가 꼈어요.";
  if (code <= 67) return "비가 오고 있어요.";
  if (code <= 77) return "눈이 내리고 있어요.";
  if (code <= 82) return "소나기가 내려요.";
  return "천둥번개가 치고 있어요.";
}

function formatMonthDay(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

// ── 타입 ──────────────────────────────────────────────────────

type DayForecast = {
  date: string;
  maxTemp: number;
  minTemp: number;
  code: number;
};

// ── 컴포넌트 ──────────────────────────────────────────────────

type Props = {
  route?: { params?: { city?: string } };
};

export default function WeatherDetailScreen({ route }: Props) {
  const initialCity = route?.params?.city ?? "도쿄";
  const [selectedCity, setSelectedCity] = useState(
    CITY_COORDS[initialCity] ? initialCity : "도쿄"
  );
  const [forecast, setForecast] = useState<DayForecast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const coords = CITY_COORDS[selectedCity] ?? CITY_COORDS["도쿄"];
    setLoading(true);
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}` +
      `&daily=temperature_2m_max,temperature_2m_min,weather_code` +
      `&timezone=Asia%2FTokyo&forecast_days=7`
    )
      .then((r) => r.json())
      .then((data) => {
        const days: DayForecast[] = data.daily.time.map((d: string, i: number) => ({
          date: d,
          maxTemp: Math.round(data.daily.temperature_2m_max[i]),
          minTemp: Math.round(data.daily.temperature_2m_min[i]),
          code: data.daily.weather_code[i],
        }));
        setForecast(days);
      })
      .catch(() => setForecast([]))
      .finally(() => setLoading(false));
  }, [selectedCity]);

  const today = forecast[0];

  return (
    <View style={layout.screen}>
      <Header backwardButton="simple" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Figma: 메인 텍스트 x=20 y=122(화면기준), 두줄 */}
        <View style={styles.mainBlock}>
          {loading || !today ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <Text style={styles.mainText}>
              {"지금 " + selectedCity + " 날씨는\n"}
              <Text style={styles.mainTextBold}>
                {today.minTemp}°C/{today.maxTemp}°C{" "}
              </Text>
              {getWeatherDesc(today.code)}
            </Text>
          )}
        </View>

        {/* Figma: 예보 수평 스크롤, 카드 58×94, gap 22px */}
        {forecast.length > 0 && (
          <FlatList
            data={forecast}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => i.toString()}
            contentContainerStyle={styles.forecastList}
            renderItem={({ item }) => (
              <View style={styles.forecastCard}>
                <Text style={styles.forecastDate}>{formatMonthDay(item.date)}</Text>
                <Text style={styles.forecastEmoji}>{getWeatherEmoji(item.code)}</Text>
                <Text style={styles.forecastTemp}>
                  {item.minTemp}°C {item.maxTemp}°C
                </Text>
              </View>
            )}
          />
        )}

        {/* Figma: 구분선 height=8 */}
        <View style={styles.divider} />

        {/* Figma: "다른곳 날씨가 궁금하신가요?" y=380 */}
        <Text style={styles.sectionTitle}>다른곳 날씨가 궁금하신가요?</Text>

        {/* Figma: 도시 칩 두 행, height=36, leftPad=15 */}
        <View style={styles.chipsBlock}>
          <View style={styles.chipRow}>
            {CHIP_CITIES.slice(0, 5).map((city) => (
              <TouchableOpacity
                key={city}
                style={[styles.chip, selectedCity === city && styles.chipActive]}
                onPress={() => setSelectedCity(city)}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, selectedCity === city && styles.chipTextActive]}>
                  {city}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.chipRow}>
            {CHIP_CITIES.slice(5).map((city) => (
              <TouchableOpacity
                key={city}
                style={[styles.chip, selectedCity === city && styles.chipActive]}
                onPress={() => setSelectedCity(city)}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, selectedCity === city && styles.chipTextActive]}>
                  {city}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.chip} activeOpacity={0.7}>
              <Text style={styles.chipText}>그외</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 48,
  },

  // Figma: 메인 텍스트 x=20, paddingTop=78 (y=122 - statusbar44 - nav58 = 20)
  mainBlock: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  mainText: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  mainTextBold: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.textPrimary,
  },

  // Figma: 예보 리스트 x=18, gap=22
  forecastList: {
    paddingHorizontal: 18,
    gap: 22,
    paddingBottom: 24,
  },
  // Figma: 카드 58×94
  forecastCard: {
    width: 58,
    height: 94,
    alignItems: "center",
    justifyContent: "space-between",
  },
  forecastDate: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.textTertiary,
    textAlign: "center",
  },
  forecastEmoji: {
    fontSize: 40,
    lineHeight: 56,
  },
  forecastTemp: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.textSecondary,
    textAlign: "center",
  },

  // Figma: 구분선 height=8
  divider: {
    height: 8,
    backgroundColor: colors.neutral100,
    marginBottom: 24,
  },

  // Figma: "다른곳..." x=20 y=380
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.textPrimary,
    paddingHorizontal: 20,
    marginBottom: 16,
  },

  chipsBlock: {
    paddingHorizontal: 20,
    gap: 10,
  },
  // Figma: 칩 행 height=36
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  // Figma: chip height=36, paddingHorizontal=15
  chip: {
    height: 36,
    paddingHorizontal: 15,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.textWhite,
    fontWeight: "700",
  },
});
