import { StyleSheet } from "react-native";
import { layout } from "@/styles";

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
    fontWeight: "bold",
    marginBottom: 12,
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  card: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    marginBottom: 8,
  },
});