import React from "react";
import { WebView } from "react-native-webview";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HotelStackParamList } from "@/navigation/HotelStackNavigator";

type Props = NativeStackScreenProps<
  HotelStackParamList,
  "HotelWebView"
>;

export default function HotelWebViewScreen({ route }: Props) {
  return (
    <WebView
      source={{ uri: route.params.url }}
      startInLoadingState
    />
  );
}
