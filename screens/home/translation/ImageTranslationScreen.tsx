import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header/Header";
import { layout, colors, spacing, radius } from "@/styles";
import { ENV } from "@/config/env";

type Lang = "ko" | "ja";
const SERVER_URL = ENV.TRANSLATION_SERVER_URL;

export default function ImageTranslationScreen() {
  const [sourceLang, setSourceLang] = useState<Lang>("ja");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [originalText, setOriginalText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const targetLang: Lang = sourceLang === "ja" ? "ko" : "ja";
  const titleLine1 = sourceLang === "ja" ? "이미지로" : "이미지를";

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;

    const picked = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (picked.canceled) return;

    const uri = picked.assets[0].uri;
    setImageUri(uri);
    setOriginalText("");
    setResult("");
  };

  const translate = async () => {
    if (!imageUri) return;
    setLoading(true);
    setResult("");
    setOriginalText("");

    const fileName = imageUri.split("/").pop() ?? "photo.jpg";
    const type = fileName.endsWith(".png") ? "image/png" : "image/jpeg";
    const formData = new FormData();
    formData.append("image", { uri: imageUri, name: fileName, type } as any);
    formData.append("source", sourceLang);
    formData.append("target", targetLang);

    try {
      const res = await fetch(`${SERVER_URL}/image-translate`, {
        method: "POST",
        headers: { "Content-Type": "multipart/form-data" },
        body: formData,
      });
      const data = await res.json();
      setOriginalText(data.originalText ?? "");
      setResult(data.translatedText ?? "⚠️ 번역 결과가 없습니다.");
    } catch {
      setResult("⚠️ 번역 요청 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={layout.screen}>
      <Header backwardButton="simple" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* 홈_번역 스타일: 두줄 제목 */}
        <View style={styles.titleBlock}>
          <View>
            <Text style={styles.titleLine1}>{titleLine1}</Text>
            <Text style={styles.titleLine2}>번역</Text>
          </View>
          <TouchableOpacity
            style={styles.toggleBtn}
            onPress={() => { setSourceLang((p) => p === "ko" ? "ja" : "ko"); setImageUri(null); setResult(""); }}
            activeOpacity={0.7}
          >
            <Text style={styles.toggleText}>{sourceLang === "ja" ? "日→한" : "한→日"}</Text>
            <Ionicons name="swap-horizontal" size={14} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* 이미지 선택 영역 — 320×164 맞춤 */}
        <TouchableOpacity style={styles.imageArea} onPress={pickImage} activeOpacity={0.8}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} resizeMode="cover" />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera-outline" size={36} color={colors.neutral300} />
              <Text style={styles.imagePlaceholderText}>이미지를 선택하세요</Text>
              <Text style={styles.imagePlaceholderSub}>갤러리에서 사진을 선택합니다</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* 번역하기 버튼 — Figma: 308×50 pill */}
        <TouchableOpacity
          style={[styles.button, !imageUri && styles.buttonDisabled]}
          onPress={translate}
          disabled={loading || !imageUri}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color={colors.textWhite} />
          ) : (
            <Text style={styles.buttonText}>번역하기</Text>
          )}
        </TouchableOpacity>

        {/* 원문 */}
        {!!originalText && (
          <View style={styles.resultWrap}>
            <Text style={styles.resultLabel}>원문</Text>
            <Text style={styles.resultText}>{originalText}</Text>
          </View>
        )}

        {/* 번역 결과 */}
        {!!result && (
          <View style={[styles.resultWrap, { marginTop: 12 }]}>
            <Text style={styles.resultLabel}>번역 결과</Text>
            <Text style={styles.resultText}>{result}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 48 },

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

  // 이미지 영역: 홈_번역 textarea와 같은 위치/크기
  imageArea: {
    marginHorizontal: 20,
    width: 320,
    height: 164,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderStyle: "dashed",
    overflow: "hidden",
  },
  imagePreview: { width: "100%", height: "100%" },
  imagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  imagePlaceholderText: { fontSize: 14, fontWeight: "600", color: colors.textTertiary },
  imagePlaceholderSub: { fontSize: 12, color: colors.neutral300 },

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
    gap: 8,
  },
  resultLabel: { fontSize: 12, fontWeight: "600", color: colors.textTertiary },
  resultText: { fontSize: 15, color: colors.textPrimary, lineHeight: 22 },
});
