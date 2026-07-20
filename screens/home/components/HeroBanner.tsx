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
import { ENV } from "@/config/env";

const { width } = Dimensions.get("window");

// 관리자 페이지에서 교체 가능 — 서버 응답이 없거나 비어있을 때만 이 기본값을 사용
const FALLBACK_IMAGES = [
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
  const [images, setImages] = useState<string[]>(FALLBACK_IMAGES);
  const [index, setIndex] = useState(0);
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    fetch(`${ENV.API_BASE_URL}/banners`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setImages(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (images.length < 2) return;
    const timer = setInterval(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: FADE_DURATION,
        useNativeDriver: true,
      }).start(() => {
        setIndex((prev) => (prev + 1) % images.length);
        Animated.timing(opacity, {
          toValue: 1,
          duration: FADE_DURATION,
          useNativeDriver: true,
        }).start();
      });
    }, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [opacity, images]);

  return (
    <TouchableOpacity activeOpacity={0.95} onPress={onPress} disabled={!onPress} style={styles.banner}>
      <Animated.Image
        source={{ uri: images[index % images.length] }}
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
