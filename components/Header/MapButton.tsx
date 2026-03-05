import React from "react";
import { TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

interface Props {
  searchQuery?: string;
}

const MapButton: React.FC<Props> = ({ searchQuery }) => {
  const navigation = useNavigation();

  const goToMap = () => {
    console.log("go to SearchMap with query:", searchQuery);
  };

  return (
    <TouchableOpacity onPress={goToMap} style={{ padding: 6 }}>
      <Image source={require("../../assets/icons/map.png")} style={{ width: 22, height: 22 }} />
    </TouchableOpacity>
  );
};

export default MapButton;
