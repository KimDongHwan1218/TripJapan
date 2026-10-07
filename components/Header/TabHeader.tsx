import React from "react";
import { View, StyleSheet } from "react-native";
import Text from "@/components/ui/Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, radius } from "@/styles";

// 탭 최상위 화면(검색/일정/설정 등) 공통 헤더 — 타비톡(CommunityScreen) 기준으로 통일.
// bg #FAFAFA, height 58, 좌측 tabi 로고 고정, 우측은 화면마다 다른 액션이 붙음.
export function TabiLogo() {
  return (
    <View style={{ position: "relative", height: 26, justifyContent: "flex-end" }}>
      <View style={styles.dot} />
      <Text style={styles.logoText}>tabi</Text>
    </View>
  );
}

type Props = {
  rightContent?: React.ReactNode;
};

export default function TabHeader({ rightContent }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingTop: insets.top, height: 58 + insets.top }]}>
      <TabiLogo />
      {rightContent ? <View style={styles.right}>{rightContent}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  right: { flexDirection: "row", alignItems: "center", gap: 16 },
  dot: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 6,
    height: 6,
    borderRadius: radius.xs,
    backgroundColor: colors.primary,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 28,
  },
});
