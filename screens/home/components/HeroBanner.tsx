import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Animated,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { colors, spacing } from "@/styles";

const { width } = Dimensions.get("window");

// 앱 내에서 이미 사용 중인(검증된) 일본 여행지 사진들을 히어로 슬라이드에도 재사용
const ROTATING_IMAGES = [
  "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=80",
  "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80",
  "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=1200&q=80",
];

const SLIDE_INTERVAL = 4000;
const FADE_DURATION = 500;

interface Props {
  title?: string;
  subtitle?: string;
  onPress?: () => void;
}

export default function HeroBanner({
  title = "타비가 추천하는\n진짜 일본 여행",
  subtitle = "타비가 추천하는 진짜 일본 여행\n지금 바로 떠나보세요!",
  onPress,
}: Props) {
  const [index, setIndex] = useState(0);
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setInterval(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: FADE_DURATION,
        useNativeDriver: true,
      }).start(() => {
        setIndex((prev) => (prev + 1) % ROTATING_IMAGES.length);
        Animated.timing(opacity, {
          toValue: 1,
          duration: FADE_DURATION,
          useNativeDriver: true,
        }).start();
      });
    }, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [opacity]);

  return (
    <TouchableOpacity activeOpacity={0.95} onPress={onPress} disabled={!onPress} style={styles.banner}>
      <Animated.Image
        source={{ uri: ROTATING_IMAGES[index] }}
        style={[StyleSheet.absoluteFillObject, { opacity }]}
        resizeMode="cover"
      />
      <View style={styles.overlay} />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  banner: {
    width: width,
    height: Math.round(width * (336 / 360)),
    justifyContent: "flex-end",
    overflow: "hidden",
    backgroundColor: colors.neutral200,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.38)",
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 28,
    gap: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.textWhite,
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 19,
  },
});
