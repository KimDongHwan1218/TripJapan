// JapanMap.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ScheduleStackParamList } from "../../../navigation/ScheduleStackNavigator";
import { JP_REGIONS } from "./jp_regions";
import Button from "@/components/ui/Button";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const FRAME_WIDTH = SCREEN_WIDTH * 0.9;
const FRAME_HEIGHT = SCREEN_HEIGHT * 0.6;

const SVG_WIDTH = 720;
const SVG_HEIGHT = 720;

const DEFAULT_SCALE = 0.4;
const SELECTED_SCALE = 300;
const scaleX = 2;

const palette = [
  "#4ECDC4",
  "#FFD93D",
  "#FF6B6B",
  "#6C5CE7",
  "#00B894",
  "#FDCB6E",
  "#0984E3",
  "#E84393",
  "#00CEC9",
  "#A29BFE",
  "#55EFC4",
  "#FAB1A0",
  "#81ECEC",
  "#FFEAA7",
];

// --- Path x좌표만 스케일링 함수 ---
function scalePathD(d: string) {
  let counter = 0;
  return d.replace(/-?\d+(\.\d+)?/g, (match) => {
    let val = parseFloat(match);
    if (counter % 2 === 0) val *= scaleX;
    counter++;
    return val.toString();
  });
}

// --- Region 컴포넌트 ---
function Region({ name, color, d, onPress, isDimmed }: any) {
  const scaledD = scalePathD(d);
  return (
    <Path
      d={scaledD}
      fill={color}
      stroke="white"
      strokeWidth={2}
      fillOpacity={isDimmed ? 0.2 : 1}
      onPressIn={() => onPress(name, d)}
    />
  );
}

// --- Path 중심 좌표 계산 ---
function getPathCenter(d: string) {
  const nums = d.match(/-?\d+(\.\d+)?/g);
  if (!nums) return { cx: SVG_WIDTH / 2, cy: SVG_HEIGHT / 2 };

  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < nums.length; i += 2) {
    points.push({ x: parseFloat(nums[i]), y: parseFloat(nums[i + 1]) });
  }

  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
  const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  return { cx, cy };
}

// --- Path 크기 계산 ---
function getPathBox(d: string) {
  const nums = d.match(/-?\d+(\.\d+)?/g);
  if (!nums) return 1;

  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < nums.length; i += 2) {
    points.push({ x: parseFloat(nums[i]), y: parseFloat(nums[i + 1]) });
  }

  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const w = maxX - minX;
  const h = maxY - minY;

  return Math.max(w, h);
}

export default function JapanMap() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const navigation = useNavigation<any>();

  const svgScale = useSharedValue(DEFAULT_SCALE);
  const svgTranslateX = useSharedValue(0);
  const svgTranslateY = useSharedValue(0);

  useEffect(() => {
    const initX = (FRAME_WIDTH - SVG_WIDTH) / 2;
    const initY = (FRAME_HEIGHT - SVG_HEIGHT) / 2;
    svgTranslateX.value = initX;
    svgTranslateY.value = initY;
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: svgTranslateX.value },
      { translateY: svgTranslateY.value },
      { scale: svgScale.value },
    ],
  }));

  const zoomToRegion = (cx: number, cy: number, scale: number, d: string) => {
    const svgCenterX = SVG_WIDTH / 2;
    const svgCenterY = SVG_HEIGHT / 2;
    const frameCenterX = FRAME_WIDTH / 2;
    const frameCenterY = FRAME_HEIGHT / 2;
    const regionMaxwh = getPathBox(d);

    svgTranslateX.value = withTiming(
      frameCenterX - (cx - svgCenterX) * scale / regionMaxwh - svgCenterX,
      { duration: 400 }
    );
    svgTranslateY.value = withTiming(
      frameCenterY - (cy - svgCenterY) * scale / regionMaxwh - svgCenterY,
      { duration: 400 }
    );
    svgScale.value = withTiming(scale / regionMaxwh, { duration: 400 });
  };

  const handleResetPress = () => {
    setSelectedRegion(null);
    svgScale.value = withTiming(DEFAULT_SCALE, { duration: 400 });
    svgTranslateX.value = withTiming(
      (FRAME_WIDTH - SVG_WIDTH) / 2,
      { duration: 400 }
    );
    svgTranslateY.value = withTiming(
      (FRAME_HEIGHT - SVG_HEIGHT) / 2,
      { duration: 400 }
    );
  };

  const handleRegionPress = (name: string, d: string) => {
    const scaledD = scalePathD(d);
    setSelectedRegion(name);
    const { cx, cy } = getPathCenter(scaledD);
    zoomToRegion(cx, cy, SELECTED_SCALE, scaledD);
  };

  const outlineD = JP_REGIONS.map((r) => scalePathD(r.d)).join(" ");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🇯🇵 여행지 선택하기</Text>

      <View style={[styles.frame, { width: FRAME_WIDTH, height: FRAME_HEIGHT }]}>
        <TouchableOpacity style={styles.resetButton} onPress={handleResetPress}>
          <Text style={styles.resetText}>#</Text>
        </TouchableOpacity>

        <Animated.View
          style={[{ width: SVG_WIDTH, height: SVG_HEIGHT }, animatedStyle]}
        >
          <Svg
            width={SVG_WIDTH}
            height={SVG_HEIGHT}
            viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          >
            <Path d={outlineD} stroke="#b0c4de" strokeWidth={2} fill="none" />
            {JP_REGIONS.map((r, i) => (
              <Region
                key={r.name}
                name={r.name}
                color={
                  r.name === "Tokyo"
                    ? "#FF6B6B"
                    : r.name === "Osaka"
                    ? "#4ECDC4"
                    : r.name === "Kyoto"
                    ? "#FFD93D"
                    : palette[i % palette.length]
                }
                d={r.d}
                isDimmed={selectedRegion !== null && selectedRegion !== r.name}
                onPress={handleRegionPress}
              />
            ))}
          </Svg>
        </Animated.View>
      </View>

      {selectedRegion && (
        <View style={styles.infoBox}>
          <Text style={styles.regionName}>
            {selectedRegion === "Tokyo" && "🗼 도쿄"}
            {selectedRegion === "Osaka" && "🍜 오사카"}
            {selectedRegion === "Kyoto" && "⛩️ 교토"}
            {!["Tokyo", "Osaka", "Kyoto"].includes(selectedRegion) &&
              `🗺️ ${selectedRegion}`}
          </Text>

          <Text style={styles.description}>
            {selectedRegion === "Tokyo" &&
              "일본의 수도, 도쿄타워와 시부야의 활기가 넘치는 도시!"}
            {selectedRegion === "Osaka" &&
              "먹거리의 천국, 도톤보리와 오사카성으로 유명한 도시!"}
            {selectedRegion === "Kyoto" &&
              "전통의 도시, 금각사와 기온 거리가 아름다운 교토!"}
            {!["Tokyo", "Osaka", "Kyoto"].includes(selectedRegion) &&
              "탭하여 다른 지역도 탐색해 보세요!"}
          </Text>

          {/* ✅ 여행 시작하기 버튼 */}
          <Button
            label="여행 시작하기 ✈️"
            style={styles.startButton}
            onPress={() =>
              navigation.navigate("일정", {
                screen: "AddTripScreen",
                params: { region: selectedRegion },
              })
            }
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 600,
    backgroundColor: "#e9f2ff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },
  frame: {
    position: "absolute",
    overflow: "hidden",
    borderRadius: 20,
    backgroundColor: "white",
  },
  resetButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: "#dfe7ff",
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  resetText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4e5cff",
  },
  infoBox: {
    marginTop: 20,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    width: 280,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  regionName: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  description: {
    textAlign: "center",
    fontSize: 14,
    color: "#555",
  },
  startButton: {
    marginTop: 12,
  },
});
