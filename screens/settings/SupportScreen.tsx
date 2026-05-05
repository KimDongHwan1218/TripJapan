import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header/Header";
import { layout, typography, spacing, colors, radius } from "@/styles";

type ContactItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  action?: () => void;
};

const CONTACT_ITEMS: ContactItem[] = [
  {
    icon: "mail-outline",
    label: "이메일 문의",
    value: "support@tavi.app",
    action: () => Linking.openURL("mailto:support@tavi.app"),
  },
  {
    icon: "call-outline",
    label: "전화 문의",
    value: "010-1234-5678",
    action: () => Linking.openURL("tel:01012345678"),
  },
  {
    icon: "time-outline",
    label: "운영 시간",
    value: "평일 10:00 ~ 18:00\n(주말 및 공휴일 휴무)",
  },
];

const FAQ_ITEMS = [
  {
    q: "회원 탈퇴는 어떻게 하나요?",
    a: "설정 > 계정 > 탈퇴하기에서 진행하실 수 있습니다.",
  },
  {
    q: "작성한 게시글을 수정할 수 있나요?",
    a: "게시글 상세 화면에서 우측 상단 수정 버튼을 눌러 수정하실 수 있습니다.",
  },
  {
    q: "여행 일정을 공유할 수 있나요?",
    a: "현재 일정 공유 기능은 준비 중입니다. 빠른 시일 내에 제공할 예정입니다.",
  },
];

export default function SupportScreen() {
  return (
    <View style={styles.container}>
      <Header title="고객센터" backwardButton="simple" />

      <View style={styles.content}>
        {/* 문의하기 */}
        <Text style={styles.sectionLabel}>문의하기</Text>
        <View style={styles.panel}>
          {CONTACT_ITEMS.map((item, idx) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.contactRow,
                idx < CONTACT_ITEMS.length - 1 && styles.contactRowBorder,
              ]}
              onPress={item.action}
              activeOpacity={item.action ? 0.7 : 1}
              disabled={!item.action}
            >
              <View style={styles.iconBox}>
                <Ionicons name={item.icon} size={20} color={colors.primary} />
              </View>
              <View style={styles.contactText}>
                <Text style={styles.contactLabel}>{item.label}</Text>
                <Text style={styles.contactValue}>{item.value}</Text>
              </View>
              {item.action ? (
                <Ionicons name="chevron-forward" size={16} color={colors.neutral300} />
              ) : null}
            </TouchableOpacity>
          ))}
        </View>

        {/* FAQ */}
        <Text style={styles.sectionLabel}>자주 묻는 질문</Text>
        <View style={styles.panel}>
          {FAQ_ITEMS.map((item, idx) => (
            <View
              key={item.q}
              style={[styles.faqItem, idx < FAQ_ITEMS.length - 1 && styles.faqItemBorder]}
            >
              <View style={styles.faqQ}>
                <Text style={styles.faqQBadge}>Q</Text>
                <Text style={styles.faqQText}>{item.q}</Text>
              </View>
              <View style={styles.faqA}>
                <Text style={styles.faqABadge}>A</Text>
                <Text style={styles.faqAText}>{item.a}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...layout.screen },
  content: { padding: spacing.lg, gap: spacing.xl },

  sectionLabel: {
    ...typography.caption,
    color: colors.textTertiary,
    marginBottom: -spacing.md,
    marginLeft: spacing.xs,
  },

  panel: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },

  // 연락처
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  contactRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
    justifyContent: "center",
    alignItems: "center",
  },
  contactText: { flex: 1, gap: 2 },
  contactLabel: { fontSize: 13, fontWeight: "600", color: colors.textPrimary },
  contactValue: { fontSize: 13, color: colors.textTertiary },

  // FAQ
  faqItem: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  faqItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  faqQ: { flexDirection: "row", gap: spacing.sm, alignItems: "flex-start" },
  faqA: { flexDirection: "row", gap: spacing.sm, alignItems: "flex-start" },
  faqQBadge: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.primary,
    width: 16,
    lineHeight: 20,
  },
  faqABadge: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.textTertiary,
    width: 16,
    lineHeight: 20,
  },
  faqQText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: colors.textPrimary,
    lineHeight: 20,
  },
  faqAText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
