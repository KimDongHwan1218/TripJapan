// screens/home/components/SectionHeader.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  title: string;
  onPressMore?: () => void;
}

export default function SectionHeader({ title, onPressMore }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {onPressMore && (
        <TouchableOpacity onPress={onPressMore} style={styles.moreBtn}>
          <Text style={styles.moreText}>더보기</Text>
          <Ionicons name="chevron-forward-outline" size={16} color="#555" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
  },
  moreBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  moreText: {
    fontSize: 14,
    color: "#555",
    marginRight: 4,
  },
});
