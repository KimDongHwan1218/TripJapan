import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Header from "@/components/Header/Header";
import { layout, colors, spacing, radius } from "@/styles";
import { useExchangeRate } from "./hooks/useExchangeRate";

// Frankfurter API: ¥100 = X원 → 1¥ = rate/100원
// 전날 기준 비교를 위해 어제 환율도 가져옴

export default function ExchangeRateDetailScreen() {
  const { exchangeRate } = useExchangeRate(); // 100¥ 기준 원화
  const [prevRate, setPrevRate] = useState<number | null>(null);
  const [yenInput, setYenInput] = useState("1");

  // 전날 환율 가져오기
  useEffect(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split("T")[0];
    fetch(`https://api.frankfurter.app/${dateStr}?from=JPY&to=KRW`)
      .then((r) => r.json())
      .then((data) => setPrevRate(data.rates.KRW * 100))
      .catch(() => {});
  }, []);

  // 1¥당 원화: exchangeRate = 100¥ 기준
  const ratePerYen = exchangeRate !== null ? exchangeRate / 100 : null;

  // 전날 대비 차이
  const prevRatePerYen = prevRate !== null ? prevRate / 100 : null;
  const diff = ratePerYen !== null && prevRatePerYen !== null
    ? Math.round((ratePerYen - prevRatePerYen) * 100) / 100
    : null;
  const isUp = diff !== null && diff > 0;

  // 환율 계산: 입력한 엔 × ratePerYen
  const yenNum = parseFloat(yenInput) || 0;
  const krwResult = ratePerYen !== null
    ? (yenNum * ratePerYen).toFixed(2)
    : "—";

  const rateStr = ratePerYen !== null
    ? ratePerYen.toFixed(2)
    : "—";

  return (
    <View style={layout.screen}>
      <Header backwardButton="simple" />

      <View style={styles.content}>
        {/* Figma: 메인 텍스트 x=20, y=122, 두줄 */}
        {exchangeRate === null ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.mainBlock}>
            <Text style={styles.mainText}>
              {"지금 환율은\n"}
              <Text style={styles.mainTextBold}>
                1일본 엔 당 {rateStr}원
              </Text>
              {" 입니다."}
            </Text>

            {/* Figma: "전날 기준 30▲ 입니다." x=20, y=182 */}
            <Text style={styles.subText}>
              {"전날 기준 "}
              {diff !== null && (
                <Text style={[styles.diffText, { color: isUp ? colors.danger : "#2563EB" }]}>
                  {Math.abs(diff)}{isUp ? " ▲" : " ▼"}
                </Text>
              )}
              {" 입니다."}
            </Text>
          </View>
        )}

        {/* Figma: 입력 필드 1 — x=20, y=241, 320×50 */}
        <View style={styles.fieldWrap}>
          <TextInput
            style={styles.field}
            value={yenInput}
            onChangeText={setYenInput}
            keyboardType="numeric"
            placeholder="1"
            placeholderTextColor={colors.neutral300}
          />
          <Text style={styles.fieldUnit}>일본 엔</Text>
        </View>

        {/* Figma: 입력 필드 2 — x=20, y=306, 320×50 */}
        <View style={[styles.fieldWrap, styles.fieldWrapResult]}>
          <Text style={[styles.field, styles.fieldResult]}>
            {krwResult}
          </Text>
          <Text style={styles.fieldUnit}>원</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingBottom: 48,
  },

  // Figma: 메인 텍스트 y=122 (y - status44 - nav58 = 20)
  mainBlock: {
    paddingTop: 20,
    paddingBottom: 40,
    gap: 8,
  },
  mainText: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  mainTextBold: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.textPrimary,
  },

  // Figma: "전날 기준 30▲ 입니다." y=182
  subText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "400",
  },
  diffText: {
    fontWeight: "700",
  },

  // Figma: 입력 필드 320×50, 회색 배경
  fieldWrap: {
    width: 320,
    height: 50,
    backgroundColor: colors.neutral100,
    borderRadius: radius.md,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15, // Figma: y=306-y=241-50=15px gap
  },
  fieldWrapResult: {
    backgroundColor: colors.neutral100,
  },
  field: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
    textAlign: "center",
    padding: 0,
  },
  fieldResult: {
    color: colors.textPrimary,
    textAlign: "center",
  },
  fieldUnit: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textTertiary,
    minWidth: 40,
    textAlign: "right",
  },
});
