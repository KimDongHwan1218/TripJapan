import React, { useEffect, useState } from "react";
import { Button, View, Text, ScrollView, StyleSheet } from "react-native";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

const KAKAO_REST_API_KEY = "f627d6cdaf31eaf3ffbe3fd148406d53";

type KakaoLoginProps = {
  onSuccess?: () => void;
  onError?: (err: Error) => void;
};

export default function KakaoLogin({ onSuccess, onError }: KakaoLoginProps) {
  const [logs, setLogs] = useState<string[]>([]);

  const log = (message: string) => {
    console.log(message);
    setLogs((prev) => [...prev, message]);
  };

  // Expo 웹 / localhost 환경용
  const redirectUri = AuthSession.makeRedirectUri({
    useProxy: true, // 웹에서 localhost 사용 가능하게 함
  } as any);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: KAKAO_REST_API_KEY,
      redirectUri,
      responseType: "code",
    },
    {
      authorizationEndpoint: "https://kauth.kakao.com/oauth/authorize",
      tokenEndpoint: "https://kauth.kakao.com/oauth/token",
    }
  );

  useEffect(() => {
    if (!response) return;
    log("Auth response changed: " + JSON.stringify(response));

    if (response.type === "success" && response.params.code) {
      const code = response.params.code;
      log("Authorization code: " + code);

      (async () => {
        try {
          log("Fetching access token...");
          const tokenRes = await fetch("https://kauth.kakao.com/oauth/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `grant_type=authorization_code&client_id=${KAKAO_REST_API_KEY}&redirect_uri=${encodeURIComponent(
              redirectUri
            )}&code=${code}&code_verifier=${request?.codeVerifier}`
          });
          const tokenData = await tokenRes.json();
          log("Token response: " + JSON.stringify(tokenData));

          if (!tokenData.access_token) {
            throw new Error(tokenData.error_description || "No access token received");
          }

          log("Fetching user info...");
          const userRes = await fetch("https://kapi.kakao.com/v2/user/me", {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
          });
          const userData = await userRes.json();
          log("User info: " + JSON.stringify(userData));

          // 성공 시 콜백 호출
          onSuccess?.();
        } catch (err: any) {
          log("Error during login: " + err.message);
          onError?.(err);
        }
      })();
    } else if (response.type === "dismiss") {
      const err = new Error("User dismissed the login or flow failed");
      log(err.message);
      onError?.(err);
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Button
        title="카카오 로그인"
        disabled={!request}
        onPress={async () => {
          try {
            log("Starting promptAsync...");
            await promptAsync({ useProxy: true } as any); // 웹 환경에서 PKCE + localhost 대응
          } catch (err: any) {
            log("promptAsync error: " + err.message);
            onError?.(err);
          }
        }}
      />
      <Text style={{ marginTop: 20, fontWeight: "bold" }}>Logs:</Text>
      <ScrollView style={{ width: "100%", maxHeight: 200, marginTop: 10 }}>
        {logs.map((l, i) => (
          <Text key={i} style={{ fontSize: 12, marginVertical: 2 }}>
            {l}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
});
