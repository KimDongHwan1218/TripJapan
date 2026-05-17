import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "@/styles";

interface Props {
  type?: boolean | "simple" | "arrow" | "round";
}

const BackwardButton: React.FC<Props> = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btn}>
      <Ionicons name="chevron-back" size={26} color={colors.textPrimary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: { padding: 8 },
});

export default BackwardButton;
