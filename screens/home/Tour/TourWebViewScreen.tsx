import React from "react";
import { WebView } from "react-native-webview";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TourStackParamList } from "@/navigation/TourStackNavigator";

type Props = NativeStackScreenProps<
  TourStackParamList,
  "TourWebView"
>;

export default function TourWebViewScreen({ route }: Props) {
  return (
    <WebView
      source={{ uri: route.params.url }}
      startInLoadingState
    />
  );
}
