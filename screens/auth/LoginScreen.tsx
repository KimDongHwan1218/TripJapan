import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
} from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import KakaoLoginButton from "./components/KakaoLogin";
import GoogleLoginButton from "./components/GoogleLogin";
import { colors } from "@/styles/colors";

export default function LoginScreen() {
  const { login } = useAuth();

  const handleSuccess = (data: {
    user: any;
    accessToken: string;
    refreshToken: string;
  }) => {
    login({
      user: data.user,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });
  };

  return (
    <ImageBackground
      source={require("@/assets/images/intro_bg.mp4")}
      style={styles.bg}
      resizeMode="cover"
    >
      {/* 어두운 오버레이 */}
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safe}>
        {/* 상단 로고 + 슬로건 */}
        <View style={styles.top}>
          <Text style={styles.logo}>tabi</Text>
          <Text style={styles.slogan}>일본 여행의 모든 것</Text>
        </View>

        {/* 하단 로그인 버튼 영역 */}
        <View style={styles.bottom}>
          <KakaoLoginButton onSuccess={handleSuccess} />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>또는</Text>
            <View style={styles.dividerLine} />
          </View>

          <GoogleLoginButton onSuccess={handleSuccess} />

          <Text style={styles.terms}>
            로그인 시 서비스 이용약관 및 개인정보처리방침에 동의하게 됩니다.
          </Text>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  safe: {
    flex: 1,
    justifyContent: "space-between",
  },

  // 상단 로고
  top: {
    paddingHorizontal: 28,
    paddingTop: 64,
    gap: 8,
  },
  logo: {
    fontSize: 42,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -1,
  },
  slogan: {
    fontSize: 16,
    fontWeight: "500",
    color: "rgba(255,255,255,0.75)",
  },

  // 하단 버튼 영역
  bottom: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 12,
  },
  // 구분선
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 2,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  dividerText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
    fontWeight: "500",
  },

  // 약관
  terms: {
    fontSize: 11,
    color: "rgba(255,255,255,0.4)",
    textAlign: "center",
    lineHeight: 17,
    marginTop: 4,
  },
});
