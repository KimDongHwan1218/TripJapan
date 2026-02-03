import { View, StyleSheet, ActivityIndicator } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { WebView } from "react-native-webview";

import { FlightStackParamList } from "@/navigation/FlightStackNavigator";

type RouteProps = RouteProp<
  FlightStackParamList,
  "ExternalWebView"
>;

export default function ExternalWebViewScreen() {
  const { params } = useRoute<RouteProps>();

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: params.url }}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  loading: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center"
  }
});
