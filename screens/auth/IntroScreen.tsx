import React, { useEffect, useRef } from "react";
import { View, Image, StyleSheet, Animated, Easing } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Text from "@/components/ui/Text";
import { useAuth } from "@/contexts/AuthContext";
import { colors, spacing } from "@/styles";

// 네이티브 스플래시(app.config expo-splash-screen)와 같은 이미지·크기(200)를 화면 가운데에 그려서
// 스플래시 → 인트로가 이어지는 순간 로고가 튀지 않게 함. 그 뒤 아래 문구와 진행 막대가 살짝 떠오름.
// (예전: 60×27px 로고를 120×54로 늘려 흐릿 + 아무 움직임 없이 1.2초 대기)
const SPLASH = require("@/assets/brand/splash.png");
const LOGO_SIZE = 200; // app.config imageWidth와 같게

// AuthContext의 loading 자체가 최소 노출 시간을 보장하므로, 로딩 종료 후엔 짧게만 대기
const NAVIGATE_DELAY_MS = 300;

export default function IntroScreen() {
  const navigation = useNavigation<any>();
  const { user, loading } = useAuth();
  const insets = useSafeAreaInsets();

  const fade = useRef(new Animated.Value(0)).current; // 아래 문구
  const bar = useRef(new Animated.Value(0)).current; // 진행 막대 왕복

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 400, delay: 150, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
    const loop = Animated.loop(
      Animated.timing(bar, { toValue: 1, duration: 1100, easing: Easing.inOut(Easing.quad), useNativeDriver: true })
    );
    loop.start();
    return () => loop.stop();
  }, [fade, bar]);

  useEffect(() => {
    // 로그인 여부 확인 중이면 대기 — 확인 후 로그인 상태면
    // RootStackNavigator가 알아서 MainTabs로 전환해준다.
    if (loading || user) return;

    const timeout = setTimeout(() => {
      navigation.replace("Login");
    }, NAVIGATE_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [loading, user]);

  return (
    <View style={styles.container}>
      {/* 흰 바탕에서 상태 표시줄 아이콘이 흰색으로 떠서 안 보였음 → 진하게 */}
      <StatusBar style="dark" />
      <Image source={SPLASH} style={styles.logo} />

      <Animated.View
        style={[
          styles.bottom,
          { paddingBottom: insets.bottom + spacing.xxl, opacity: fade, transform: [{ translateY: fade.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }] },
        ]}
      >
        <View style={styles.track}>
          <Animated.View
            style={[styles.thumb, { transform: [{ translateX: bar.interpolate({ inputRange: [0, 1], outputRange: [-24, 48] }) }] }]}
          />
        </View>
        <Text style={styles.tagline}>일본 여행, 타비 하나로</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    resizeMode: "contain",
  },
  bottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    gap: spacing.md,
  },
  // 가는 진행 막대(무채색) — 빙글 도는 스피너 대신 요즘 앱들처럼 조용하게
  track: { width: 48, height: 3, borderRadius: 2, backgroundColor: colors.neutral200, overflow: "hidden" },
  thumb: { width: 24, height: 3, borderRadius: 2, backgroundColor: colors.textPrimary },
  tagline: { fontSize: 13, lineHeight: 18, fontWeight: "500", color: colors.textTertiary, letterSpacing: -0.1 },
});
