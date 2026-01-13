import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useTrip } from "@/contexts/TripContext";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ScheduleStackParamList } from "@/navigation/ScheduleStackNavigator";
import { CITY_META, type TripCity } from "@/constants/cities";
import CitySelectModal from "./CitySelectModal";

export interface AddTripModalProps {
  visible: boolean;
  onClose: () => void;
  initialCity?: TripCity;
}

export default function AddTripModal({ visible, onClose, initialCity }: AddTripModalProps) {
  const { createTrip } = useTrip();

  const navigation = useNavigation<NativeStackNavigationProp<ScheduleStackParamList, "SchedulingScreen">>();

  const [selectedCity, setSelectedCity] = useState<TripCity | null>(initialCity ?? null);
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(false);

  const resetFields = () => {
    setSelectedCity("tokyo");
    setStart("");
    setEnd("");
  };

  const onSubmit = async () => {
    if (!selectedCity || !start || !end) return;

    setLoading(true);
    try {
      const trip = await createTrip({
        city: selectedCity,
        start_date: start,
        end_date: end,
      });

      onClose();
      resetFields();

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

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalWrap}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>새 여행 만들기</Text>

          <TouchableOpacity
            style={styles.citySelectBox}
            onPress={() => setCityModalVisible(true)}
            activeOpacity={0.8}
          >
            {selectedCity ? (
              <>
                <Image
                  source={CITY_META[selectedCity].image}
                  style={styles.cityThumb}
                />
                <View>
                  <Text style={styles.cityNameKo}>
                    {CITY_META[selectedCity].label.ko}
                  </Text>
                  <Text style={styles.cityNameEn}>
                    {CITY_META[selectedCity].label.en}
                  </Text>
                </View>
              </>
            ) : (
              <Text style={styles.cityPlaceholder}>
                여행지를 선택해주세요
              </Text>
            )}
          </TouchableOpacity>
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
      <CitySelectModal
        visible={cityModalVisible}
        onClose={() => setCityModalVisible(false)}
        onSelect={(city) => {
          setSelectedCity(city);
          setCityModalVisible(false);
        }}
      />
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
  title: { 
    fontSize: 20, 
    fontWeight: "bold", 
    marginBottom: 20 },
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
  btnText: { 
    color: "white", 
    fontWeight: "bold" },
  closeBtn: { 
    marginTop: 12, 
    alignItems: "center" },
  closeText: { 
    fontSize: 16 
  },
  citySelectBox:{
    flexDirection: "row",
  },
  cityNameKo:{
    fontSize: 16,
  },
  cityNameEn:{
    fontSize: 12,
  },
  cityThumb:{
    width: 40,
    height: 40,
  },
  cityPlaceholder:{

    fontSize: 16,
    color: "#888",
  },
  
});
