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

// 외부 사이트로 이동하는 배너 — 가로로 넓은 배너 비율(약 2.3:1), 한 번에 한 장씩 스와이프
const CARD_W = SCREEN_W - spacing.md * 2;
const CARD_H = Math.round(CARD_W * 0.43);
const CARD_GAP = spacing.md;

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
    title: "오사카의 자연과 마주하는 힐링 여행",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
  },
  {
    id: "2",
    title: "일본 박사 타비가 추천하는 일본 여행지",
    image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80",
  },
  {
    id: "3",
    title: "후쿠오카 꼭 가야하는 맛집 추천",
    image: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&q=80",
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
        contentContainerStyle={{ paddingHorizontal: spacing.md, gap: CARD_GAP }}
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
            <View style={styles.overlay} />
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.md,
  },
  card: {
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: colors.neutral200,
    justifyContent: "flex-end",
  },
  // 하단 텍스트 가독성을 위한 최소한의 그라디언트
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "55%",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textWhite,
    letterSpacing: -0.2,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
});
