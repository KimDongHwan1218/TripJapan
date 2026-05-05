import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTrip } from "@/contexts/TripContext";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ScheduleStackParamList } from "@/navigation/ScheduleStackNavigator";
import { CITY_META, type TripCity } from "@/constants/cities";
import { colors, spacing, radius } from "@/styles";
import { useAuth } from "@/contexts/AuthContext";

export interface AddTripModalProps {
  visible: boolean;
  onClose: () => void;
  initialCity?: TripCity;
}

const CITY_LIST = Object.values(CITY_META);

// 도시명 → 목적격 조사 (ko)
function cityWithParticle(ko: string): string {
  const lastChar = ko.charCodeAt(ko.length - 1);
  const hasReceivingConsonant = (lastChar - 0xac00) % 28 !== 0;
  return ko + (hasReceivingConsonant ? "으로" : "로");
}

const TODAY = new Date().toISOString().split("T")[0];

function buildPeriodMarks(start: string, end: string) {
  if (!start) return {};
  if (!end) {
    return {
      [start]: { startingDay: true, endingDay: true, color: colors.primary, textColor: "#fff" },
    };
  }
  const marks: Record<string, any> = {};
  let cur = new Date(start);
  const endDate = new Date(end);
  while (cur <= endDate) {
    const d = cur.toISOString().split("T")[0];
    const isStart = d === start;
    const isEnd = d === end;
    if (isStart && isEnd) {
      marks[d] = { startingDay: true, endingDay: true, color: colors.primary, textColor: "#fff" };
    } else if (isStart) {
      marks[d] = { startingDay: true, color: colors.primary, textColor: "#fff" };
    } else if (isEnd) {
      marks[d] = { endingDay: true, color: colors.primary, textColor: "#fff" };
    } else {
      marks[d] = { color: "#FFE5E3", textColor: colors.textPrimary };
    }
    cur.setDate(cur.getDate() + 1);
  }
  return marks;
}

// 두 날짜 사이 박수/일수 계산
function calcNights(start: string, end: string): string {
  try {
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
    if (diff <= 0) return "";
    return `${diff}박${diff + 1}일`;
  } catch {
    return "";
  }
}

export default function AddTripModal({ visible, onClose, initialCity }: AddTripModalProps) {
  const { createTrip } = useTrip();
  const { user } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<ScheduleStackParamList, "SchedulingScreen">>();
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedCity, setSelectedCity] = useState<TripCity | null>(initialCity ?? null);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(false);

  const resetAndClose = () => {
    setStep(1);
    setSelectedCity(null);
    setStart("");
    setEnd("");
    onClose();
  };

  const handleNext = () => {
    if (!selectedCity) return;
    setStep(2);
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      resetAndClose();
    }
  };

  const handleSubmit = async () => {
    if (!selectedCity || !start || !end) return;
    setLoading(true);
    try {
      const trip = await createTrip({
        city: selectedCity,
        start_date: start,
        end_date: end,
      });
      resetAndClose();
      navigation.navigate("SchedulingScreen", {
        id: trip.id,
        title: trip.city,
        start_date: trip.start_date,
        end_date: trip.end_date,
      });
    } catch (e) {
      console.error("여행 생성 오류:", e);
    } finally {
      setLoading(false);
    }
  };

  const cityKo = selectedCity ? CITY_META[selectedCity].label.ko : "";
  const nightsSummary = start && end ? calcNights(start, end) : "";
  const nickname = user?.nickname ?? user?.name ?? "";

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleBack}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={[styles.container, { paddingTop: insets.top }]}>
          {/* Back arrow */}
          <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>

          {/* Step 1: 도시 선택 */}
          {step === 1 && (
            <>
              <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.title}>
                  {nickname ? `${nickname}님` : "어디"}으로{"\n"}여행을 떠나시나요?
                </Text>

                {/* 도시 칩 */}
                <View style={styles.chipWrap}>
                  {CITY_LIST.map((city) => (
                    <TouchableOpacity
                      key={city.key}
                      style={[
                        styles.chip,
                        selectedCity === city.key && styles.chipActive,
                      ]}
                      onPress={() => setSelectedCity(city.key)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          selectedCity === city.key && styles.chipTextActive,
                        ]}
                      >
                        {city.label.ko}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              <View style={[styles.bottomArea, { paddingBottom: insets.bottom + 16 }]}>
                <TouchableOpacity
                  style={[styles.primaryBtn, !selectedCity && styles.primaryBtnDisabled]}
                  onPress={handleNext}
                  disabled={!selectedCity}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryBtnText}>다음</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Step 2: 날짜 선택 */}
          {step === 2 && (
            <>
              <View style={styles.content}>
                <Text style={styles.title}>
                  {cityWithParticle(cityKo)} 가시는군요!{"\n"}여행 날짜를 선택해주세요.
                </Text>

                {/* 날짜 요약 행 */}
                <View style={styles.dateRangeRow}>
                  <View style={styles.dateBox}>
                    <Text style={styles.dateLabelSmall}>출발</Text>
                    <Text style={[styles.dateValue, !start && styles.datePlaceholder]}>
                      {start || "선택"}
                    </Text>
                  </View>
                  <Ionicons name="arrow-forward" size={16} color={colors.neutral300} />
                  <View style={styles.dateBox}>
                    <Text style={styles.dateLabelSmall}>귀국</Text>
                    <Text style={[styles.dateValue, !end && styles.datePlaceholder]}>
                      {end || "선택"}
                    </Text>
                  </View>
                </View>
              </View>

              {/* 달력 */}
              <Calendar
                markingType="period"
                markedDates={buildPeriodMarks(start, end)}
                onDayPress={(day: { dateString: string }) => {
                  const d = day.dateString;
                  if (!start || (start && end)) {
                    setStart(d);
                    setEnd("");
                  } else if (d < start) {
                    setStart(d);
                  } else {
                    setEnd(d);
                  }
                }}
                minDate={TODAY}
                theme={{
                  arrowColor: colors.primary,
                  todayTextColor: colors.primary,
                  textDayFontWeight: "500",
                  textMonthFontWeight: "700",
                }}
              />

              <View style={[styles.bottomArea, { paddingBottom: insets.bottom + 16 }]}>
                {nightsSummary ? (
                  <Text style={styles.tripSummary}>
                    {cityKo} | {nightsSummary}
                  </Text>
                ) : null}
                <TouchableOpacity
                  style={[
                    styles.primaryBtn,
                    (!start || !end || loading) && styles.primaryBtnDisabled,
                  ]}
                  onPress={handleSubmit}
                  disabled={!start || !end || loading}
                  activeOpacity={0.85}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.primaryBtnText}>완료</Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  backBtn: {
    padding: spacing.md,
    paddingBottom: 8,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: 12,
    paddingBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 32,
    marginBottom: 32,
  },

  // City chips
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#fff",
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: "#fff",
    fontWeight: "600",
  },

  // Date range row
  dateRangeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    backgroundColor: colors.neutral100,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: 4,
  },
  dateBox: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  dateLabelSmall: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textTertiary,
    textTransform: "uppercase",
  },
  dateValue: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  datePlaceholder: {
    color: colors.neutral300,
    fontWeight: "500",
  },

  // Bottom area
  bottomArea: {
    paddingHorizontal: spacing.lg,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    gap: 8,
  },
  tripSummary: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
    paddingBottom: 4,
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: 15,
    alignItems: "center",
  },
  primaryBtnDisabled: {
    opacity: 0.5,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
});
