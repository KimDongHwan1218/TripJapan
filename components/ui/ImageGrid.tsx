import React, { useState } from "react";
import { View, Image, TouchableOpacity, Text, StyleSheet, LayoutChangeEvent } from "react-native";
import { colors, radius } from "@/styles";
import ImageLightbox from "./ImageLightbox";

const GAP = 4;

type Props = { images: string[] };

export default function ImageGrid({ images }: Props) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  const handleLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w !== containerWidth) setContainerWidth(w);
  };

  // 큰 정사각형 하나 + 작은 정사각형 2개가 정확히 같은 높이로 맞춰지도록 계산
  // 2*small + gap = big, small = big열너비 → big = (2W - gap) / 3
  const bigSize = (2 * containerWidth - GAP) / 3;
  const smallSize = (containerWidth - 2 * GAP) / 3;

  return (
    <View onLayout={handleLayout}>
      {images.length === 1 && (
        <TouchableOpacity activeOpacity={0.9} onPress={() => setLightboxIndex(0)}>
          <Image source={{ uri: images[0] }} style={styles.single} resizeMode="cover" />
        </TouchableOpacity>
      )}

      {images.length === 2 && containerWidth > 0 && (
        <View style={styles.row}>
          {images.map((uri, i) => (
            <TouchableOpacity
              key={i}
              activeOpacity={0.9}
              onPress={() => setLightboxIndex(i)}
              style={{ width: (containerWidth - GAP) / 2, height: (containerWidth - GAP) / 2 }}
            >
              <Image source={{ uri }} style={styles.fill} resizeMode="cover" />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {images.length >= 3 && containerWidth > 0 && (
        <View style={styles.row}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setLightboxIndex(0)}
            style={{ width: bigSize, height: bigSize, borderRadius: radius.md, overflow: "hidden" }}
          >
            <Image source={{ uri: images[0] }} style={styles.fill} resizeMode="cover" />
          </TouchableOpacity>

          <View style={{ gap: GAP }}>
            {images.slice(1, 3).map((uri, i) => {
              const idx = i + 1;
              const remaining = images.length - 3;
              const showMoreOverlay = idx === 2 && remaining > 0;
              return (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.9}
                  onPress={() => setLightboxIndex(idx)}
                  style={{ width: smallSize, height: smallSize, borderRadius: radius.md, overflow: "hidden" }}
                >
                  <Image source={{ uri }} style={styles.fill} resizeMode="cover" />
                  {showMoreOverlay && (
                    <View style={styles.moreOverlay}>
                      <Text style={styles.moreText}>+{remaining}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      <ImageLightbox
        images={images}
        visible={lightboxIndex !== null}
        initialIndex={lightboxIndex ?? 0}
        onClose={() => setLightboxIndex(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: GAP },
  single: {
    width: "100%",
    aspectRatio: 4 / 3,
    borderRadius: radius.md,
    backgroundColor: colors.neutral100,
  },
  fill: { width: "100%", height: "100%", backgroundColor: colors.neutral100 },
  moreOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  moreText: { color: "#fff", fontSize: 20, fontWeight: "700" },
});
