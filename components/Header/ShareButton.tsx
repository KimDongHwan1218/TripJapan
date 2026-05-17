import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/styles";

interface Props {
  pageInfo?: any;
}

const ShareButton: React.FC<Props> = ({ pageInfo }) => {
  const handleShare = async () => {
    console.log("공유하기:", pageInfo);
    // await shareKakaoLink(pageInfo);
  };

  return (
    <TouchableOpacity onPress={handleShare} style={styles.btn}>
      <Ionicons name="share-outline" size={24} color={colors.textPrimary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: { padding: 8 },
});

export default ShareButton;
