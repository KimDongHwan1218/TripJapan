import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, radius } from "@/styles";
import type { BadgeType } from "../types";

const BADGE_LABEL: Record<BadgeType, string> = {
  HOT: "HOT",
  NEAR_MY_TRIP: "내 여행지 근처",
  TRENDING: "인기 급상승",
  LOCAL_PICK: "현지 추천",
  HIGH_BOOKING: "예약 많음",
  HIGH_REVIEW: "리뷰 많음",
  YOUTUBER_PICK: "▶ 유튜버 추천",
};

export default function BadgeRow({ badges }: { badges?: BadgeType[] }) {
  if (!badges || badges.length === 0) return null;

  return (
    <View style={styles.row}>
      {badges.map((badge) => (
        <View key={badge} style={[styles.badge, badge === "YOUTUBER_PICK" && styles.youtuberBadge]}>
          <Text style={[styles.text, badge === "YOUTUBER_PICK" && styles.youtuberText]}>
            {BADGE_LABEL[badge]}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginTop: 6,
    flexWrap: "wrap",
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.xs,
    backgroundColor: colors.neutral100,
    marginRight: 6,
    marginBottom: 4,
  },
  text: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  youtuberBadge: {
    backgroundColor: colors.primarySoft,
  },
  youtuberText: {
    color: colors.primary,
  },
});
