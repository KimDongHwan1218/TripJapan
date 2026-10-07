import React, { useEffect, useState } from "react";
import { Modal, View, TouchableOpacity, FlatList, Image, StyleSheet, Dimensions, Alert } from "react-native";
import Text, { TextInput } from "@/components/ui/Text";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius } from "@/styles";
import { useTrip } from "@/contexts/TripContext";
import TimeWheelPicker from "./TimeWheelPicker";
import { useModal } from "@/hooks/useModal";
import { useUI } from "@/contexts/UIContext";
import { usePlaceSearch, type Place } from "../hooks/usePlaceSearch";

const { height } = Dimensions.get("window");

export default function ScheduleDetailModal() {
  const { activeTrip } = useTrip();
  const { scheduleModal } = useUI();
  const { close, visible, payload } = scheduleModal
  const isEditMode = !!payload?.schedule;
  const { addSchedule, updateSchedule, deleteSchedule } = useTrip();

  const [time, setTime] = useState("09:00");
  const [activity, setActivity] = useState("");
  const [notes, setNotes] = useState("");

  // 장소 검색 관련
  const [query, setQuery] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const { results, search: searchPlaces, clear: clearResults } = usePlaceSearch();

  // validation
  const [touched, setTouched] = useState({
    time: false,
    activity: false,
  });

  useEffect(() => {
    if (payload) {
      setTime(payload.schedule?.time ?? "09:00");
      setActivity(payload.schedule?.activity ?? "");
      setNotes(payload.schedule?.notes ?? "");

      setQuery(payload.schedule?.place_name ?? "");
      setSelectedPlace(
        payload.schedule?.place_id
          ? {
              id: payload.schedule.place_id,
              name: payload.schedule?.place_name!,
              latitude: payload.schedule?.latitude!,
              longitude: payload.schedule?.longitude!,
              address: "",
              thumbnail_url: "",
            }
          : null
      );
    } else {
      setTime("09:00");
      setActivity("");
      setNotes("");
      setQuery("");
      setSelectedPlace(null);
    }

    setTouched({ time: false, activity: false });
    clearResults();
  }, [payload, visible]);

  // 장소 검색
  const handleSearchPlaces = (text: string) => {
    setQuery(text);
    searchPlaces(text);
  };

  const activityError =
    touched.activity && !activity.trim()
      ? "할 일은 필수입니다"
      : null;

  const hasError = !!activityError;

  const handleSave = async () => {
    setTouched({ time: true, activity: true });
    if (hasError || !payload) return;

    const formPayload = {
      time,
      activity,
      notes,
      place_name: selectedPlace?.name ?? query,
      latitude: selectedPlace?.latitude ?? null,
      longitude: selectedPlace?.longitude ?? null,
      place_id: typeof selectedPlace?.id === "number" ? selectedPlace.id : null,
    };

    if (isEditMode) {
      await updateSchedule(payload.schedule!.id, formPayload);
    } else {
      await addSchedule(payload.tripdayid!, formPayload);
    }

    close();
  };


  const handleDelete = () => {
    if (!payload?.schedule) return;

    Alert.alert(
      "일정 삭제",
      "이 일정은 복구할 수 없습니다.\n정말 삭제할까요?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            await deleteSchedule(payload.schedule!.id);
            close();
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <Text style={styles.title}>
            {isEditMode ? "일정 수정" : "일정 추가"}
          </Text>

          {/* 시간 */}
          <TimeWheelPicker
            value={time}
            onChange={(v) => {
              setTime(v);
              setTouched((t) => ({ ...t, time: true }));
            }}
          />

          {/* 할 일 */}
          <TextInput
            placeholder="할 일"
            value={activity}
            onChangeText={setActivity}
            onBlur={() =>
              setTouched((t) => ({ ...t, activity: true }))
            }
            style={[
              styles.input,
              activityError && styles.inputError,
            ]}
          />
          {activityError && (
            <Text style={styles.errorText}>{activityError}</Text>
          )}

          {/* 장소 검색 */}
          <View style={{ zIndex: 100 }}>
            <TextInput
              placeholder="장소 검색 (선택)"
              value={query}
              onChangeText={handleSearchPlaces}
              style={styles.input}
            />

            {results.length > 0 && (
              <View style={styles.autocomplete}>
                <FlatList
                  keyboardShouldPersistTaps="handled"
                  data={results}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.placeItem}
                      onPress={() => {
                        setSelectedPlace(item);
                        setQuery(item.name);
                        clearResults();
                      }}
                    >
                      <Image
                        source={{ uri: item.thumbnail_url ?? undefined }}
                        style={styles.thumb}
                      />
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                          <Text style={styles.placeName}>
                            {item.name}
                          </Text>
                          {item.avg_rating != null && (
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
                              <Ionicons name="star" size={16} color={colors.warning} />
                              <Text style={styles.address}>{item.avg_rating.toFixed(1)}</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.address}>
                          {item.address}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </View>

          {/* 메모 */}
          <TextInput
            placeholder="메모 (선택)"
            value={notes}
            onChangeText={setNotes}
            style={[styles.input, { height: 70 }]}
            multiline
          />

          {/* footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={close}
            >
              <Text style={styles.cancelText}>취소</Text>
            </TouchableOpacity>

            {isEditMode && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
              >
                <Text style={styles.deleteText}>삭제</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.saveButton,
                hasError && styles.saveButtonDisabled,
              ]}
              disabled={hasError}
              onPress={handleSave}
            >
              <Text style={styles.saveText}>저장</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center", // 중앙 모달
    alignItems: "center",
  },

  modalCard: {
    width: "90%",
    maxHeight: height * 0.8,
    backgroundColor: colors.surface,
    borderRadius: radius.md, borderCurve: "continuous",
    padding: 20,
  },

  title: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm, borderCurve: "continuous",
    padding: 12,
    fontSize: 14,
    marginBottom: 12,
    backgroundColor: colors.surface,
  },

  inputError: {
    borderColor: colors.primary,
  },

  errorText: {
    fontSize: 12,
    color: colors.primary,
    marginBottom: 8,
    marginLeft: 4,
  },

  /* autocomplete */
  autocomplete: {
    position: "absolute",
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm, borderCurve: "continuous",
    zIndex: 999,
    elevation: 10, // Android
  },

  placeItem: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    alignItems: "center",
  },

  thumb: {
    width: 48,
    height: 48,
    borderRadius: radius.sm, borderCurve: "continuous",
    marginRight: 12,
    backgroundColor: colors.neutral100,
  },

  placeName: {
    fontWeight: "600",
    fontSize: 14,
  },

  address: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },

  /* footer */
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 16,
  },

  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.sm, borderCurve: "continuous",
    backgroundColor: colors.neutral100,
    alignItems: "center",
  },

  cancelText: {
    color: colors.textSecondary,
    fontWeight: "500",
  },

  deleteButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.sm, borderCurve: "continuous",
    backgroundColor: "#ffecec",
    alignItems: "center",
  },

  deleteText: {
    color: colors.primary,
    fontWeight: "600",
  },

  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.sm, borderCurve: "continuous",
    backgroundColor: colors.neutral900,
    alignItems: "center",
  },

  saveButtonDisabled: {
    backgroundColor: colors.neutral500,
  },

  saveText: {
    color: colors.textWhite,
    fontWeight: "600",
  },
});
