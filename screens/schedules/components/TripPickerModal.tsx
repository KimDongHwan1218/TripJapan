// screens/scheduling/components/TripPickerModal.tsx
import React from "react";
import { View, Text, Modal, StyleSheet, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Trip } from "@/contexts/TripContext";

export default function TripPickerModal({
  visible,
  onClose,
  trips,
  selectedId,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  trips: Trip[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}) {
  const [tempId, setTempId] = React.useState(selectedId || undefined);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>여행 선택</Text>

          <Picker
            selectedValue={tempId}
            onValueChange={(v) => setTempId(v)}
            style={{ width: "100%" }}
          >
            {trips.map((t) => (
              <Picker.Item
                key={t.id}
                label={`${t.title} (${t.start_date}~${t.end_date})`}
                value={t.id}
              />
            ))}
          </Picker>

          <View style={styles.row}>
            <TouchableOpacity onPress={onClose} style={styles.btn}>
              <Text>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                if (tempId) onSelect(tempId);
                onClose();
              }}
            >
              <Text style={{ fontWeight: "bold" }}>확인</Text>
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
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  btn: {
    marginHorizontal: 10,
    padding: 10,
  },
});
