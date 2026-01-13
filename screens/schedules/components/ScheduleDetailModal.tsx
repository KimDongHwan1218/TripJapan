import React, { useEffect, useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet, Dimensions, Alert } from "react-native";
import axios from "axios";
import { useTrip } from "@/contexts/TripContext";
import TimeWheelPicker from "./TimeWheelPicker";
import type { Schedule } from "@/contexts/TripContext";
import { ENV } from "@/config/env";

const API_BASE = ENV.API_BASE_URL;
const { height } = Dimensions.get("window");

type Place = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  thumbnail_url: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  plan: Schedule | null;
  tripDayId: number;
  onPlaceSelected?: (place: {
    latitude: number;
    longitude: number;
  }) => void;
};

export default function ScheduleDetailModal({
  visible,
  onClose,
  plan,
  tripDayId,
  onPlaceSelected,
}: Props) {
  const isEditMode = !!plan;
  const { addSchedule, updateSchedule, deleteSchedule } = useTrip();

  const [time, setTime] = useState("09:00");
  const [activity, setActivity] = useState("");
  const [notes, setNotes] = useState("");

  // 장소 검색 관련
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  // validation
  const [touched, setTouched] = useState({
    time: false,
    activity: false,
  });

  useEffect(() => {
    if (plan) {
      setTime(plan.time ?? "09:00");
      setActivity(plan.activity ?? "");
      setNotes(plan.notes ?? "");

      setQuery(plan.place_name ?? "");
      setSelectedPlace(
        plan.place_id
          ? {
              id: Number(plan.place_id),
              name: plan.place_name!,
              latitude: plan.latitude!,
              longitude: plan.longitude!,
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
    setResults([]);
  }, [plan, visible]);

  // 장소 검색
  const searchPlaces = async (text: string) => {
    setQuery(text);

    if (text.length < 2) {
      setResults([]);
      return;
    }

    const res = await axios.get(`${API_BASE}/places/search`, {
      params: { q: text },
    });

    setResults(res.data.slice(0, 3));
  };

  const activityError =
    touched.activity && !activity.trim()
      ? "할 일은 필수입니다"
      : null;

  const hasError = !!activityError;

  const handleSave = async () => {
    setTouched({ time: true, activity: true });
    if (hasError) return;

    const payload = {
      time,
      activity,
      notes,
      place_name: selectedPlace?.name ?? query,
      latitude: selectedPlace?.latitude,
      longitude: selectedPlace?.longitude,
      place_id: selectedPlace?.id?.toString(),
    };

    if (isEditMode) {
      await updateSchedule(plan!.id, payload);
    } else {
      await addSchedule(tripDayId, payload);
    }

    if (selectedPlace) {
      onPlaceSelected?.({
        latitude: selectedPlace.latitude,
        longitude: selectedPlace.longitude,
      });
    }

    onClose();
  };

  const handleDelete = () => {
    if (!plan) return;

    Alert.alert(
      "일정 삭제",
      "이 일정은 복구할 수 없습니다.\n정말 삭제할까요?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            await deleteSchedule(plan.id);
            onClose();
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
              onChangeText={searchPlaces}
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
                        setResults([]);
                      }}
                    >
                      <Image
                        source={{ uri: item.thumbnail_url }}
                        style={styles.thumb}
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.placeName}>
                          {item.name}
                        </Text>
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
              onPress={onClose}
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
    backgroundColor: "#fff",
    borderRadius: 16,
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
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginBottom: 10,
    backgroundColor: "#fff",
  },

  inputError: {
    borderColor: "#FF3B30",
  },

  errorText: {
    fontSize: 12,
    color: "#FF3B30",
    marginBottom: 6,
    marginLeft: 4,
  },

  /* autocomplete */
  autocomplete: {
    position: "absolute",
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    zIndex: 999,
    elevation: 10, // Android
  },

  placeItem: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },

  thumb: {
    width: 48,
    height: 48,
    borderRadius: 6,
    marginRight: 10,
    backgroundColor: "#eee",
  },

  placeName: {
    fontWeight: "600",
    fontSize: 14,
  },

  address: {
    fontSize: 12,
    color: "#666",
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
    borderRadius: 8,
    backgroundColor: "#eee",
    alignItems: "center",
  },

  cancelText: {
    color: "#555",
    fontWeight: "500",
  },

  deleteButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#ffecec",
    alignItems: "center",
  },

  deleteText: {
    color: "#d32f2f",
    fontWeight: "600",
  },

  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#222",
    alignItems: "center",
  },

  saveButtonDisabled: {
    backgroundColor: "#aaa",
  },

  saveText: {
    color: "#fff",
    fontWeight: "600",
  },
});
