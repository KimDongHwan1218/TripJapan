import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header/Header";
import styles from "./SchedulingScreen.styles";
import type { Trip, TripDay, Schedule } from "@/contexts/TripContext";
import ScheduleCard from "./components/ScheduleCard";
import ScheduleMap from "./components/ScheduleMap";
import ScheduleDetailModal from "./components/ScheduleDetailModal";
import { colors } from "@/styles/colors";
import { spacing } from "@/styles/spacing";

type DaySchedule = {
  day: TripDay;
  schedules: Schedule[];
};

type Props = {
  activeTrip: Trip | null;
  schedulesByDay: DaySchedule[];
  currentDayIndex: number;
  onPrevDay: () => void;
  onNextDay: () => void;

  mapRef: React.RefObject<any>;
  mapSchedules: Schedule[];
  onSelectSchedule: (s: Schedule) => void;
  onEditSchedule: (s: Schedule) => void;
  onCreateSchedule: () => void;
  onEditDay: () => void;
};

export default function SchedulingScreenView({
  activeTrip,
  schedulesByDay,
  currentDayIndex,
  onPrevDay,
  onNextDay,
  mapRef,
  mapSchedules,
  onSelectSchedule,
  onEditSchedule,
  onCreateSchedule,
  onEditDay,
}: Props) {
  if (!activeTrip) {
    return (
      <View style={styles.center}>
        <Text>여행을 선택해주세요</Text>
      </View>
    );
  }

  const currentDay = schedulesByDay[currentDayIndex];
  const isFirst = currentDayIndex === 0;
  const isLast = currentDayIndex === schedulesByDay.length - 1;

  return (
    <View style={styles.container}>
      <Header title={`${activeTrip.city} 여행`} />

      {/* 날짜 이동 */}
      <View style={localStyles.dayNav}>
        <TouchableOpacity onPress={onPrevDay} disabled={isFirst} style={localStyles.navBtn}>
          <Ionicons name="chevron-back" size={20} color={isFirst ? colors.border : colors.textPrimary} />
        </TouchableOpacity>

        <Text style={localStyles.dayText}>
          {currentDay?.day.date ?? "—"}
          {"  "}
          <Text style={localStyles.dayCount}>
            Day {currentDayIndex + 1} / {schedulesByDay.length}
          </Text>
        </Text>

        <TouchableOpacity onPress={onNextDay} disabled={isLast} style={localStyles.navBtn}>
          <Ionicons name="chevron-forward" size={20} color={isLast ? colors.border : colors.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity onPress={onEditDay} style={localStyles.editDayBtn}>
          <Ionicons name="create-outline" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* 지도 */}
      <ScheduleMap ref={mapRef} schedules={mapSchedules} />

      {/* 일정 목록 */}
      <ScrollView contentContainerStyle={localStyles.list}>
        {currentDay?.schedules.length === 0 && (
          <Text style={localStyles.empty}>일정이 없습니다</Text>
        )}

        {currentDay?.schedules.map((schedule) => (
          <TouchableOpacity
            key={schedule.id}
            onPress={() => onSelectSchedule(schedule)}
          >
            <ScheduleCard item={schedule} onEdit={onEditSchedule} />
          </TouchableOpacity>
        ))}

        {/* 일정 추가 버튼 */}
        <TouchableOpacity style={localStyles.addButton} onPress={onCreateSchedule}>
          <Ionicons name="add" size={18} color={colors.strongbutton} />
          <Text style={localStyles.addButtonText}>일정 추가</Text>
        </TouchableOpacity>
      </ScrollView>

      <ScheduleDetailModal />
    </View>
  );
}

const localStyles = StyleSheet.create({
  dayNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  navBtn: {
    padding: spacing.xs,
  },
  dayText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  dayCount: {
    fontSize: 13,
    fontWeight: "400",
    color: colors.textSecondary,
  },
  list: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  empty: {
    textAlign: "center",
    color: colors.textSecondary,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.strongbutton,
    borderStyle: "dashed",
    marginTop: spacing.sm,
  },
  addButtonText: {
    fontSize: 14,
    color: colors.strongbutton,
    fontWeight: "500",
  },
  editDayBtn: {
    padding: spacing.xs,
    marginLeft: spacing.xs,
  },
});
