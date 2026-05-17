import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "@/navigation/HomeStackNavigator";
import Header from "@/components/Header/Header";
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
  const navigation = useNavigation<Nav>();

  return (
    <View style={layout.screen}>
      <Header backwardButton="simple" />

      {/* 홈_번역 스타일: 두줄 제목 */}
      <View style={styles.titleBlock}>
        <Text style={styles.titleLine1}>일본어</Text>
        <Text style={styles.titleLine2}>번역</Text>
      </View>

      {/* 방식 선택 카드 */}
      <View style={styles.cards}>
        {METHODS.map(({ key, icon, label, desc, iconColor }) => (
          <TouchableOpacity
            key={key}
            style={styles.card}
            onPress={() => navigation.navigate(key)}
            activeOpacity={0.8}
          >
            <View style={[styles.iconBox, { backgroundColor: iconColor + "18" }]}>
              <Ionicons name={icon} size={28} color={iconColor} />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardLabel}>{label}</Text>
              <Text style={styles.cardDesc}>{desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.neutral300} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleBlock: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  titleLine1: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  titleLine2: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 34,
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
    fontSize: 13,
    color: colors.textTertiary,
  },
});
