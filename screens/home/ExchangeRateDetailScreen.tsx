import React from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header/Header";
import { layout, colors, spacing, radius } from "@/styles";
import { useExchangeRate } from "./hooks/useExchangeRate";

const TIPS = [
  { icon: "card-outline", text: "일본은 현금 사용이 많아요. 엔화를 미리 환전하세요." },
  { icon: "storefront-outline", text: "공항보다 시내 은행이나 우체국 환율이 더 유리해요." },
  { icon: "phone-portrait-outline", text: "7-Eleven, 이온 ATM에서 해외 카드 출금 가능해요." },
  { icon: "alert-circle-outline", text: "IC카드(Suica 등) 충전에도 현금이 필요한 경우가 많아요." },
];

function RateRow({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <View style={styles.rateRow}>
      <View>
        <Text style={styles.rateLabel}>{label}</Text>
        {sub ? <Text style={styles.rateSub}>{sub}</Text> : null}
      </View>
      <Text style={styles.rateValue}>{value}</Text>
    </View>
  );
}

export default function ExchangeRateDetailScreen() {
  const { exchangeRate } = useExchangeRate();

  const per100 = exchangeRate !== null ? Math.round(exchangeRate) : null;
  const per1000 = per100 !== null ? Math.round(per100 * 10) : null;
  const per10000 = per100 !== null ? Math.round(per100 * 100) : null;

  return (
    <View style={layout.screen}>
      <Header backwardButton="simple" title="지금 환율" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* 메인 환율 카드 */}
        <View style={styles.mainCard}>
          <Text style={styles.mainLabel}>💴 JPY → KRW</Text>
          {per100 === null ? (
            <ActivityIndicator color={colors.textWhite} style={{ marginVertical: 20 }} />
          ) : (
            <>
              <Text style={styles.mainRate}>{per100.toLocaleString()}원</Text>
              <Text style={styles.mainSub}>100엔 기준 · 실시간</Text>
            </>
          )}
        </View>

        {/* 환율 계산표 */}
        {per100 !== null && (
          <View style={styles.tableCard}>
            <Text style={styles.tableTitle}>빠른 환산표</Text>
            <RateRow label="100엔" value={`${per100.toLocaleString()}원`} sub="기준 환율" />
            <View style={styles.tableDivider} />
            <RateRow label="500엔" value={`${Math.round(per100 * 5).toLocaleString()}원`} />
            <View style={styles.tableDivider} />
            <RateRow label="1,000엔" value={`${per1000!.toLocaleString()}원`} sub="지폐 1장" />
            <View style={styles.tableDivider} />
            <RateRow label="5,000엔" value={`${Math.round(per100 * 50).toLocaleString()}원`} />
            <View style={styles.tableDivider} />
            <RateRow label="10,000엔" value={`${per10000!.toLocaleString()}원`} sub="지폐 1장" />
          </View>
        )}

        {/* 환전 팁 */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 환전 꿀팁</Text>
          {TIPS.map((tip, i) => (
            <View key={i} style={styles.tipRow}>
              <Ionicons name={tip.icon as any} size={16} color={colors.primary} />
              <Text style={styles.tipText}>{tip.text}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.disclaimer}>
          * 환율은 Frankfurter API 기준이며 실제 환전 환율과 다를 수 있습니다.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: 48,
  },
  mainCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: "center",
    gap: spacing.sm,
  },
  mainLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "rgba(255,255,255,0.85)",
  },
  mainRate: {
    fontSize: 48,
    fontWeight: "800",
    color: colors.textWhite,
    letterSpacing: -1,
  },
  mainSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
  },
  tableCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  tableTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  rateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  rateLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  rateSub: {
    fontSize: 11,
    color: colors.textTertiary,
    marginTop: 2,
  },
  rateValue: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.primary,
  },
  tableDivider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
  },
  tipsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  disclaimer: {
    fontSize: 11,
    color: colors.textTertiary,
    textAlign: "center",
  },
});
