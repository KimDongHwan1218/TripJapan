import React from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, RouteProp } from "@react-navigation/native";
import Header from "@/components/Header/Header";
import { layout, colors, spacing, radius } from "@/styles";
import { useWeather } from "./hooks/useWeather";
import { HomeStackParamList } from "@/navigation/HomeStackNavigator";

type RouteProps = RouteProp<HomeStackParamList, "WeatherDetail">;

function getWeatherEmoji(code: number): string {
  if (code === 0) return "☀️";
  if (code <= 3) return "⛅";
  if (code <= 48) return "🌫️";
  if (code <= 55) return "🌦️";
  if (code <= 67) return "🌧️";
  if (code <= 77) return "❄️";
  if (code <= 82) return "🌧️";
  return "⛈️";
}

function getWeatherLabel(code: number): string {
  if (code === 0) return "맑음";
  if (code <= 3) return "구름 조금";
  if (code <= 48) return "안개";
  if (code <= 55) return "이슬비";
  if (code <= 67) return "비";
  if (code <= 77) return "눈";
  if (code <= 82) return "소나기";
  return "뇌우";
}

function getWeatherTip(code: number): string {
  if (code === 0) return "오늘은 맑은 날씨입니다. 야외 활동하기 좋은 날이에요!";
  if (code <= 3) return "구름이 조금 있지만 야외 활동하기 좋습니다.";
  if (code <= 48) return "안개가 끼어 있어요. 시야에 주의하세요.";
  if (code <= 67) return "비가 내리고 있어요. 우산을 챙기세요! ☂️";
  if (code <= 77) return "눈이 내리고 있어요. 따뜻하게 입고 미끄럼에 주의하세요.";
  return "악천후예요. 외출 시 주의하세요.";
}

const CITY_LABELS: Record<string, string> = {
  Tokyo: "도쿄", Osaka: "오사카", Kyoto: "교토",
  Sapporo: "삿포로", Fukuoka: "후쿠오카", Okinawa: "오키나와",
  Nara: "나라", Kobe: "고베", Nagoya: "나고야",
  Hakone: "하코네", Yokohama: "요코하마",
};

export default function WeatherDetailScreen() {
  const { params } = useRoute<RouteProps>();
  const city = params?.city ?? "Tokyo";
  const { temperature, weatherCode } = useWeather(city);

  const cityLabel = CITY_LABELS[city] ?? city;

  return (
    <View style={layout.screen}>
      <Header backwardButton="simple" title="일본 날씨" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* 메인 날씨 카드 */}
        <View style={styles.mainCard}>
          <Text style={styles.cityName}>{cityLabel}</Text>
          {temperature === null ? (
            <ActivityIndicator color={colors.primary} style={{ marginVertical: 24 }} />
          ) : (
            <>
              <Text style={styles.emoji}>
                {weatherCode !== null ? getWeatherEmoji(weatherCode) : "🌤️"}
              </Text>
              <Text style={styles.temp}>{Math.round(temperature)}°C</Text>
              <Text style={styles.condition}>
                {weatherCode !== null ? getWeatherLabel(weatherCode) : ""}
              </Text>
            </>
          )}
        </View>

        {/* 여행 팁 */}
        {weatherCode !== null && (
          <View style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <Ionicons name="bulb-outline" size={18} color={colors.warning} />
              <Text style={styles.tipTitle}>오늘의 여행 팁</Text>
            </View>
            <Text style={styles.tipText}>{getWeatherTip(weatherCode)}</Text>
          </View>
        )}

        {/* 날씨 정보 안내 */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>날씨 정보 안내</Text>
          <Text style={styles.infoText}>
            현재 날씨 데이터는 Open-Meteo를 통해 실시간으로 제공됩니다.{"\n"}
            여행 전 현지 날씨를 꼭 확인하세요!
          </Text>
          <View style={styles.tipRow}>
            <Ionicons name="umbrella-outline" size={16} color={colors.primary} />
            <Text style={styles.tipRowText}>일본 여행 시 접이식 우산은 필수!</Text>
          </View>
          <View style={styles.tipRow}>
            <Ionicons name="sunny-outline" size={16} color={colors.warning} />
            <Text style={styles.tipRowText}>여름엔 자외선 차단제를 꼭 챙기세요</Text>
          </View>
          <View style={styles.tipRow}>
            <Ionicons name="snow-outline" size={16} color={colors.primary} />
            <Text style={styles.tipRowText}>겨울 홋카이도는 영하 20도까지 내려가요</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: 48,
  },
  mainCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: "center",
    gap: spacing.sm,
  },
  cityName: {
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(255,255,255,0.8)",
  },
  emoji: {
    fontSize: 64,
    marginVertical: spacing.sm,
  },
  temp: {
    fontSize: 56,
    fontWeight: "800",
    color: colors.textWhite,
    letterSpacing: -2,
  },
  condition: {
    fontSize: 18,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
  },
  tipCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  tipText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  infoText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  tipRowText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});
