import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius } from "@/styles";

interface Props {
  activeTrip?: any;
  tripPhase?: any;
  onPress?: () => void;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("ko-KR", {
    month: "long",
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
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.88}
    >
      {hasTrip ? (
        <>
          <View style={styles.topRow}>
            {dayNumber !== null && (
              <View style={styles.dayBadge}>
                <Text style={styles.dayBadgeText}>{dayNumber}일차</Text>
              </View>
            )}
            <Text style={styles.tripTitle} numberOfLines={1}>
              지금 {destination} 여행중!
            </Text>
          </View>
          {(startDate || endDate) && (
            <Text style={styles.dateText}>
              {startDate} ~ {endDate}
            </Text>
          )}
        </>
      ) : (
        <View style={styles.noTripRow}>
          <Ionicons name="airplane-outline" size={20} color={colors.primary} />
          <Text style={styles.noTripText}>현재 예정된 여행이 없어요</Text>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.85}>
        <Text style={styles.buttonText}>
          {hasTrip ? "오늘 일정 보기" : "여행 일정 보러가기 ✈️"}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.lg,
    marginTop: -52,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.xs,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  dayBadge: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  dayBadgeText: {
    color: colors.textWhite,
    fontSize: 12,
    fontWeight: "700",
  },
  tripTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
    flex: 1,
  },
  dateText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  noTripRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  noTripText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: spacing.xs,
  },
  buttonText: {
    color: colors.textWhite,
    fontWeight: "700",
    fontSize: 15,
  },
});
