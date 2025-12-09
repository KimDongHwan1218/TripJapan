import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { useTrip } from "@/contexts/TripContext";

const API = "https://tavi-server.onrender.com";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function AddTripModal({ visible, onClose }: Props) {
  const { loadTripData } = useTrip();

  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const handleCreateTrip = async () => {
    if (!title || !start || !end) return;

    // 1) 여행 생성
    const tripRes = await axios.post(`${API}/trips`, {
      title,
      start_date: start,
      end_date: end,
    });
    const tripId = tripRes.data.id;

    // 2) 날짜 자동 생성
    await axios.post(`${API}/trip_days/bulk`, {
      trip_id: tripId,
      start_date: start,
      end_date: end,
    });

    // 3) 전체 여행 다시 로드
    await loadTripData(tripId);

    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>새 여행 만들기</Text>

          <TextInput
            style={styles.input}
            placeholder="여행 제목"
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            style={styles.input}
            placeholder="시작 날짜 (YYYY-MM-DD)"
            value={start}
            onChangeText={setStart}
          />

          <TextInput
            style={styles.input}
            placeholder="끝 날짜 (YYYY-MM-DD)"
            value={end}
            onChangeText={setEnd}
          />

          <TouchableOpacity style={styles.button} onPress={handleCreateTrip}>
            <Text style={styles.buttonText}>생성하기</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancel} onPress={onClose}>
            <Text style={styles.cancelText}>닫기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "bold" },
  cancel: {
    marginTop: 10,
    padding: 12,
    alignItems: "center",
    backgroundColor: "#ddd",
    borderRadius: 10,
  },
  cancelText: { fontWeight: "bold" },
});
