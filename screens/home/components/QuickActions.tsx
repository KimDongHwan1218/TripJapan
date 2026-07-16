import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "@/styles";

interface Props {
  temperature: number | null;
  weatherCode: number | null;
  exchangeRate: number | null;
  onPressTranslation: () => void;
  onPressWeather: () => void;
  onPressExchange: () => void;
  onPressTravelAlert: () => void;
  onPressTaviTalk: () => void;
}

function getWeatherEmoji(code: number | null): string {
  if (code === null) return "🌤️";
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
  onPressWeather,
  onPressExchange,
  onPressTravelAlert,
  onPressTaviTalk,
}: Props) {
  const tempStr = temperature !== null ? `${Math.round(temperature)}°` : "—";
  const rateStr = exchangeRate !== null ? `${Math.round(exchangeRate)}¥` : "—¥";

  return (
    // Figma: 섹션 자체 배경 없음 (transparent), 좌우 padding=10
    <View style={styles.container}>

      {/* 일본 날씨 */}
      <TouchableOpacity style={styles.item} onPress={onPressWeather} activeOpacity={0.75}>
        {/* Figma: 60×60, white, border #F5F5F5, radius 12, shadow 0px 4px 5px rgba(0,0,0,0.06), padding 15 */}
        <View style={styles.iconBox}>
          <Text style={styles.emoji}>{getWeatherEmoji(weatherCode)}</Text>
        </View>
        <Text style={styles.label}>일본 날씨</Text>
      </TouchableOpacity>

      {/* 지금 환율 — 텍스트 표시 (Figma: "940¥" 큰 텍스트 + "30▲" 작은 텍스트) */}
      <TouchableOpacity style={styles.item} onPress={onPressExchange} activeOpacity={0.75}>
        <View style={styles.iconBox}>
          <Text style={styles.rateMain}>{rateStr}</Text>
          <View style={styles.rateSubRow}>
            <Text style={styles.rateSub}>{tempStr}</Text>
            <Ionicons name="caret-up" size={7} color={colors.danger} />
          </View>
        </View>
        <Text style={styles.label}>지금 환율</Text>
      </TouchableOpacity>

      {/* 타비 번역 */}
      <TouchableOpacity style={styles.item} onPress={onPressTranslation} activeOpacity={0.75}>
        <View style={styles.iconBox}>
          {/* Figma: translate-square, 30×30, blue (#2563EB 계열) */}
          <Ionicons name="language" size={30} color="#2563EB" />
        </View>
        <Text style={styles.label}>타비 번역</Text>
      </TouchableOpacity>

      {/* 여행 경보 */}
      <TouchableOpacity style={styles.item} onPress={onPressTravelAlert} activeOpacity={0.75}>
        <View style={styles.iconBox}>
          {/* Figma: newspaper icon, 30×30, green */}
          <Ionicons name="newspaper" size={30} color="#2A7A5A" />
        </View>
        <Text style={styles.label}>여행 경보</Text>
      </TouchableOpacity>

      {/* 타비톡 */}
      <TouchableOpacity style={styles.item} onPress={onPressTaviTalk} activeOpacity={0.75}>
        <View style={styles.iconBox}>
          {/* Figma: chats icon, 30×30, red (#E40004) */}
          <Ionicons name="chatbubble" size={28} color={colors.primary} />
        </View>
        <Text style={styles.label}>타비톡</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  // Figma: 섹션 자체 배경 없음, 좌우 padding=10, 위아래 padding=20
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingTop: 20,
    paddingBottom: 20,
    // 배경 없음 — #FAFAFA 화면 배경이 그대로 보임
    backgroundColor: "transparent",
  },

  // Figma: 각 아이템 — width 60 고정 (flex:1 아님), flex-col, gap=9
  item: {
    width: 60,
    alignItems: "center",
    gap: 9,
  },

  // 60×60 흰 박스 — 그림자만으로 들뜬 느낌을 주고 테두리는 생략
  iconBox: {
    width: 60,
    height: 60,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    // Android
    elevation: 2,
  },

  // Figma: 날씨 이모지 30px
  emoji: {
    fontSize: 28,
  },

  // Figma: 환율 "940¥" 텍스트 표시
  rateMain: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 18,
  },
  rateSubRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
    marginTop: 1,
  },
  rateSub: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.danger,
    lineHeight: 12,
  },

  // Figma: 라벨 12px, Bold, #2F2F31 (textPrimary), lineHeight 14, center
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
    lineHeight: 14,
  },
});
