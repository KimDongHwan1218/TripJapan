import React, { useEffect, useState } from "react";
import { Modal, View, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import Text, { TextInput } from "@/components/ui/Text";
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
import { useToast } from "@/contexts/ToastContext";
import DesignVariantPicker from "@/components/DesignVariantPicker";
import { CityStepB, CityStepC, DateStepB, DateStepC, tripLengthLabel } from "./AddTripSteps.variants";

export interface AddTripModalProps {
  visible: boolean;
  onClose: () => void;
  initialCity?: TripCity;
  // 디자인 시안(0 현재 / 1 사진 카드 + 빠른 기간 / 2 지역별 목록 + 안내형 달력) — TripHistoryScreen이 등록·전달
  variant?: number;
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
      marks[d] = { color: colors.primarySoft, textColor: colors.textPrimary };
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

export default function AddTripModal({ visible, onClose, initialCity, variant = 0 }: AddTripModalProps) {
  const { createTrip } = useTrip();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigation = useNavigation<NativeStackNavigationProp<ScheduleStackParamList, "SchedulingScreen">>();
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedCity, setSelectedCity] = useState<TripCity | null>(initialCity ?? null);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(false);

  // initialCity는 모달이 이미 마운트된 뒤에 바뀔 수 있어(같은 화면에 다른 도시로 다시 진입) 열릴 때마다 반영
  useEffect(() => {
    if (visible && initialCity) setSelectedCity(initialCity);
  }, [visible, initialCity]);

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
    } catch (e: any) {
      console.error("여행 생성 오류:", e);
      const message =
        e?.message || e?.response?.data?.message || "여행 생성에 실패했어요. 잠시 후 다시 시도해주세요.";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  // 달력 날짜 고르기(시작 → 끝, 끝이 시작보다 앞이면 시작을 다시 고름) — A와 시안이 같이 씀
  const handleDayPress = (d: string) => {
    if (!start || (start && end)) {
      setStart(d);
      setEnd("");
    } else if (d < start) {
      setStart(d);
    } else {
      setEnd(d);
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
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={[styles.container, { paddingTop: insets.top }]}>
          {/* Back arrow */}
          <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>

          {/* Step 1: 도시 선택 */}
          {step === 1 && variant > 0 && (
            <>
              {variant === 1 ? (
                <CityStepB selected={selectedCity} onSelect={setSelectedCity} title="어디로 떠나세요?" />
              ) : (
                <CityStepC selected={selectedCity} onSelect={setSelectedCity} title="어디로 떠나세요?" />
              )}
              <View style={[styles.bottomArea, { paddingBottom: insets.bottom + 16 }]}>
                <TouchableOpacity
                  style={[styles.primaryBtn, !selectedCity && styles.primaryBtnDisabled]}
                  onPress={handleNext}
                  disabled={!selectedCity}
                  activeOpacity={0.7}
                >
                  <Text style={styles.primaryBtnText}>{selectedCity ? `${cityWithParticle(cityKo)} 날짜 고르기` : "도시를 골라주세요"}</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          {step === 1 && variant === 0 && (
            <>
              <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.title}>
                  {/* 예전엔 "닉네임님으로 여행을 떠나시나요?"가 돼 어색했음 → 호칭과 질문을 분리 */}
                  {nickname ? `${nickname}님,\n` : ""}어디로 여행을 떠나시나요?
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
                  activeOpacity={0.7}
                >
                  <Text style={styles.primaryBtnText}>다음</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {step === 2 && variant > 0 && (
            <>
              <View style={{ flex: 1 }}>
                {(() => {
                  const DateStep = variant === 1 ? DateStepB : DateStepC;
                  return (
                    <DateStep
                      cityKo={cityKo}
                      start={start}
                      end={end}
                      marks={buildPeriodMarks(start, end)}
                      minDate={TODAY}
                      onDayPress={handleDayPress}
                      onSetRange={(s, e) => {
                        setStart(s);
                        setEnd(e);
                      }}
                    />
                  );
                })()}
              </View>
              <View style={[styles.bottomArea, { paddingBottom: insets.bottom + 16 }]}>
                <TouchableOpacity
                  style={[styles.primaryBtn, (!start || !end || loading) && styles.primaryBtnDisabled]}
                  onPress={handleSubmit}
                  disabled={!start || !end || loading}
                  activeOpacity={0.7}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color={colors.textWhite} />
                  ) : (
                    <Text style={styles.primaryBtnText}>
                      {start && end ? `${cityKo} ${tripLengthLabel(start, end)} 여행 만들기` : "날짜를 골라주세요"}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Step 2: 날짜 선택 */}
          {step === 2 && variant === 0 && (
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
                monthFormat="yyyy년 M월" // 달력 한국어 전역 설정 후 기본 표기가 "10월 2026"이라
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
                  activeOpacity={0.7}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color={colors.textWhite} />
                  ) : (
                    <Text style={styles.primaryBtnText}>완료</Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
      {/* 모달은 앱 위를 덮어서 전역 시안 버튼이 안 보임 → 모달 안에도 띄움(개발 빌드 전용) */}
      <DesignVariantPicker />
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
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 28,
    marginBottom: 32,
  },

  // City chips
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.lg, borderCurve: "continuous",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: {
    backgroundColor: colors.surface, borderWidth: 1,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.primaryHover,
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
    fontSize: 16,
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
    borderTopColor: colors.divider,
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
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryBtnDisabled: {
    opacity: 0.5,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textWhite,
  },
});
