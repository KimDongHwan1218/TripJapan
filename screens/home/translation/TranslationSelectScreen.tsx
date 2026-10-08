import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Text from "@/components/ui/Text";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "@/navigation/HomeStackNavigator";
import Header from "@/components/Header/Header";
import { useScreenVariant } from "@/contexts/DesignContext";
import { layout, colors, spacing, radius } from "@/styles";

type Nav = NativeStackNavigationProp<HomeStackParamList>;

type Method = {
  key: "TextTranslation" | "ImageTranslation" | "VoiceTranslation";
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  desc: string;
  iconColor: string;
};

const METHODS: Method[] = [
  {
    key: "TextTranslation",
    icon: "create-outline",
    label: "텍스트 번역",
    desc: "직접 입력해서 번역",
    iconColor: "#2563EB",
  },
  {
    key: "ImageTranslation",
    icon: "camera-outline",
    label: "이미지 번역",
    desc: "사진 속 텍스트를 번역",
    iconColor: "#2A7A5A",
  },
  {
    key: "VoiceTranslation",
    icon: "mic-outline",
    label: "음성 번역",
    desc: "말로 바로 번역",
    iconColor: colors.primary,
  },
];

export default function TranslationSelectScreen() {
  const v2 = useScreenVariant("translate.select", ["현재", "헤더 제목 + 안내 한 줄"]) === 1;
  const navigation = useNavigation<Nav>();

  return (
    <View style={layout.screen}>
      <Header backwardButton="simple" title={v2 ? "번역" : undefined} />

      {/* 홈_번역 스타일: 두줄 제목 */}
      {v2 ? (
        <Text style={styles.v2Lead}>어떤 방식으로 번역할까요?</Text>
      ) : (
      <View style={styles.titleBlock}>
        <Text style={styles.titleLine1}>일본어</Text>
        <Text style={styles.titleLine2}>번역</Text>
      </View>
      )}

      {/* 방식 선택 카드 */}
      <View style={styles.cards}>
        {METHODS.map(({ key, icon, label, desc, iconColor }) => (
          <TouchableOpacity
            key={key}
            style={styles.card}
            onPress={() => navigation.navigate(key)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBox, { backgroundColor: iconColor + "18" }]}>
              <Ionicons name={icon} size={32} color={iconColor} />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardLabel}>{label}</Text>
              <Text style={styles.cardDesc}>{desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.neutral300} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // 디자인 2: 본문 두 줄 큰 제목 대신 헤더 제목 + 안내 한 줄(body 14)
  v2Lead: { fontSize: 14, lineHeight: 20, color: colors.textSecondary, paddingHorizontal: 20, paddingTop: 24, paddingBottom: 16 },
  titleBlock: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  titleLine1: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  titleLine2: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 32,
  },

  cards: {
    paddingHorizontal: 20,
    gap: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    gap: spacing.md,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  cardText: {
    flex: 1,
    gap: 4,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  cardDesc: {
    fontSize: 12,
    color: colors.textTertiary,
  },
});
