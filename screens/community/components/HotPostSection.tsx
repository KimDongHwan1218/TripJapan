import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HotPostSection({ posts, onPress }: any) {
  if (!posts.length) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🔥 실시간 인기글</Text>

      {posts.slice(0, 5).map((p: any) => (
        <TouchableOpacity key={p.id} style={styles.item} onPress={() => onPress(p)}>
          <Text style={styles.title} numberOfLines={1}>{p.title}</Text>
          <View style={styles.meta}>
            <Ionicons name="heart" size={14} color="#ff4d4f" />
            <Text style={styles.count}>{p.likesCount}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    marginBottom: 12,
    backgroundColor: "#fafafa",
  },
  header: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 8,
  },
  item: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: { fontSize: 14, fontWeight: "600" },
  meta: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  count: { marginLeft: 4, fontSize: 12 },
});
