import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/styles";

interface Props {
  searchQuery?: string;
}

const MapButton: React.FC<Props> = ({ searchQuery }) => {
  const goToMap = () => {
    console.log("go to SearchMap with query:", searchQuery);
  };

  return (
    <TouchableOpacity onPress={goToMap} style={styles.btn}>
      <Ionicons name="map-outline" size={24} color={colors.textPrimary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: { padding: 8 },
});

export default MapButton;
