import React from "react";
import { colors } from "@/styles";
import IconButton from "@/components/ui/IconButton";

interface Props {
  searchQuery?: string;
}

const MapButton: React.FC<Props> = ({ searchQuery }) => {
  const goToMap = () => {
    console.log("go to SearchMap with query:", searchQuery);
  };

  return <IconButton name="map-outline" size={24} color={colors.textPrimary} onPress={goToMap} />;
};

export default MapButton;
