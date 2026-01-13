import React from "react";
import { View, Text, StyleSheet } from "react-native";

type BadgeType =
  | "HOT"
  | "NEAR_MY_TRIP"
  | "TRENDING"
  | "LOCAL_PICK"
  | "HIGH_BOOKING"
  | "HIGH_REVIEW";

export default function BadgeRow({ badges }: { badges?: BadgeType[] }) {
  if (!badges || badges.length === 0) return null;

  return (
    <View style={styles.row}>
      {badges.map((badge) => (
        <View key={badge} style={styles.badge}>
          <Text style={styles.text}>{badge}</Text>
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
    borderRadius: 4,
    backgroundColor: "#eee",
    marginRight: 6,
    marginBottom: 4,
  },
  text: {
    fontSize: 11,
    color: "#333",
  },
});