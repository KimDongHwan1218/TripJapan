import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius } from "@/styles";

const SCREEN_W = Dimensions.get("window").width;
// Figma: 카드 x=10, width=340, 360px 화면 → 좌우 margin=10
const CARD_MARGIN = 10;

interface Props {
  activeTrip?: any;
  tripPhase?: any;
  onPress?: () => void;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("ko-KR", {
    month: "numeric",
    day: "numeric",
    weekday: "short",
  });
}

export default function TomyTrip({ activeTrip, tripPhase, onPress }: Props) {
  const hasTrip = !!activeTrip;
  const dayNumber = tripPhase?.dayNumber ?? null;
  const destination = activeTrip?.city ?? activeTrip?.destination ?? "여행지";
  const startDate = formatDate(activeTrip?.start_date ?? activeTrip?.startDate);
  const endDate = formatDate(activeTrip?.end_date ?? activeTrip?.endDate);

  return (
    // Figma: x=10, y=330, 340×140 — marginTop: -48 (hero 오버랩)
    <View style={styles.card}>
      {hasTrip ? (
        <>
          {/* 배지 + 제목 행: Figma Frame x=16 y=16, 242×44 */}
          <View style={styles.topRow}>
            {dayNumber !== null && (
              <View style={styles.dayBadge}>
                <Text style={styles.dayBadgeText}>{dayNumber}일차</Text>
              </View>
            )}
            <Text style={styles.tripTitle} numberOfLines={1}>
              {destination} 여행중!
            </Text>
          </View>

          {/* 날짜 */}
          {(startDate || endDate) && (
            <Text style={styles.dateText}>
              {startDate} - {endDate}
            </Text>
          )}
        </>
      ) : (
        <View style={styles.noTripRow}>
          <Ionicons name="airplane-outline" size={20} color={colors.primary} />
          <Text style={styles.noTripText}>현재 예정된 여행이 없어요</Text>
        </View>
      )}

      {/* Figma: Button x=16 y=76, 308×50 */}
      <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.85}>
        <Text style={styles.buttonText}>
          {hasTrip ? "오늘 일정 보기" : "여행 일정 보러가기 ✈️"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // Figma: x=10, width=340, height=140, y=330 (hero overlap -48)
  card: {
    marginHorizontal: CARD_MARGIN,
    marginTop: -48,
    width: SCREEN_W - CARD_MARGIN * 2,
    // height: 140 → flex로 처리 (내부 gap에 따라)
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    gap: 4,
  },

  // 배지 + 제목: Figma Frame 242×44
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  // Figma: badge frame 52×22
  dayBadge: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 2,
    height: 22,
    justifyContent: "center",
  },
  dayBadgeText: {
    color: colors.textWhite,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
  },
  tripTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
    flex: 1,
  },

  dateText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "400",
  },

  noTripRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  noTripText: {
    fontSize: 14,
    color: colors.textSecondary,
  },

  // Figma: Button x=16 y=76, width=308, height=50
  button: {
    marginTop: 10,
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: colors.textWhite,
    fontWeight: "700",
    fontSize: 16,
  },
});
