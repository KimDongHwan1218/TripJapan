// components/CommunityTopTabs.tsx
import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Text from "@/components/ui/Text";
import { colors, radius } from "@/styles";

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
    borderBottomColor: colors.divider,
    backgroundColor: colors.surface,
  },
  tab: {
    marginRight: 20,
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textTertiary,
  },
  activeLabel: {
    color: colors.textPrimary,
  },
  activeDot: {
    marginTop: 8,
    width: 4,
    height: 4,
    borderRadius: radius.xs,
    backgroundColor: "#2a6ef7",
  },
});
