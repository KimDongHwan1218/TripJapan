import { Modal, View } from "react-native";
import FlightSearchWidget from "../FlightSearchWidget";

export default function SearchEditModal({ visible, onClose, params }) {
  return (
    <Modal visible={visible} animationType="slide">
      <View style={{ padding: 16 }}>
        <FlightSearchWidget initialParams={params} />
      </View>
    </Modal>
  );
}
