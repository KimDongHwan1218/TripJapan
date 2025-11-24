import React from "react";
import { TouchableOpacity, Image } from "react-native";
// 카카오 SDK 연동 가능
// import { shareKakaoLink } from "../../utils/kakaoShare";

interface Props {
  pageInfo?: any;
}

const ShareButton: React.FC<Props> = ({ pageInfo }) => {
  const handleShare = async () => {
    console.log("공유하기:", pageInfo);
    // await shareKakaoLink(pageInfo);
  };

  return (
    <TouchableOpacity onPress={handleShare} style={{ padding: 6 }}>
      <Image source={require("../../assets/icons/share.png")} style={{ width: 22, height: 22 }} />
    </TouchableOpacity>
  );
};

export default ShareButton;
