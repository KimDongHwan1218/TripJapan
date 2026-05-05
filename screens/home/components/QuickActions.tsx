import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius } from "@/styles";

interface Props {
  temperature: number | null;
  weatherCode: number | null;
  exchangeRate: number | null;
  onPressTranslation: () => void;
  onPressFlight: () => void;
}

function getWeatherEmoji(code: number | null): string {
  if (code === null) return "🌤";
  if (code === 0) return "☀️";
  if (code <= 3) return "⛅";
  if (code <= 48) return "🌫️";
  if (code <= 67) return "🌧️";
  if (code <= 77) return "❄️";
  return "⛈️";
}

export default function QuickActions({
  temperature,
  weatherCode,
  exchangeRate,
  onPressTranslation,
  onPressFlight,
}: Props) {
  const weatherLabel =
    temperature !== null ? `${Math.round(temperature)}°` : "—";

  const rateLabel =
    exchangeRate !== null
      ? `${Math.round(exchangeRate)}원`
      : "—";

  const ACTIONS = [
    {
      key: "weather",
      icon: getWeatherEmoji(weatherCode),
      isEmoji: true,
      label: "일본 날씨",
      sublabel: weatherLabel,
      onPress: () => Alert.alert("준비 중입니다"),
    },
    {
      key: "exchange",
      icon: "card-outline" as const,
      isEmoji: false,
      label: "지금 환율",
      sublabel: rateLabel,
      onPress: () => Alert.alert("준비 중입니다"),
    },
    {
      key: "translate",
      icon: "language-outline" as const,
      isEmoji: false,
      label: "일본 번역",
      sublabel: "한 ↔ 日",
      onPress: onPressTranslation,
    },
    {
      key: "flight",
      icon: "airplane-outline" as const,
      isEmoji: false,
      label: "항공권",
      sublabel: "검색",
      onPress: onPressFlight,
    },
    {
      key: "more",
      icon: "grid-outline" as const,
      isEmoji: false,
      label: "더보기",
      sublabel: "",
      onPress: () => Alert.alert("준비 중입니다"),
    },
  ];

  return (
    <View style={styles.container}>
      {ACTIONS.map(({ key, icon, isEmoji, label, sublabel, onPress }) => (
        <TouchableOpacity key={key} style={styles.item} onPress={onPress} activeOpacity={0.7}>
          <View style={styles.iconCircle}>
            {isEmoji ? (
              <Text style={styles.emoji}>{icon as string}</Text>
            ) : (
              <Ionicons name={icon as any} size={20} color={colors.primary} />
            )}
          </View>
          <Text style={styles.label}>{label}</Text>
          {!!sublabel && <Text style={styles.sublabel}>{sublabel}</Text>}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  item: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: radius.full,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 22,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textSecondary,
    textAlign: "center",
  },
  sublabel: {
    fontSize: 10,
    color: colors.textTertiary,
    textAlign: "center",
  },
});
