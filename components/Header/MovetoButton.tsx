import React from "react";
import { TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

interface Props {
  target: string;
  label?: string;
}

const MovetoButton: React.FC<Props> = ({ target, label }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.navigate(target as never)} style={{ padding: 6 }}>
      <Image source={require("../../assets/icons/navigate.png")} style={{ width: 22, height: 22 }} />
    </TouchableOpacity>
  );
};

export default MovetoButton;
