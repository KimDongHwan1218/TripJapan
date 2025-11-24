import React, { useRef, useState, useMemo } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useRoute, useNavigation } from "@react-navigation/native";
import { format, parseISO, isWithinInterval } from "date-fns";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import type { ScheduleStackParamList } from "../../navigation/ScheduleStackNavigator";

import ScheduleMapCalendar from "./components/ScheduleMapCalendar";
import ScheduleList from "./components/ScheduleList";
import Header from "@/components/Header/Header";

type Plan = {
  time: string;
  title: string;
  detail: string;
};

export type DatePlan = {
  key: string;
  display: string;
  plans: Plan[];
};

// ✅ 라우트 & 네비게이션 타입 정의
type SchedulingRouteProp = RouteProp<ScheduleStackParamList, "SchedulingScreen">;
type SchedulingNavigationProp = NativeStackNavigationProp<
  ScheduleStackParamList,
  "SchedulingScreen"
>;

// ✅ Mock 여행 데이터
const mockTrips = [
  {
    id: 1,
    title: "홋카이도 여행",
    startDate: "2025-11-01",
    endDate: "2025-11-04",
  },
  {
    id: 2,
    title: "도쿄 주말여행",
    startDate: "2025-12-10",
    endDate: "2025-12-13",
  },
];

const generateDates = (count = 30): DatePlan[] => {
  const today = new Date();
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i - 15);
    const key = format(date, "yyyy-MM-dd");
    return {
      key,
      display: format(date, "yyyy년 M월 d일"),
      plans: [
        { time: "10:00", title: "방문 일정", detail: "삿포로 시계탑" },
        { time: "14:00", title: "점심 식사", detail: "스프카레 맛집 방문" },
      ],
    };
  });
};

export default function SchedulingScreen() {
  const route = useRoute<SchedulingRouteProp>();
  const navigation = useNavigation<SchedulingNavigationProp>();
  const flatListRef = useRef(null);

  const [selectedDate, setSelectedDate] = useState("");
  const [viewMode, setViewMode] = useState<"calendar" | "map">("calendar");

  // ✅ 여행 정보: AddTripScreen에서 param이 왔다면 그걸 사용, 아니면 mockTrips[0]
  const activeTrip = route.params || mockTrips[0];

  const dateList: DatePlan[] = useMemo(() => generateDates(), []);

  // ✅ 여행 기간 계산
  const tripRange = useMemo(() => {
    if (!activeTrip.startDate || !activeTrip.endDate) return null;
    return {
      start: parseISO(activeTrip.startDate),
      end: parseISO(activeTrip.endDate),
    };
  }, [activeTrip]);

  // ✅ 해당 날짜가 여행 기간 내에 있는지 확인
  const isDateInTripRange = (dateString: string) => {
    if (!tripRange) return false;
    const current = parseISO(dateString);
    return isWithinInterval(current, { start: tripRange.start, end: tripRange.end });
  };

  const handleDateSelect = (dateString: string) => {
    setSelectedDate(dateString);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <Header
        backwardButton="arrow"
        middleContent={activeTrip.title}
        rightButtons={[{ type: "moveTo", target: "TripHistoryScreen", label: "기록" }]}
      />

      <ScheduleMapCalendar
        selectedDate={selectedDate}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onDateSelect={handleDateSelect}
        dateList={dateList}
        flatListRef={flatListRef}
        // ✅ 여행 기간 하이라이트용 prop 추가
        highlightRange={{
          start: activeTrip.startDate,
          end: activeTrip.endDate,
        }}
      />

      <ScheduleList
        dateList={dateList}
        flatListRef={flatListRef}
        navigation={navigation}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
});
