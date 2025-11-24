import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Header from "../../components/Header/Header";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScheduleStackParamList } from "../../navigation/ScheduleStackNavigator";

// ✅ Mock Data (DB 대체)
const mockTrips = [
  {
    tripId: "001",
    title: "도쿄 여행",
    region: "Tokyo",
    startDate: "2025-03-01",
    endDate: "2025-03-04",
  },
  {
    tripId: "002",
    title: "오사카 여행",
    region: "Osaka",
    startDate: "2025-04-10",
    endDate: "2025-04-13",
  },
];

type AddTripScreenRouteProp = RouteProp<ScheduleStackParamList, "AddTripScreen">;
type AddTripScreenNavigationProp = NativeStackNavigationProp<
  ScheduleStackParamList,
  "AddTripScreen"
>;

export default function AddTripScreen() {
  const route = useRoute<AddTripScreenRouteProp>();
  const navigation = useNavigation<AddTripScreenNavigationProp>();

  const initialRegion = route.params?.region ?? "";

  const [title, setTitle] = useState("");
  const [region, setRegion] = useState(initialRegion);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState<{
    type: "start" | "end" | null;
    visible: boolean;
  }>({ type: null, visible: false });

  // 날짜 포맷
  const formatDate = (date: Date | null) =>
    date ? date.toISOString().split("T")[0] : "-";

  const handleConfirm = () => {
    if (!title || !region || !startDate || !endDate) {
      alert("모든 정보를 입력해주세요.");
      return;
    }

    const newTrip = {
      tripId: Date.now().toString(),
      title,
      region,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    };

    mockTrips.push(newTrip);
    navigation.navigate("SchedulingScreen", newTrip as never);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header middleContent="새 여행 만들기" />
      <ScrollView contentContainerStyle={styles.container}>
        {/* 여행 제목 */}
        <Text style={styles.label}>여행 제목</Text>
        <TextInput
          style={styles.input}
          placeholder="예: 홋카이도 눈 축제 여행"
          value={title}
          onChangeText={setTitle}
        />

        {/* 여행 지역 */}
        <Text style={styles.label}>여행 지역</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={region}
            onValueChange={(value) => setRegion(value)}
          >
            <Picker.Item label="지역을 선택하세요" value="" />
            <Picker.Item label="도쿄" value="Tokyo" />
            <Picker.Item label="오사카" value="Osaka" />
            <Picker.Item label="홋카이도" value="Hokkaido" />
            <Picker.Item label="후쿠오카" value="Fukuoka" />
          </Picker>
        </View>

        {/* 여행 기간 */}
        <Text style={styles.label}>여행 기간</Text>
        <View style={styles.dateContainer}>
          {/* 시작일 */}
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => {
              if (Platform.OS === "web") return; // 웹은 따로 input 표시
              setShowPicker({ type: "start", visible: true });
            }}
          >
            {Platform.OS === "web" ? (
              <input
                type="date"
                value={startDate ? formatDate(startDate) : ""}
                onChange={(e) => setStartDate(new Date(e.target.value))}
                style={styles.webDateInput}
              />
            ) : (
              <Text style={styles.dateText}>
                {startDate ? formatDate(startDate) : "시작일 선택"}
              </Text>
            )}
          </TouchableOpacity>

          <Text style={styles.tilde}>~</Text>

          {/* 종료일 */}
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => {
              if (Platform.OS === "web") return;
              setShowPicker({ type: "end", visible: true });
            }}
          >
            {Platform.OS === "web" ? (
              <input
                type="date"
                value={endDate ? formatDate(endDate) : ""}
                onChange={(e) => setEndDate(new Date(e.target.value))}
                style={styles.webDateInput}
              />
            ) : (
              <Text style={styles.dateText}>
                {endDate ? formatDate(endDate) : "종료일 선택"}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* 모바일용 DateTimePicker */}
        {showPicker.visible && Platform.OS !== "web" && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              if (event.type === "set" && selectedDate) {
                if (showPicker.type === "start") setStartDate(selectedDate);
                else if (showPicker.type === "end") setEndDate(selectedDate);
              }
              setShowPicker({ type: null, visible: false });
            }}
          />
        )}

        {/* 저장 버튼 */}
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmText}>확인</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontSize: 16, fontWeight: "600", marginTop: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 8,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  dateButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  dateText: { color: "#333" },
  webDateInput: {
    borderWidth: 0,
    fontSize: 15,
    width: "100%",
    backgroundColor: "transparent",
  },
  tilde: { marginHorizontal: 10, fontSize: 18 },
  confirmButton: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    marginTop: 40,
  },
  confirmText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
