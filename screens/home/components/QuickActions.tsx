// screens/home/components/QuickActions.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';

interface Props {
  onPressFlight: () => void;
  onPressHotel: () => void;
  onPressTour: () => void;
}



export default function QuickActions({
  onPressFlight,
  onPressHotel,
  onPressTour,
}: Props) {
  return (
    <View style={styles.container}>
      <ActionItem
        icon="airplane-outline"
        label="항공권"
        onPress={onPressFlight}
      />
      <ActionItem
        icon="bed-outline"
        label="숙소"
        onPress={onPressHotel}
      />
      <ActionItem
        icon="ticket-outline"
        label="투어·티켓"
        onPress={onPressTour}
      />
    </View>
  );
}

function ActionItem({
  icon,
  label,
  onPress,
}: {
  icon: any;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Ionicons name={icon} size={28} color="#333" />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  item: {
    width: "30%",
    backgroundColor: "#f7f7f7",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  label: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
  },
});
