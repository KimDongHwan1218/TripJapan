import { ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function CategoryTabs({ categories, selected, onSelect }: any) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {categories.map((c: string) => (
        <TouchableOpacity
          key={c}
          style={[styles.tab, selected === c && styles.active]}
          onPress={() => onSelect(c)}
        >
          <Text style={[styles.text, selected === c && styles.activeText]}>
            {c}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, marginBottom: 8 },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#eee",
    borderRadius: 18,
    marginRight: 8,
  },
  active: { backgroundColor: "#2a6ef7" },
  text: { fontWeight: "600" },
  activeText: { color: "#fff" },
});
