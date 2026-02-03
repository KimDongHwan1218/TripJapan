import { Modal, View, Text, FlatList, TouchableOpacity } from "react-native";

const AIRPORTS = [
  { code: "ICN", name: "인천" },
  { code: "PUS", name: "부산" },
  { code: "NRT", name: "도쿄 나리타" },
  { code: "HND", name: "도쿄 하네다" },
  { code: "KIX", name: "오사카" },
  { code: "CTS", name: "삿포로" },
  { code: "CDG", name: "샤를드골" },
  { code: "FRA", name: "프랑크프루트" },
];

export default function AirportPickerModal({ visible, onClose, onSelect }) {
  return (
    <Modal visible={visible} animationType="slide">
      <View style={{ padding: 20 }}>
        <Text>공항 선택</Text>

        <FlatList
          data={AIRPORTS}
          keyExtractor={item => item.code}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                onSelect(item.code);
                onClose();
              }}
            >
              <Text style={{ padding: 12 }}>
                {item.name} ({item.code})
              </Text>
            </TouchableOpacity>
          )}
        />

        <TouchableOpacity onPress={onClose}>
          <Text>닫기</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
