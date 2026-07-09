import { useState } from "react";
import { Image, ImageProps, View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius } from "@/styles";
import Skeleton from "./Skeleton";

type Props = Omit<ImageProps, "source" | "onError" | "onLoad" | "onLoadStart"> & {
  source?: ImageProps["source"];
  containerStyle?: StyleProp<ViewStyle>;
};

// 네트워크 이미지 로딩 중엔 스켈레톤을, 실패 시엔(또는 source가 없으면) "불러오지 못했습니다" 아이콘을 보여준다.
export default function ImageWithFallback({ source, style, containerStyle, ...rest }: Props) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  if (status === "error" || !source) {
    return (
      <View style={[styles.fallback, style as StyleProp<ViewStyle>, containerStyle]}>
        <Ionicons name="image-outline" size={28} color={colors.neutral500} />
        <Ionicons name="alert-circle" size={14} color={colors.neutral500} style={styles.errorBadge} />
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <Image
        source={source}
        style={style}
        onLoadStart={() => setStatus("loading")}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
        {...rest}
      />
      {status === "loading" && (
        <Skeleton style={[StyleSheet.absoluteFill, style as StyleProp<ViewStyle>]} radius={radius.sm} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: colors.neutral100,
    alignItems: "center",
    justifyContent: "center",
  },
  errorBadge: {
    position: "absolute",
    bottom: 6,
    right: "38%",
  },
});
