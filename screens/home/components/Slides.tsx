import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Linking,
} from "react-native";
import { colors, spacing, radius } from "@/styles";

const SCREEN_W = Dimensions.get("window").width;

// Figma: 카드 124×174px (portrait), 360px 화면 기준 → 비율 유지
const CARD_W = Math.round(SCREEN_W * (124 / 360));
const CARD_H = Math.round(CARD_W * (174 / 124));
const CARD_GAP = 18; // Figma: 카드 사이 간격 18px

export interface Destination {
  id: string;
  title: string;
  description?: string;
  image?: string;
  link?: string;
}

interface Props {
  data?: Destination[];
}

const FALLBACK: Destination[] = [
  {
    id: "1",
    title: "오사카의 자연과\n마주하는 힐링 여행",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=80",
  },
  {
    id: "2",
    title: "일본 박사 타비가\n추천하는 일본 여행지",
    image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&q=80",
  },
  {
    id: "3",
    title: "후쿠오카 꼭 가야하는\n맛집 추천",
    image: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80",
  },
];

export default function Slides({ data }: Props) {
  const slides = data && data.length > 0 ? data : FALLBACK;

  return (
    <View style={styles.container}>
      <FlatList
        data={slides}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        // Figma: 첫 카드 x=16
        contentContainerStyle={{ paddingHorizontal: 16, gap: CARD_GAP }}
        snapToInterval={CARD_W + CARD_GAP}
        decelerationRate="fast"
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => item.link && Linking.openURL(item.link).catch(() => {})}
            style={[styles.card, { width: CARD_W, height: CARD_H }]}
          >
            <Image
              source={{ uri: item.image }}
              style={StyleSheet.absoluteFillObject}
              resizeMode="cover"
            />
            {/* Figma: 상단 그라디언트 오버레이 (높이 = 카드의 52%) */}
            <View style={[styles.overlay, { height: Math.round(CARD_H * 0.52) }]} />
            {/* 텍스트: Figma 기준 상단 12px */}
            <View style={styles.textWrap}>
              <Text style={styles.title}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    paddingBottom: spacing.md,
  },
  card: {
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: colors.neutral200,
  },
  // 상단 그라디언트: 이미지 위에 어두운 오버레이
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  textWrap: {
    position: "absolute",
    top: 12,
    left: 14,
    right: 14,
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textWhite,
    lineHeight: 18,
    letterSpacing: -0.2,
  },
});
