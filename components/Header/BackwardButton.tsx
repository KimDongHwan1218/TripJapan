import React from "react";
import { TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

interface Props {
  type?: boolean | "simple" | "arrow" | "round";
}

const BackwardButton: React.FC<Props> = ({ type = "arrow" }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btn}>
      <Image source={require("../../assets/icons/backarrow.png")} style={{ width: 24, height: 24 }} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: { padding: 8 },
});

export default BackwardButton;
