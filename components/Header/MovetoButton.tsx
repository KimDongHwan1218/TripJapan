// components/Header/MovetoButton.tsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function MovetoButton({ target, label }: { target: string; label?: string; }) {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity
      style={styles.btn}
      onPress={() => navigation.navigate(target)}
    >
      {/* history → 서랍/히스토리 느낌 */}
      {label === "history" ? (
        <Ionicons name="file-tray-stacked-outline" size={22} />
      ) : (
        <Text>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
});
