import { StyleSheet } from "react-native";
import { layout, radius, colors } from "@/styles";

export default StyleSheet.create({
  container: {
    ...layout.screen,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  card: {
    padding: 12,
    borderRadius: radius.sm, borderCurve: "continuous",
    backgroundColor: colors.neutral100,
    marginBottom: 8,
  },
});