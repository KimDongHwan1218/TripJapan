// screens/home/components/QuickActions.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';

interface Props {
  onPressFlight: () => void;
  onPressHotel: () => void;
  onPressTour: () => void;
  onPressShopping: () => void;
  onPressInsurance: () => void;
}



export default function QuickActions({
  onPressFlight,
  onPressHotel,
  onPressTour,
  onPressShopping,
  onPressInsurance,
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
      <ActionItem
        icon="cart-outline"
        label="쇼핑"
        onPress={onPressShopping}
      />
      <ActionItem
        icon="heart-outline"
        label="보험·렌터카"
        onPress={onPressInsurance}
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
      <Ionicons name={icon} size={18} color="#333" />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
    paddingHorizontal: 4,
  },
  item: {
    width: "18%",
    backgroundColor: "#f7f7f7",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  label: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "500",
  },
});
