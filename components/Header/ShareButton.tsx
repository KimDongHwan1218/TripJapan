import React from "react";
import { colors } from "@/styles";
import IconButton from "@/components/ui/IconButton";

interface Props {
  pageInfo?: any;
}

const ShareButton: React.FC<Props> = ({ pageInfo }) => {
  const handleShare = async () => {
    console.log("공유하기:", pageInfo);
    // await shareKakaoLink(pageInfo);
  };

  return <IconButton name="share-outline" size={24} color={colors.textPrimary} onPress={handleShare} />;
};

export default ShareButton;
