import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function CabinPickerModal({
  visible,
  cabin,
  onSelect,
  onClose
}) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>좌석 등급</Text>

          {[
            { key: "economy", label: "일반석" },
            { key: "business", label: "비즈니스석" }
          ].map(item => (
            <TouchableOpacity
              key={item.key}
              style={[styles.option, cabin === item.key && styles.active]}
              onPress={() => onSelect(item.key)}
            >
              <Text style={styles.optionText}>{item.label}</Text>
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
