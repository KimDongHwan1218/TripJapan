import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { WebView } from "react-native-webview";
import {
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import type { DatePlan } from "../SchedulingScreen";

type Props = {
  selectedDate: string;
  viewMode: "calendar" | "map";
  setViewMode: (mode: "calendar" | "map") => void;
  onDateSelect: (dateString: string) => void;
  dateList: DatePlan[];
  flatListRef: any;
  highlightRange?: { start: string; end: string }; 
};

export default function ScheduleMapCalendar({
  selectedDate,
  viewMode,
  setViewMode,
  onDateSelect,
  dateList,
  flatListRef,
  highlightRange
}: Props) {
  const topHeight = useSharedValue(150);
  const MIN_HEIGHT = 150;
  const MAX_HEIGHT = 500;
  const gestureContext = useRef<{ startHeight: number }>({ startHeight: 150 });

  const panGesture = Gesture.Pan()
    .onStart(() => {
      gestureContext.current.startHeight = topHeight.value;
    })
    .onUpdate((event) => {
      let newHeight = gestureContext.current.startHeight + event.translationY;
      if (newHeight < MIN_HEIGHT) newHeight = MIN_HEIGHT;
      if (newHeight > MAX_HEIGHT) newHeight = MAX_HEIGHT;
      topHeight.value = newHeight;
    })
    .onEnd(() => {
      if (topHeight.value > (MIN_HEIGHT + MAX_HEIGHT) / 2) {
        topHeight.value = withTiming(MAX_HEIGHT, { duration: 200 });
      } else {
        topHeight.value = withTiming(MIN_HEIGHT, { duration: 200 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    height: topHeight.value,
  }));

  const onDatePress = (day: { dateString: string }) => {
    onDateSelect(day.dateString);
    const index = dateList.findIndex((d) => d.key === day.dateString);
    if (index !== -1) {
      flatListRef.current?.scrollToIndex({ index, animated: true });
    }
  };

  const getMarkedDates = () => {
    let marks: any = {};
    if (highlightRange) {
      const { start, end } = highlightRange;
      const startDate = new Date(start);
      const endDate = new Date(end);

      // 범위 내 날짜 전부 색칠
      for (
        let d = new Date(startDate);
        d <= endDate;
        d.setDate(d.getDate() + 1)
      ) {
        const key = d.toISOString().split("T")[0];
        marks[key] = {
          color: "#CDE7FF",
          textColor: "#000",
        };
      }

      // 시작/끝 포인트 강조
      marks[start] = {
        startingDay: true,
        color: "#80C3FF",
        textColor: "#fff",
      };
      marks[end] = {
        endingDay: true,
        color: "#80C3FF",
        textColor: "#fff",
      };
    }

    // ✅ 선택된 날짜 강조
    if (selectedDate) {
      marks[selectedDate] = {
        ...(marks[selectedDate] || {}),
        selected: true,
        selectedColor: "#007AFF",
      };
    }

    return marks;
  };

  return (
    <Animated.View style={[animatedStyle]}>
      {viewMode === "calendar" ? (
        <Calendar
          onDayPress={onDatePress}
          markedDates={getMarkedDates()}
          markingType="period" // ✅ 기간 표시 모드
          theme={{
            todayTextColor: "#007AFF",
            selectedDayBackgroundColor: "#007AFF",
          }}
        />
      ) : (
        <WebView
          style={{ flex: 1 }}
          source={{ uri: "https://www.google.com/maps/" }}
        />
      )}

      <GestureDetector gesture={panGesture}>
        <View style={styles.toggleContainer}>
          <View style={styles.handle} />
          <View style={styles.toggleButtons}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                viewMode === "calendar" && styles.toggleActive,
              ]}
              onPress={() => setViewMode("calendar")}
            >
              <Text
                style={[
                  styles.toggleText,
                  viewMode === "calendar" && styles.toggleTextActive,
                ]}
              >
                달력 보기
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                viewMode === "map" && styles.toggleActive,
              ]}
              onPress={() => setViewMode("map")}
            >
              <Text
                style={[
                  styles.toggleText,
                  viewMode === "map" && styles.toggleTextActive,
                ]}
              >
                지도 보기
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </GestureDetector>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toggleContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#f5f5f5",
    paddingTop: 8,
    paddingBottom: 12,
    alignItems: "center",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#bbb",
    marginBottom: 8,
  },
  toggleButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 6,
  },
  toggleActive: { backgroundColor: "#007AFF" },
  toggleText: { fontWeight: "bold", color: "#333" },
  toggleTextActive: { color: "#fff" },
});
