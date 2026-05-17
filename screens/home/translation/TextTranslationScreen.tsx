import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Clipboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header/Header";
import { layout, colors, spacing, radius } from "@/styles";
import { ENV } from "@/config/env";

type Lang = "ko" | "ja";
const SERVER_URL = ENV.TRANSLATION_SERVER_URL;

export default function TextTranslationScreen() {
  const [sourceLang, setSourceLang] = useState<Lang>("ja");
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const targetLang: Lang = sourceLang === "ja" ? "ko" : "ja";
  const titleLine1 = sourceLang === "ja" ? "일본어로" : "한국어로";

  const toggleLang = () => {
    setSourceLang((p) => (p === "ko" ? "ja" : "ko"));
    setInputText("");
    setResult("");
  };

  const translate = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setResult("");
    try {
      const res = await fetch(`${SERVER_URL}/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: inputText, source: sourceLang, target: targetLang, format: "text" }),
      });
      const data = await res.json();
      setResult(data.translatedText ?? "⚠️ 번역 결과가 없습니다.");
    } catch {
      setResult("⚠️ 번역 요청 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const copyResult = () => {
    if (result) Clipboard.setString(result);
  };

  return (
    <View style={layout.screen}>
      {/* Figma: back 버튼만, 타이틀 없음 */}
      <Header backwardButton="simple" />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Figma: "일본어로\n번역" x=20, y=122 두줄 */}
        <View style={styles.titleBlock}>
          <View>
            <Text style={styles.titleLine1}>{titleLine1}</Text>
            <Text style={styles.titleLine2}>번역</Text>
          </View>
          {/* 언어 토글 */}
          <TouchableOpacity style={styles.toggleBtn} onPress={toggleLang} activeOpacity={0.7}>
            <Text style={styles.toggleText}>
              {sourceLang === "ja" ? "日→한" : "한→日"}
            </Text>
            <Ionicons name="swap-horizontal" size={14} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Figma: textarea x=20, y=194, 320×164, placeholder at (15,15) */}
        <View style={styles.textareaWrap}>
          <TextInput
            style={styles.textarea}
            multiline
            placeholder="번역할 내용을 입력해주세요."
            placeholderTextColor={colors.textTertiary}
            value={inputText}
            onChangeText={setInputText}
            textAlignVertical="top"
          />
        </View>

        {/* Figma: 버튼 x=26, y=378, 308×50 빨간 pill */}
        <TouchableOpacity
          style={[styles.button, !inputText.trim() && styles.buttonDisabled]}
          onPress={translate}
          disabled={loading || !inputText.trim()}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color={colors.textWhite} />
          ) : (
            <Text style={styles.buttonText}>번역하기</Text>
          )}
        </TouchableOpacity>

        {/* 결과 */}
        {!!result && (
          <View style={styles.resultWrap}>
            <Text style={styles.resultText}>{result}</Text>
            <TouchableOpacity style={styles.copyBtn} onPress={copyResult} activeOpacity={0.7}>
              <Ionicons name="copy-outline" size={15} color={colors.primary} />
              <Text style={styles.copyText}>복사</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 48 },

  // Figma: x=20, y=122 (화면 기준) → paddingTop 20
  titleBlock: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
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

  // Figma: x=20, y=194, 320×164, padding(15,15)
  textareaWrap: {
    marginHorizontal: 20,
    width: 320,
    height: 164,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 15,
  },
  textarea: { flex: 1, fontSize: 15, color: colors.textPrimary, lineHeight: 22 },

  // Figma: x=26, y=378, 308×50 pill
  button: {
    marginHorizontal: 26,
    marginTop: 20,
    width: 308,
    height: 50,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: { backgroundColor: colors.neutral300 },
  buttonText: { fontSize: 16, fontWeight: "700", color: colors.textWhite },

  resultWrap: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 15,
    backgroundColor: colors.neutral100,
    borderRadius: radius.md,
    gap: 12,
  },
  resultText: { fontSize: 15, color: colors.textPrimary, lineHeight: 22 },
  copyBtn: { flexDirection: "row", alignItems: "center", gap: 4, alignSelf: "flex-end" },
  copyText: { fontSize: 13, color: colors.primary, fontWeight: "600" },
});
