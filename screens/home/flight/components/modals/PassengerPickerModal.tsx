import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function PassengerPickerModal({
  visible,
  adults,
  onConfirm,
  onClose
}) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>인원 선택</Text>

          {[1, 2, 3, 4, 5].map(n => (
            <TouchableOpacity
              key={n}
              style={[styles.option, adults === n && styles.active]}
              onPress={() => onConfirm(n)}
            >
              <Text style={styles.optionText}>성인 {n}명</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity onPress={onClose} style={styles.close}>
            <Text style={styles.closeText}>닫기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end"
  },
  sheet: {
    backgroundColor: "#FFF",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12
  },
  option: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#EEE"
  },
  active: {
    backgroundColor: "#F1F5FF"
  },
  optionText: {
    fontSize: 16
  },
  close: {
    marginTop: 16,
    alignItems: "center"
  },
  closeText: {
    color: "#666"
  }
});
