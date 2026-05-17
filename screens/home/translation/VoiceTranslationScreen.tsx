import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header/Header";
import { layout, colors, spacing, radius } from "@/styles";

type Lang = "ko" | "ja";

export default function VoiceTranslationScreen() {
  const [sourceLang, setSourceLang] = useState<Lang>("ja");
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const [result, setResult] = useState("");

  const titleLine1 = sourceLang === "ja" ? "음성으로" : "음성으로";

  const toggleLang = () => {
    setSourceLang((p) => (p === "ko" ? "ja" : "ko"));
    setRecognizedText("");
    setResult("");
  };

  // 음성 인식은 expo-speech / expo-av 연동 필요
  // 현재: UI 시뮬레이션
  const handleMicPress = () => {
    if (isRecording) {
      setIsRecording(false);
      setRecognizedText("녹음이 완료되었습니다.\n(음성 인식 API 연동 필요)");
    } else {
      setIsRecording(true);
      setRecognizedText("");
      setResult("");
    }
  };

  return (
    <View style={layout.screen}>
      <Header backwardButton="simple" />

      <View style={styles.content}>
        {/* 홈_번역 스타일: 두줄 제목 */}
        <View style={styles.titleBlock}>
          <View>
            <Text style={styles.titleLine1}>{titleLine1}</Text>
            <Text style={styles.titleLine2}>번역</Text>
          </View>
          <TouchableOpacity style={styles.toggleBtn} onPress={toggleLang} activeOpacity={0.7}>
            <Text style={styles.toggleText}>
              {sourceLang === "ja" ? "日→한" : "한→日"}
            </Text>
            <Ionicons name="swap-horizontal" size={14} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* 마이크 버튼 — 중앙 큰 원형 버튼 */}
        <View style={styles.micSection}>
          <TouchableOpacity
            style={[styles.micButton, isRecording && styles.micButtonRecording]}
            onPress={handleMicPress}
            activeOpacity={0.8}
          >
            {isRecording ? (
              <View style={styles.stopIcon} />
            ) : (
              <Ionicons name="mic" size={40} color={colors.textWhite} />
            )}
          </TouchableOpacity>

          <Text style={styles.micLabel}>
            {isRecording ? "녹음 중... 탭하여 중지" : "마이크를 탭하여 시작"}
          </Text>
        </View>

        {/* 인식된 텍스트 */}
        {!!recognizedText && (
          <View style={styles.textBox}>
            <Text style={styles.textBoxLabel}>인식된 텍스트</Text>
            <Text style={styles.textBoxContent}>{recognizedText}</Text>
          </View>
        )}

        {/* 번역 결과 */}
        {!!result && (
          <View style={[styles.textBox, styles.textBoxResult]}>
            <Text style={styles.textBoxLabel}>번역 결과</Text>
            <Text style={styles.textBoxContent}>{result}</Text>
          </View>
        )}

        {/* 안내 */}
        <View style={styles.notice}>
          <Ionicons name="information-circle-outline" size={14} color={colors.textTertiary} />
          <Text style={styles.noticeText}>
            음성 인식은 추후 업데이트 예정입니다.
          </Text>
        </View>
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
    // 그림자
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

  notice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    position: "absolute",
    bottom: 32,
    left: 20,
    right: 20,
    justifyContent: "center",
  },
  noticeText: { fontSize: 12, color: colors.textTertiary },
});
