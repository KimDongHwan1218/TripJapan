import { Modal, View } from "react-native";
import FlightSearchWidget, { type FlightSearchParams } from "../FlightSearchWidget";

type Props = {
  visible: boolean;
  onClose: () => void;
  params?: FlightSearchParams;
};

export default function SearchEditModal({ visible, onClose, params }: Props) {
  return (
    <Modal visible={visible} animationType="slide">
      <View style={{ padding: 16 }}>
        <FlightSearchWidget initialParams={params} />
      </View>
    </Modal>
  );
}
