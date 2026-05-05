import React, { useState, useEffect, useRef } from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Linking,
} from "react-native";
import { ENV } from "@/config/env";

const API_BASE = ENV.API_BASE_URL;

interface Props {
  onSuccess: (data: {
    user: any;
    accessToken: string;
    refreshToken: string;
  }) => void;
  onError?: (err: Error) => void;
}

export default function KakaoLoginButton({ onSuccess, onError }: Props) {
  const [loading, setLoading] = useState(false);
  const cancelledRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handlePress = async () => {
    setLoading(true);
    cancelledRef.current = false;

    try {
      // redirectUri 없이 세션 생성 → 서버가 폴링 모드로 동작
      const sessionRes = await fetch(`${API_BASE}/auth/session/init`);
      const { tempSessionId } = await sessionRes.json();

      // 5분 타임아웃
      timeoutRef.current = setTimeout(() => {
        cancelledRef.current = true;
        setLoading(false);
      }, 5 * 60 * 1000);

      // 브라우저로 카카오 로그인 페이지 열기
      await Linking.openURL(`${API_BASE}/auth/kakao/start?session=${tempSessionId}`);

      // 폴링 시작 (브라우저에서 로그인 완료되면 서버에 결과가 저장됨)
      poll(tempSessionId);
    } catch (err: any) {
      setLoading(false);
      onError?.(err);
      Alert.alert("카카오 로그인 실패", err.message);
    }
  };

  const poll = async (tempSessionId: string) => {
    while (!cancelledRef.current) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      if (cancelledRef.current) break;

      try {
        const res = await fetch(`${API_BASE}/auth/session/status/${tempSessionId}`);
        const { status } = await res.json();

        if (status === "success") {
          const consumeRes = await fetch(`${API_BASE}/auth/session/consume/${tempSessionId}`);
          const data = await consumeRes.json();
          if (cancelledRef.current) return;
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          setLoading(false);
          onSuccess(data);
          return;
        }

        if (status === "invalid") {
          if (!cancelledRef.current) {
            setLoading(false);
            Alert.alert("로그인 실패", "세션이 만료되었습니다. 다시 시도해주세요.");
          }
          return;
        }

        // "pending" → 계속 폴링
      } catch {
        // 네트워크 일시 오류 → 계속 폴링
      }
    }
  };

  return (
    <TouchableOpacity
      style={styles.btn}
      onPress={handlePress}
      disabled={loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#3C1E1E" />
      ) : (
        <Text style={styles.label}>카카오 로그인</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: "100%",
    height: 52,
    backgroundColor: "#FEE500",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#3C1E1E",
  },
});
