import { View, StyleSheet, ViewProps } from "react-native";
import { colors, spacing } from "@/styles";

export function ScreenWrapper({ children, style }: ViewProps) {
  return (
    <View style={[styles.container, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
});