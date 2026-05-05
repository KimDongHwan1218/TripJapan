import React from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { colors, spacing, radius } from "@/styles";

const { width } = Dimensions.get("window");

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80";

interface Props {
  image?: string;
  title?: string;
  subtitle?: string;
  onPress?: () => void;
}

export default function HeroBanner({
  image = FALLBACK_IMAGE,
  title = "타비가 추천하는\n진짜 일본 여행",
  subtitle = "타비가 추천하는 진짜 일본 여행\n지금 바로 떠나보세요!",
  onPress,
}: Props) {
  return (
    <TouchableOpacity activeOpacity={0.95} onPress={onPress} disabled={!onPress}>
      <ImageBackground
        source={{ uri: image }}
        style={styles.banner}
        imageStyle={styles.bannerImage}
      >
        <View style={styles.overlay} />
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  banner: {
    width: width,
    height: 280,
    justifyContent: "flex-end",
  },
  bannerImage: {
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.38)",
    borderRadius: 0,
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
