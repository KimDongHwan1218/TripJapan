import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Text from "@/components/ui/Text";
import { colors, radius, spacing } from "@/styles";

const NAME = { ja: "일본어", ko: "한국어" } as const;

// [디자인 2] 번역 방향 표시 — "日→한 ⇄" 약어 버튼 대신 언어 이름을 그대로 보여주고 가운데 버튼으로 바꿈.
export default function LanguageBar({ source, onSwap }: { source: "ja" | "ko"; onSwap: () => void }) {
  const target = source === "ja" ? "ko" : "ja";
  return (
    <View style={styles.bar}>
      <Text style={styles.lang}>{NAME[source]}</Text>
      <TouchableOpacity
        onPress={onSwap}
        style={styles.swap}
        activeOpacity={0.7}
        accessibilityLabel={`${NAME[target]}에서 ${NAME[source]}로 번역 방향 바꾸기`}
      >
        <Ionicons name="swap-horizontal" size={20} color={colors.textPrimary} />
      </TouchableOpacity>
      <Text style={styles.lang}>{NAME[target]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderRadius: radius.md,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginBottom: spacing.lg,
    marginHorizontal: spacing.gutter, // 아래 입력칸과 같은 좌우 여백(부모 콘텐츠에 좌우 패딩이 없음)
    marginTop: spacing.xl,
  },
  lang: { flex: 1, textAlign: "center", fontSize: 16, lineHeight: 24, fontWeight: "600", color: colors.textPrimary },
  swap: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.divider,
  },
});
