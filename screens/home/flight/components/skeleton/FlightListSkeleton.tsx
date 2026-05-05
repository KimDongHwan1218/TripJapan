import { View, StyleSheet } from "react-native";
import { colors, spacing, radius } from "@/styles";

export default function FlightListSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <View key={i} style={styles.skeleton} />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    height: 110,
    backgroundColor: colors.neutral200,
    margin: spacing.md,
    borderRadius: radius.lg,
  },
});
