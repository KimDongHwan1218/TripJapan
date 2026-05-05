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

const { width } = Dimensions.get("window");

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
    title: "NAVITIME Japan",
    description: "일본 내 길찾기, 교통편 검색에 특화된 최고의 앱",
    image:
      "https://play-lh.googleusercontent.com/NIzkL7tpgs8QTeRhtHbqlIuFZ9YbPyFWyDQb8JAcQBCYwnzjYOfBfrMC2rW5G4OG-Q=w480-h960-rw",
    link: "https://www.navitime.co.jp/",
  },
  {
    id: "2",
    title: "PayPay",
    description: "일본에서 가장 많이 쓰이는 간편결제 서비스",
    image:
      "https://play-lh.googleusercontent.com/0I5V52oWbXf0Gd1vC3bSl5IXDylCZTDc4qvdDvdPVxZl8DJx_tGfaHcFDq8v3X85eQ=w480-h960-rw",
    link: "https://paypay.ne.jp/",
  },
];

export default function Slides({ data }: Props) {
  const slides = data && data.length > 0 ? data : FALLBACK;

  const CARD_WIDTH = Math.round(width * 0.72);
  const CARD_HEIGHT = Math.round(CARD_WIDTH * 1.2); // 세로 카드 비율 (4:4.8)
  const CARD_GAP = 12;

  const handleOpenLink = (url?: string) => {
    if (!url) return;
    Linking.openURL(url).catch(console.error);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={slides}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: spacing.xs }}
        snapToInterval={CARD_WIDTH + CARD_GAP}
        decelerationRate="fast"
        renderItem={({ item }) => (
          <View style={{ width: CARD_WIDTH + CARD_GAP }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => handleOpenLink(item.link)}
              style={{ width: CARD_WIDTH }}
            >
              <View style={[styles.card, { height: CARD_HEIGHT }]}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <View style={styles.gradientOverlay} />
                <View style={styles.overlay}>
                  <Text style={styles.title}>{item.title}</Text>
                  {!!item.description && (
                    <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
                  )}
                  {item.link && (
                    <View style={styles.goBtn}>
                      <Text style={styles.goBtnText}>보러가기</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    paddingBottom: spacing.xs,
  },
  card: {
    width: "100%",
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.neutral200,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    paddingTop: spacing.xl,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textWhite,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
    lineHeight: 17,
  },
  goBtn: {
    alignSelf: "flex-start",
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  goBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textWhite,
  },
});
