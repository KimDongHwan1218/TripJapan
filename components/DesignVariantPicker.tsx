import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "@/components/ui/Text";
import { useDesignContext } from "@/contexts/DesignContext";
import { colors, radius, shadows, spacing } from "@/styles";

// 우상단 플로팅 디자인 시안 선택 버튼(개발 빌드 전용).
// 지금 보고 있는 화면이 시안을 2개 이상 등록했을 때만 나타남. 누르면 시안 목록이 펼쳐지고 골라서 바로 비교.
export default function DesignVariantPicker() {
  const { current, selection, select } = useDesignContext();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [current?.key]);

  if (!__DEV__ || !current || current.variants.length < 2) return null;
  const idx = Math.min(selection[current.key] ?? 0, current.variants.length - 1);

  return (
    // 헤더(56) 바로 아래 우측 — 헤더 오른쪽 아이콘(검색·즐겨찾기 등)을 가리지 않게
    <View style={[styles.wrap, { top: insets.top + 60 }]} pointerEvents="box-none">
      <TouchableOpacity
        style={styles.pill}
        onPress={() => setOpen((o) => !o)}
        activeOpacity={0.7}
        accessibilityLabel={`디자인 시안 ${idx + 1}/${current.variants.length}, 눌러서 선택`}
      >
        {/* 평소엔 글자 하나(A/B…)만 — 헤더 없는 화면에서 내용을 가리지 않게. 이름은 펼친 목록에서 */}
        <Text style={styles.pillText}>{String.fromCharCode(65 + idx)}</Text>
      </TouchableOpacity>

      {open && (
        <View style={styles.menu}>
          {current.variants.map((label, i) => {
            const on = i === idx;
            return (
              <TouchableOpacity
                key={label}
                style={[styles.item, on && styles.itemOn]}
                onPress={() => {
                  select(current.key, i);
                  setOpen(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={[styles.itemKey, on && styles.itemTextOn]}>{String.fromCharCode(65 + i)}</Text>
                <Text style={[styles.itemText, on && styles.itemTextOn]} numberOfLines={1}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "absolute", right: 12, alignItems: "flex-end", zIndex: 1000 },
  pill: {
    width: 32,
    height: 32,
    alignItems: "center",
    borderRadius: radius.full,
    backgroundColor: colors.neutral900,
    opacity: 0.75,
    justifyContent: "center",
    ...shadows.md,
  },
  pillText: { fontSize: 12, lineHeight: 16, fontWeight: "700", color: colors.textWhite },
  menu: {
    marginTop: spacing.sm,
    minWidth: 180,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderCurve: "continuous",
    paddingVertical: spacing.xs,
    ...shadows.lg,
  },
  item: { flexDirection: "row", alignItems: "center", gap: spacing.sm, minHeight: 44, paddingHorizontal: spacing.md },
  itemOn: { backgroundColor: colors.neutral100 },
  itemKey: { width: 16, fontSize: 12, lineHeight: 16, fontWeight: "700", color: colors.textTertiary },
  itemText: { flex: 1, fontSize: 14, lineHeight: 20, color: colors.textPrimary },
  itemTextOn: { color: colors.primaryHover, fontWeight: "700" },
});
