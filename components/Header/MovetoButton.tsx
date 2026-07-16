import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "@/styles";
import IconButton from "@/components/ui/IconButton";

export default function MovetoButton({ target, label }: { target: string; label?: string }) {
  const navigation = useNavigation<any>();

  if (label === "history") {
    return (
      <IconButton
        name="file-tray-stacked-outline"
        size={22}
        color={colors.textPrimary}
        onPress={() => navigation.navigate(target)}
      />
    );
  }

  return (
    <Pressable
      onPress={() => navigation.navigate(target)}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    padding: 8,
    borderRadius: 999,
  },
  pressed: {
    backgroundColor: colors.neutral100,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textPrimary,
  },
});
