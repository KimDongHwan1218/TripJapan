// components/modals/AddTripModal.tsx
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useTrip } from "@/contexts/TripContext";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ScheduleStackParamList } from "@/navigation/ScheduleStackNavigator";

// Props 타입 선언
export interface AddTripModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AddTripModal({ visible, onClose }: AddTripModalProps) {
  const { createTrip, loadTripData } = useTrip();

  const navigation = useNavigation<
    NativeStackNavigationProp<ScheduleStackParamList, "SchedulingScreen">
  >();

  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(false);

  const resetFields = () => {
    setTitle("");
    setStart("");
    setEnd("");
  };

  const onSubmit = async () => {
    if (!title || !start || !end) return;

    setLoading(true);
    try {
      // 1) Trip 생성 요청 (TripContext.createTrip이 Trip 타입을 반환한다고 가정)

      const { trip , trip_days} = await createTrip({
        title,
        start_date: start,
        end_date: end,
      });

      // 2) 생성된 Trip의 상세 데이터 로드 (trip_days 포함)
      await loadTripData(trip.id);

      // 3) 모달 닫기
      onClose();

      // 4) 필드 초기화
      resetFields();

      // 5) 새 여행 일정 화면으로 이동 (ScheduleStackParamList에 맞춘 파라미터)
      navigation.navigate("SchedulingScreen", {
        id: trip.id,
        title: trip.title,
        start_date: trip.start_date,
        end_date: trip.end_date,
      });
    } catch (e) {
      console.error("여행 생성 오류:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalWrap}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>새 여행 만들기</Text>

          <TextInput
            placeholder="여행 제목"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            editable={!loading}
          />
          <TextInput
            placeholder="시작 날짜 (YYYY-MM-DD)"
            value={start}
            onChangeText={setStart}
            style={styles.input}
            editable={!loading}
          />
          <TextInput
            placeholder="끝 날짜 (YYYY-MM-DD)"
            value={end}
            onChangeText={setEnd}
            style={styles.input}
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.btn, loading && { opacity: 0.6 }]}
            onPress={onSubmit}
            disabled={loading}
          >
            <Text style={styles.btnText}>{loading ? "생성 중..." : "여행 생성"}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose} disabled={loading}>
            <Text style={styles.closeText}>닫기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalWrap: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "85%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  btn: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  btnText: { color: "white", fontWeight: "bold" },
  closeBtn: { marginTop: 12, alignItems: "center" },
  closeText: { fontSize: 16 },
});
