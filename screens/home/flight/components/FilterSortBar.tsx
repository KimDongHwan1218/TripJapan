import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors, spacing } from "@/styles";

export default function FilterSortBar() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>필터</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>정렬</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    backgroundColor: colors.surface,
  },
  btn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  btnText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
  },
});
