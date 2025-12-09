import React, { useState } from "react";
import { View, ActivityIndicator, TouchableOpacity, Text, Linking } from "react-native";

const API_BASE = "https://tavi-server.onrender.com";

export default function KakaoLogin({ onSuccess }: any) {
  const [loading, setLoading] = useState(false);

  const startLogin = async () => {
    try {
      setLoading(true);

      // 1) 임시 세션 생성
      const res = await fetch(`${API_BASE}/auth/session/init`);
      const { tempSessionId } = await res.json();

      if (!tempSessionId) throw new Error("세션 생성 실패");

      // 2) 외부 브라우저에서 로그인 시작
      Linking.openURL(`${API_BASE}/auth/kakao/start?session=${tempSessionId}`);

      // 3) 폴링 시작
      pollSession(tempSessionId);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // 로그인 완료될 때까지 폴링
  const pollSession = async (sessionId: string) => {
    let tries = 0;
    const maxTries = 30; // 30초

    const interval = setInterval(async () => {
      tries++;

      const res = await fetch(`${API_BASE}/auth/session/status/${sessionId}`);
      const { status } = await res.json();

      if (status === "success") {
        clearInterval(interval);

        // 토큰 가져오기
        const res2 = await fetch(`${API_BASE}/auth/session/consume/${sessionId}`);
        const data = await res2.json();

        onSuccess(data); // AuthContext.login() 호출됨
        setLoading(false);
      }

      if (tries > maxTries) {
        clearInterval(interval);
        setLoading(false);
        console.warn("로그인 타임아웃");
      }
    }, 1000);
  };

  return (
    <View>
      <TouchableOpacity
        style={{
          backgroundColor: "#FEE500",
          padding: 12,
          borderRadius: 8,
          alignItems: "center",
        }}
        onPress={startLogin}
        disabled={loading}
      >
        <Text style={{ fontWeight: "bold" }}>
          {loading ? "로그인 중..." : "카카오 로그인"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
