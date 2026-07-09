import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing, radius } from "@/styles";
import type { Trip, TripDay, Schedule } from "@/contexts/TripContext";
import ScheduleMap from "./components/ScheduleMap";
import Spinner from "@/components/ui/Spinner";

type DaySchedule = {
  day: TripDay;
  schedules: Schedule[];
};

// MOCK community stories — 실제 API 연동 전 임시 데이터
const MOCK_STORIES = [
  {
    id: "1",
    author: "촤칵찰칵",
    avatarColor: "#E8B4A0",
    content: "오사카는 매번 갈때마다 새로운게 있더라고요. 이번 여행사진 공유해 봅니다.",
    date: "26.03.12",
    likes: 22,
    comments: 3,
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
  },
  {
    id: "2",
    author: "japan_story",
    avatarColor: "#A0C4E8",
    content: "여자 혼자 유후인 3박으로 다녀왔어요! 항공 숙소 포함한 경비, 일정까지 정리했어요 😊",
    date: "26.03.19",
    likes: 71,
    comments: 29,
    image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80",
  },
];

type Props = {
  activeTrip: Trip | null;
  initialLoading: boolean;
  schedulesByDay: DaySchedule[];
  currentDayIndex: number;
  onSelectDay: (idx: number) => void;

  nickname: string;
  todayDayNumber: number;

  mapRef: React.RefObject<any>;
  mapSchedules: Schedule[];

  onEditDay: (tripDayId: number, date: string) => void;
  onPressViewHistory: () => void;
  onPressNewTrip: () => void;
};

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("ko-KR", {
      month: "numeric",
      day: "numeric",
      weekday: "short",
    });
  } catch {
    return dateStr;
  }
}

export default function SchedulingScreenView({
  activeTrip,
  initialLoading,
  schedulesByDay,
  currentDayIndex,
  onSelectDay,
  nickname,
  todayDayNumber,
  mapRef,
  mapSchedules,
  onEditDay,
  onPressViewHistory,
  onPressNewTrip,
}: Props) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  // y-offsets of each day section (after map+tabs)
  const daySectionOffsets = useRef<number[]>([]);

  const handleSelectDay = (idx: number) => {
    onSelectDay(idx);
    const offset = daySectionOffsets.current[idx];
    if (offset !== undefined) {
      scrollRef.current?.scrollTo({ y: offset, animated: true });
    }
  };

  // ─── 여행 목록 최초 로딩 중 ──────────────────────────────────
  if (initialLoading && !activeTrip) {
    return <Spinner fullscreen style={{ paddingTop: insets.top }} />;
  }

  // ─── 여행 없음 상태 ──────────────────────────────────────────
  if (!activeTrip) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={styles.logo}>tabi</Text>
          <TouchableOpacity style={styles.headerBtn} onPress={onPressViewHistory}>
            <Text style={styles.headerBtnText}>지난 여행 보기</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80" }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.noTripCard}>
            <Text style={styles.noTripTitle}>
              {nickname ? `${nickname}님,\n` : ""}일본 첫 여행을 떠나볼까요?
            </Text>
            <Text style={styles.noTripSubtitle}>
              타비로 쉽고 빠르게, 스케줄을 등록해보세요!
            </Text>
            <TouchableOpacity style={styles.newTripBtn} onPress={onPressNewTrip} activeOpacity={0.85}>
              <Text style={styles.newTripBtnText}>새로운 여행 떠나기</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.storiesSection}>
            <Text style={styles.storiesTitle}>{"타비 유저들의\n진짜 여행 이야기"}</Text>
            {MOCK_STORIES.map((story) => (
              <View key={story.id} style={styles.storyCard}>
                <View style={styles.storyHeader}>
                  <View style={[styles.storyAvatar, { backgroundColor: story.avatarColor }]} />
                  <Text style={styles.storyAuthor}>{story.author}</Text>
                  <Text style={styles.storyDate}>{story.date}</Text>
                </View>
                <Image source={{ uri: story.image }} style={styles.storyImage} resizeMode="cover" />
                <Text style={styles.storyContent} numberOfLines={2}>{story.content}</Text>
                <View style={styles.storyMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="heart" size={12} color={colors.primary} />
                    <Text style={styles.metaNum}>{story.likes}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="chatbubble-ellipses" size={12} color={colors.neutral500} />
                    <Text style={styles.metaNum}>{story.comments}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
          <View style={{ height: 32 }} />
        </ScrollView>
      </View>
    );
  }

  // ─── 여행 있음 상태 ──────────────────────────────────────────
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.logo}>tabi</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={onPressViewHistory}>
          <Text style={styles.headerBtnText}>여행 수정</Text>
        </TouchableOpacity>
      </View>

      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        {/* 인사말 */}
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>
            {nickname ? `${nickname}님,\n` : ""}
            오늘 {activeTrip.city} 여행 {todayDayNumber}일차 입니다!
          </Text>
        </View>

        {/* 지도 */}
        <ScheduleMap ref={mapRef} schedules={mapSchedules} />

        {/* Day 탭 — 지도 바로 아래 */}
        <View style={styles.dayTabsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dayTabs}
          >
            {schedulesByDay.map((ds, idx) => (
              <TouchableOpacity
                key={ds.day.id}
                style={[styles.dayTab, currentDayIndex === idx && styles.dayTabActive]}
                onPress={() => handleSelectDay(idx)}
                activeOpacity={0.7}
              >
                <Text style={[styles.dayTabText, currentDayIndex === idx && styles.dayTabTextActive]}>
                  Day {idx + 1}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 모든 Day 섹션 */}
        {schedulesByDay.map((ds, idx) => (
          <View
            key={ds.day.id}
            style={styles.daySection}
            onLayout={(e) => {
              daySectionOffsets.current[idx] = e.nativeEvent.layout.y;
            }}
          >
            <Text style={styles.daySectionTitle}>
              Day {idx + 1} | {formatDate(ds.day.date)}
            </Text>

            {ds.schedules.length === 0 ? (
              <Text style={styles.emptyDay}>일정이 없습니다</Text>
            ) : (
              ds.schedules.map((s, i) => (
                <View key={s.id} style={styles.scheduleItem}>
                  <View style={styles.scheduleNum}>
                    <Text style={styles.scheduleNumText}>{i + 1}</Text>
                  </View>
                  <View style={styles.scheduleInfo}>
                    <Text style={styles.scheduleActivity}>{s.activity}</Text>
                    {s.place_name ? (
                      <Text style={styles.schedulePlace}>{s.place_name}</Text>
                    ) : null}
                  </View>
                </View>
              ))
            )}

            <TouchableOpacity
              style={styles.editDayRow}
              onPress={() => onEditDay(ds.day.id, ds.day.date)}
            >
              <Text style={styles.editDayText}>일정 편집</Text>
              <Ionicons name="chevron-forward" size={13} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>
        ))}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  logo: { fontSize: 22, fontWeight: "900", color: colors.primary, letterSpacing: -0.5 },
  headerBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  headerBtnText: { fontSize: 13, fontWeight: "600", color: colors.textPrimary },

  greeting: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 32,
  },

  // Day tabs — 지도 아래
  dayTabsContainer: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  dayTabs: {
    paddingHorizontal: spacing.md,
    gap: 8,
    paddingVertical: 12,
  },
  dayTab: {
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  dayTabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  dayTabText: { fontSize: 13, fontWeight: "600", color: colors.textSecondary },
  dayTabTextActive: { color: colors.textWhite },

  // Day section
  daySection: {
    backgroundColor: colors.surface,
    marginTop: 8,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  daySectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  scheduleItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  scheduleNum: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  scheduleNumText: { fontSize: 13, fontWeight: "700", color: colors.textWhite },
  scheduleInfo: { flex: 1 },
  scheduleActivity: { fontSize: 14, fontWeight: "600", color: colors.textPrimary },
  schedulePlace: { fontSize: 12, color: colors.textTertiary, marginTop: 2 },

  editDayRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 2,
    paddingTop: 12,
    paddingBottom: 4,
  },
  editDayText: { fontSize: 13, color: colors.textTertiary, fontWeight: "600" },
  emptyDay: {
    fontSize: 13,
    color: colors.textTertiary,
    paddingVertical: 20,
    textAlign: "center",
  },

  // ─── No-trip ────────────────────────────────────────────────
  heroImage: { width: "100%", height: 220 },
  noTripCard: { backgroundColor: colors.surface, padding: spacing.lg, gap: 8 },
  noTripTitle: {
    fontSize: 20, fontWeight: "800", color: colors.textPrimary,
    letterSpacing: -0.5, lineHeight: 30,
  },
  noTripSubtitle: { fontSize: 13, color: colors.textSecondary, marginBottom: 8 },
  newTripBtn: {
    backgroundColor: colors.primary, borderRadius: radius.lg,
    paddingVertical: 14, alignItems: "center", marginTop: 8,
  },
  newTripBtnText: { fontSize: 15, fontWeight: "700", color: colors.textWhite },

  storiesSection: {
    backgroundColor: colors.surface, marginTop: 8,
    paddingHorizontal: spacing.md, paddingTop: 24, paddingBottom: 8,
  },
  storiesTitle: {
    fontSize: 18, fontWeight: "800", color: colors.textPrimary,
    letterSpacing: -0.3, lineHeight: 26, marginBottom: 16,
  },
  storyCard: { marginBottom: 24 },
  storyHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  storyAvatar: { width: 32, height: 32, borderRadius: 16 },
  storyAuthor: { fontSize: 13, fontWeight: "700", color: colors.textPrimary, flex: 1 },
  storyDate: { fontSize: 11, color: colors.neutral300, fontWeight: "600" },
  storyImage: { width: "100%", height: 160, borderRadius: radius.md, marginBottom: 8 },
  storyContent: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },
  storyMeta: { flexDirection: "row", gap: 12, marginTop: 8 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 3 },
  metaNum: { fontSize: 12, fontWeight: "700", color: colors.neutral500 },
});
