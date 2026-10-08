import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Text from "@/components/ui/Text";
import { colors, spacing } from "@/styles";

// 섹션 제목 링크(디자인 시스템 §09) — 제목 줄 전체가 터치 영역, 오른쪽 chevron 20.
// onPress가 없으면 화살표 없는 일반 섹션 제목.
export default function SectionLink({ title, onPress }: { title: string; onPress?: () => void }) {
  const content = (
    <>
      <Text style={styles.title}>{title}</Text>
      {onPress && <Ionicons name="chevron-forward" size={20} color={colors.neutral500} />}
    </>
  );
  if (!onPress) return <View style={styles.row}>{content}</View>;
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 44,
    paddingHorizontal: spacing.gutter,
    marginBottom: spacing.md,
  },
  title: { fontSize: 18, lineHeight: 26, fontWeight: "700", letterSpacing: -0.18, color: colors.textPrimary },
});
