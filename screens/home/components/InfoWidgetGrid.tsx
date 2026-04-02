import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius } from "@/styles";

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

type Props = {
  city: string;
  temperature: number | null;
  weatherCode: number | null;
  exchangeRate: number | null;
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
      <View style={styles.widget}>
        <View style={styles.widgetHeader}>
          <Text style={styles.label}>날씨</Text>
          <Ionicons name="partly-sunny-outline" size={16} color={colors.textTertiary} />
        </View>
        <Text style={styles.mainValue}>
          {temperature !== null ? `${Math.round(temperature)}°` : "—"}
        </Text>
        <Text style={styles.sub}>
          {weatherCode !== null ? getWeatherLabel(weatherCode) : ""}
          {"  "}{city}
        </Text>
      </View>

      {/* 환율 */}
      <View style={styles.widget}>
        <View style={styles.widgetHeader}>
          <Text style={styles.label}>환율</Text>
          <Ionicons name="card-outline" size={16} color={colors.textTertiary} />
        </View>
        <Text style={styles.mainValue}>
          {exchangeRate !== null
            ? `${Math.round(exchangeRate).toLocaleString()}원`
            : "—"}
        </Text>
        <Text style={styles.sub}>100엔 기준</Text>
      </View>

      {/* 번역 */}
      <TouchableOpacity style={styles.widget} onPress={onPressTranslation} activeOpacity={0.7}>
        <View style={styles.widgetHeader}>
          <Text style={styles.label}>번역</Text>
          <Ionicons name="language-outline" size={16} color={colors.textTertiary} />
        </View>
        <Text style={styles.mainValue}>한 ↔ 日</Text>
        <Text style={styles.sub}>텍스트 · 이미지</Text>
      </TouchableOpacity>

      {/* 긴급정보 */}
      <View style={[styles.widget, styles.emergencyWidget]}>
        <View style={styles.widgetHeader}>
          <Text style={styles.label}>긴급정보</Text>
          <Ionicons name="alert-circle-outline" size={16} color={colors.danger} />
        </View>
        <Text style={styles.infoLine}>경찰  110</Text>
        <Text style={styles.infoLine}>구급  119</Text>
        <Text style={styles.infoLine}>관광안내  #9110</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  widget: {
    width: "48%",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  emergencyWidget: {
    borderColor: colors.dangerSoft,
  },
  widgetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  mainValue: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  sub: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  infoLine: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
