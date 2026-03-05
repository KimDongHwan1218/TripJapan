import React from "react";
import { View, Text } from "react-native";
import Header from "@/components/Header/Header";
import { layout, typography } from "@/styles";

export default function PolicyScreen() {
  return (
    <View style={layout.screen}>
      <Header title="약관 및 개인정보 처리방침" backwardButton="simple" />
      <Text style={typography.body}>
        약관이 들어갈 자리입니다.
      </Text>
    </View>
  );
}