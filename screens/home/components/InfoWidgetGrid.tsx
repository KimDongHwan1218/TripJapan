import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

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

type Props = {
  city: string;
  temperature: number | null;
  weatherCode: number | null;
  exchangeRate: number | null; // 100엔 기준 원화
  onPressTranslation: () => void;
};

export default function InfoWidgetGrid({
  city,
  temperature,
  weatherCode,
  exchangeRate,
  onPressTranslation,
}: Props) {
  return (
    <View style={styles.grid}>
      {/* 날씨 */}
      <View style={[styles.widget, styles.weatherBg]}>
        <Text style={styles.label}>날씨</Text>
        <Text style={styles.mainValue}>
          {temperature !== null ? `${Math.round(temperature)}°C` : "—"}
        </Text>
        <Text style={styles.sub}>
          {weatherCode !== null ? getWeatherEmoji(weatherCode) : ""}{"  "}{city}
        </Text>
      </View>

      {/* 환율 */}
      <View style={[styles.widget, styles.exchangeBg]}>
        <Text style={styles.label}>환율</Text>
        <Text style={styles.mainValue}>
          {exchangeRate !== null
            ? `${Math.round(exchangeRate).toLocaleString()}원`
            : "—"}
        </Text>
        <Text style={styles.sub}>100엔 기준</Text>
      </View>

      {/* 번역 */}
      <TouchableOpacity
        style={[styles.widget, styles.translateBg]}
        onPress={onPressTranslation}
        activeOpacity={0.8}
      >
        <Text style={styles.label}>번역</Text>
        <Text style={styles.mainValue}>한 ↔ 日</Text>
        <Text style={styles.sub}>텍스트 · 이미지</Text>
      </TouchableOpacity>

      {/* 긴급정보 */}
      <View style={[styles.widget, styles.infoBg]}>
        <Text style={styles.label}>긴급정보</Text>
        <Text style={styles.infoLine}>🚨 경찰 · 110</Text>
        <Text style={styles.infoLine}>🚑 구급 · 119</Text>
        <Text style={styles.infoLine}>📞 관광안내 · #9110</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
  },
  widget: {
    width: "48%",
    borderRadius: 14,
    padding: 14,
    gap: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: "#666",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  mainValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },
  sub: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  infoLine: {
    fontSize: 12,
    color: "#444",
    marginTop: 3,
  },
  weatherBg: { backgroundColor: "#E8F4FD" },
  exchangeBg: { backgroundColor: "#FFF3E0" },
  translateBg: { backgroundColor: "#E8F5E9" },
  infoBg: { backgroundColor: "#FDE8E8" },
});
