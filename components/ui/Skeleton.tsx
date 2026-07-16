import { useEffect, useRef } from "react";
import { Animated, DimensionValue, StyleProp, ViewStyle } from "react-native";
import { colors, radius as radiusTokens } from "@/styles";

type Props = {
  width?: DimensionValue;
  height?: DimensionValue;
  radius?: number;
  style?: StyleProp<ViewStyle>;
};

// 회색 박스가 은은하게 깜빡이며 "로딩 중"임을 나타내는 공용 스켈레톤 placeholder.
export default function Skeleton({ width = "100%", height = 16, radius = radiusTokens.sm, style }: Props) {
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.5, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        { width, height, borderRadius: radius, backgroundColor: colors.neutral200, opacity },
        style,
      ]}
    />
  );
}
