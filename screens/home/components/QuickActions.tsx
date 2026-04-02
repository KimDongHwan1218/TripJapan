import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius } from "@/styles";

interface Props {
  onPressFlight: () => void;
  onPressHotel: () => void;
  onPressTour: () => void;
  onPressShopping: () => void;
  onPressInsurance: () => void;
}

const ACTIONS = [
  { icon: "airplane-outline", label: "항공권", key: "flight" },
  { icon: "bed-outline", label: "숙소", key: "hotel" },
  { icon: "ticket-outline", label: "투어·티켓", key: "tour" },
  { icon: "cart-outline", label: "쇼핑", key: "shopping" },
  { icon: "heart-outline", label: "보험·렌터카", key: "insurance" },
] as const;

export default function QuickActions({
  onPressFlight,
  onPressHotel,
  onPressTour,
  onPressShopping,
  onPressInsurance,
}: Props) {
  const handlers = {
    flight: onPressFlight,
    hotel: onPressHotel,
    tour: onPressTour,
    shopping: onPressShopping,
    insurance: onPressInsurance,
  };

  return (
    <View style={styles.container}>
      {ACTIONS.map(({ icon, label, key }) => (
        <TouchableOpacity key={key} style={styles.item} onPress={handlers[key]}>
          <View style={styles.iconCircle}>
            <Ionicons name={icon} size={22} color={colors.primary} />
          </View>
          <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: spacing.md,
  },
  item: {
    flex: 1,
    alignItems: "center",
    gap: spacing.xs,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.textSecondary,
    textAlign: "center",
  },
});
