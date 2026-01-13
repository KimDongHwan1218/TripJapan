import { View, StyleSheet, ViewProps } from "react-native";

export function Center({ children, style }: ViewProps) {
  return (
    <View style={[styles.center, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});