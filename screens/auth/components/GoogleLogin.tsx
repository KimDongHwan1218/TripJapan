import React, { useState, useEffect, useRef } from "react";
import { TouchableOpacity, ActivityIndicator, StyleSheet, Alert, Linking, View } from "react-native";
import Text from "@/components/ui/Text";
import { ENV } from "@/config/env";
import { colors, radius } from "@/styles";

const API_BASE = ENV.API_BASE_URL;

interface Props {
  onSuccess: (data: {
    user: any;
    accessToken: string;
    refreshToken: string;
  }) => void;
  onError?: (err: Error) => void;
}

export default function GoogleLoginButton({ onSuccess, onError }: Props) {
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

      // 브라우저로 구글 로그인 페이지 열기
      await Linking.openURL(`${API_BASE}/auth/google/start?session=${tempSessionId}`);

      // 폴링 시작
      poll(tempSessionId);
    } catch (err: any) {
      setLoading(false);
      onError?.(err);
      Alert.alert("구글 로그인 실패", err.message);
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
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.textSecondary} />
      ) : (
        <>
          <View style={styles.googleIcon}>
            <Text style={styles.googleIconText}>G</Text>
          </View>
          <Text style={styles.label}>구글 로그인</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: "100%",
    height: 52,
    backgroundColor: colors.surface,
    borderRadius: radius.md, borderCurve: "continuous",
    borderWidth: 1.5,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  googleIcon: {
    width: 22,
    height: 22,
    borderRadius: radius.md, borderCurve: "continuous",
    backgroundColor: "#4285F4",
    alignItems: "center",
    justifyContent: "center",
  },
  googleIconText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textWhite,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
  },
});
