import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header/Header";
import { layout, colors, spacing, radius } from "@/styles";
import { ENV } from "@/config/env";

type Lang = "ko" | "ja";

export default function VoiceTranslationScreen() {
  const [sourceLang, setSourceLang] = useState<Lang>("ja");
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const [result, setResult] = useState("");
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const toggleLang = () => {
    setSourceLang((p) => (p === "ko" ? "ja" : "ko"));
    setRecognizedText("");
    setResult("");
  };

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("권한 필요", "마이크 사용 권한이 필요합니다.");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: rec } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(rec);
      setIsRecording(true);
      setRecognizedText("");
      setResult("");
    } catch {
      Alert.alert("오류", "녹음을 시작할 수 없습니다.");
    }
  };

  const stopAndProcess = async () => {
    if (!recording) return;
    setIsRecording(false);
    setLoading(true);

    try {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      const uri = recording.getURI();
      setRecording(null);

      if (!uri) throw new Error("No URI");

      // 1. STT
      const formData = new FormData();
      formData.append("audio", { uri, name: "recording.m4a", type: "audio/m4a" } as any);
      formData.append("lang", sourceLang);

      const sttRes = await fetch(`${ENV.TRANSLATION_SERVER_URL}/stt`, {
        method: "POST",
        body: formData,
      });

      if (!sttRes.ok) throw new Error("STT failed");

      const { text } = await sttRes.json();
      setRecognizedText(text);

      // 2. 번역
      const targetLang: Lang = sourceLang === "ko" ? "ja" : "ko";
      const transRes = await fetch(`${ENV.TRANSLATION_SERVER_URL}/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: text, source: sourceLang, target: targetLang, format: "text" }),
      });

      if (!transRes.ok) throw new Error("Translation failed");

      const { translatedText } = await transRes.json();
      setResult(translatedText);
    } catch {
      Alert.alert("오류", "음성 인식에 실패했습니다.\n다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleMicPress = () => {
    if (isRecording) {
      stopAndProcess();
    } else {
      startRecording();
    }
  };

  return (
    <View style={layout.screen}>
      <Header backwardButton="simple" />

      <View style={styles.content}>
        <View style={styles.titleBlock}>
          <View>
            <Text style={styles.titleLine1}>음성으로</Text>
            <Text style={styles.titleLine2}>번역</Text>
          </View>
          <TouchableOpacity style={styles.toggleBtn} onPress={toggleLang} activeOpacity={0.7}>
            <Text style={styles.toggleText}>
              {sourceLang === "ja" ? "日→한" : "한→日"}
            </Text>
            <Ionicons name="swap-horizontal" size={14} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.micSection}>
          <TouchableOpacity
            style={[styles.micButton, isRecording && styles.micButtonRecording]}
            onPress={handleMicPress}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.textWhite} size="large" />
            ) : isRecording ? (
              <View style={styles.stopIcon} />
            ) : (
              <Ionicons name="mic" size={40} color={colors.textWhite} />
            )}
          </TouchableOpacity>

          <Text style={styles.micLabel}>
            {loading
              ? "인식 중..."
              : isRecording
              ? "녹음 중... 탭하여 중지"
              : "마이크를 탭하여 시작"}
          </Text>
        </View>

        {!!recognizedText && (
          <View style={styles.textBox}>
            <Text style={styles.textBoxLabel}>인식된 텍스트</Text>
            <Text style={styles.textBoxContent}>{recognizedText}</Text>
          </View>
        )}

        {!!result && (
          <View style={[styles.textBox, styles.textBoxResult]}>
            <Text style={styles.textBoxLabel}>번역 결과</Text>
            <Text style={styles.textBoxContent}>{result}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const MIC_SIZE = 96;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  titleBlock: {
    paddingTop: 20,
    paddingBottom: 32,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  titleLine1: { fontSize: 22, fontWeight: "800", color: colors.textPrimary, letterSpacing: -0.5, lineHeight: 28 },
  titleLine2: { fontSize: 22, fontWeight: "800", color: colors.textPrimary, letterSpacing: -0.5, lineHeight: 28 },
  toggleBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  toggleText: { fontSize: 12, fontWeight: "600", color: colors.primary },

  micSection: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 20,
  },
  micButton: {
    width: MIC_SIZE,
    height: MIC_SIZE,
    borderRadius: MIC_SIZE / 2,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  micButtonRecording: {
    backgroundColor: colors.danger,
    shadowColor: colors.danger,
  },
  stopIcon: {
    width: 22,
    height: 22,
    borderRadius: 4,
    backgroundColor: colors.textWhite,
  },
  micLabel: {
    fontSize: 14,
    color: colors.textTertiary,
    fontWeight: "500",
    textAlign: "center",
  },

  textBox: {
    padding: 15,
    backgroundColor: colors.neutral100,
    borderRadius: radius.md,
    gap: 8,
    marginBottom: 12,
  },
  textBoxResult: {
    backgroundColor: colors.primarySoft,
  },
  textBoxLabel: { fontSize: 11, fontWeight: "600", color: colors.textTertiary },
  textBoxContent: { fontSize: 15, color: colors.textPrimary, lineHeight: 22 },
});
