// components/CommunityTopTabs.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

type TabKey = "home" | "review" | "question" | "free" | "info";

const TABS: { key: TabKey; label: string }[] = [
  { key: "home", label: "홈" },
  { key: "review", label: "후기" },
  { key: "question", label: "질문" },
  { key: "free", label: "자유" },
  { key: "info", label: "정보" },
];

type Props = {
  active: TabKey;
  onChange: (key: TabKey) => void;
};

export default function CommunityTopTabs({ active, onChange }: Props) {
  return (
    <View style={styles.wrapper}>
      {TABS.map((tab) => {
        const isActive = active === tab.key;

        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onChange(tab.key)}
            style={styles.tab}
          >
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {tab.label}
            </Text>
            {isActive && <View style={styles.activeDot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  tab: {
    marginRight: 18,
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#999",
  },
  activeLabel: {
    color: "#111",
  },
  activeDot: {
    marginTop: 6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#2a6ef7",
  },
});
