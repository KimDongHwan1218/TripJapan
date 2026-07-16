import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
const TabiLogo = require("@/assets/images/tabi_logo.png");
import { useAuth } from "@/contexts/AuthContext";
import { colors } from "@/styles/colors";

// AuthContext의 loading 자체가 최소 노출 시간을 보장하므로, 로딩 종료 후엔 짧게만 대기
const NAVIGATE_DELAY_MS = 400;

export default function IntroScreen() {
  const navigation = useNavigation<any>();
  const { user, loading } = useAuth();

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
      <Image source={TabiLogo} style={styles.logo} />
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
    width: 120,
    height: 54,
    resizeMode: "contain",
  },
});
