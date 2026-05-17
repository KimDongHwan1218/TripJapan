import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "@/styles";

export default function MovetoButton({ target, label }: { target: string; label?: string }) {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate(target)}>
      {label === "history" ? (
        <Ionicons name="file-tray-stacked-outline" size={22} color={colors.textPrimary} />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    padding: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textPrimary,
  },
});
