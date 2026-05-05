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

type Props = {
  city: string;
  temperature: number | null;
  weatherCode: number | null;
  exchangeRate: number | null;
  onPressTranslation: () => void;
  onPressWeather: () => void;
  onPressExchange: () => void;
};

type InfoBtnProps = {
  icon: string;
  label: string;
  value: string;
  sub?: string;
  onPress: () => void;
  iconColor?: string;
};

function InfoBtn({ icon, label, value, sub, onPress, iconColor }: InfoBtnProps) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.iconBox, iconColor ? { backgroundColor: iconColor + "20" } : {}]}>
        <Text style={styles.emoji}>{icon}</Text>
      </View>
      <View style={styles.btnText}>
        <Text style={styles.btnLabel}>{label}</Text>
        <Text style={styles.btnValue} numberOfLines={1}>{value}</Text>
        {sub ? <Text style={styles.btnSub}>{sub}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={14} color={colors.neutral300} />
    </TouchableOpacity>
  );
}

export default function InfoWidgetGrid({
  city,
  temperature,
  weatherCode,
  exchangeRate,
  onPressTranslation,
  onPressWeather,
  onPressExchange,
}: Props) {
  return (
    <View style={styles.container}>
      <InfoBtn
        icon={weatherCode !== null ? getWeatherEmoji(weatherCode) : "🌤️"}
        label="일본 날씨"
        value={temperature !== null ? `${Math.round(temperature)}°C` : "불러오는 중..."}
        sub={city}
        onPress={onPressWeather}
      />
      <View style={styles.divider} />
      <InfoBtn
        icon="💴"
        label="지금 환율"
        value={exchangeRate !== null ? `${Math.round(exchangeRate).toLocaleString()}원 / 100엔` : "불러오는 중..."}
        onPress={onPressExchange}
      />
      <View style={styles.divider} />
      <InfoBtn
        icon="🈳"
        label="번역"
        value="한국어 ↔ 일본어"
        sub="텍스트 · 이미지 번역"
        onPress={onPressTranslation}
      />
      <View style={styles.divider} />
      <InfoBtn
        icon="🆘"
        label="긴급정보"
        value="경찰 110 · 구급 119"
        sub="일본 긴급 연락처"
        onPress={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    overflow: "hidden",
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    marginHorizontal: spacing.lg,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.neutral100,
    justifyContent: "center",
    alignItems: "center",
  },
  emoji: {
    fontSize: 20,
  },
  btnText: {
    flex: 1,
    gap: 2,
  },
  btnLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textTertiary,
  },
  btnValue: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  btnSub: {
    fontSize: 11,
    color: colors.textTertiary,
  },
});
