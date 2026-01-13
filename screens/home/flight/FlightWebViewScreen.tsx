import React from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";
import * as WebBrowser from "expo-web-browser";
import { ENV } from "@/config/env";

const API_BASE = ENV.API_BASE_URL;
const FlightWebViewScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: `${API_BASE}/flightproxy/flight-widget` }}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={["*"]}
        setSupportMultipleWindows={true}
        onShouldStartLoadWithRequest={() => true} // ❗ 무조건 true
      />

    </View>
  );
};

export default FlightWebViewScreen;
