import React from "react";
import { View, TouchableOpacity, StyleSheet, ScrollView, Linking, Alert } from "react-native";
import Text from "@/components/ui/Text";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header/Header";
import { layout, colors, spacing, radius } from "@/styles";

const CONTACTS = [
  { label: "경찰",              number: "110",            icon: "shield-checkmark-outline", color: colors.info },
  { label: "소방·구급",          number: "119",            icon: "flame-outline",            color: "#EF4444" },
  { label: "해양 경찰",          number: "118",            icon: "boat-outline",             color: "#0EA5E9" },
  { label: "주일 한국 대사관",   number: "+81-3-3455-2601", icon: "flag-outline",             color: "#059669" },
  { label: "외교부 영사콜센터",  number: "+82-2-3210-0404", icon: "earth-outline",            color: "#7C3AED" },
  { label: "여행자보험 긴급출동", number: "1588-1688",      icon: "medkit-outline",           color: "#F59E0B" },
] as const;

function openCall(number: string) {
  const url = `tel:${number.replace(/[^0-9+]/g, "")}`;
  Linking.canOpenURL(url).then((can) => {
    if (can) Linking.openURL(url);
    else Alert.alert("전화 연결 불가", "이 기기에서는 전화를 지원하지 않습니다.");
  });
}

export default function EmergencyContactsScreen() {
  return (
    <View style={layout.screen}>
      <Header backwardButton="simple" title="긴급 연락처" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.desc}>
          일본 여행 중 긴급 상황이 발생하면 아래 번호로 연락하세요.
        </Text>
        {CONTACTS.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.row}
            onPress={() => openCall(item.number)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBox, { backgroundColor: item.color + "1A" }]}>
              <Ionicons name={item.icon} size={24} color={item.color} />
            </View>
            <View style={styles.info}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.number}>{item.number}</Text>
            </View>
            <Ionicons name="call-outline" size={20} color={colors.neutral300} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.md, gap: spacing.sm },
  desc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.md,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.md, borderCurve: "continuous",
    justifyContent: "center",
    alignItems: "center",
  },
  info: { flex: 1 },
  label: { fontSize: 16, fontWeight: "600", color: colors.textPrimary },
  number: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
});
