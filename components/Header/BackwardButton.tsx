import React from "react";
import { useNavigation } from "@react-navigation/native";
import { colors } from "@/styles";
import IconButton from "@/components/ui/IconButton";

interface Props {
  type?: boolean | "simple" | "arrow" | "round";
}

const BackwardButton: React.FC<Props> = () => {
  const navigation = useNavigation();

  return <IconButton name="chevron-back" size={26} color={colors.textPrimary} onPress={() => navigation.goBack()} />;
};

export default BackwardButton;
