import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PostListItem({ post, onPress }: any) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(post)}>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={2}>{post.title}</Text>
          <View style={styles.meta}>
            <Ionicons name="heart-outline" size={14} />
            <Text style={styles.metaText}>{post.likesCount}</Text>
            <Ionicons name="chatbubble-outline" size={14} style={{ marginLeft: 10 }} />
            <Text style={styles.metaText}>{post.comments.length}</Text>
          </View>
        </View>

        {post.image_urls?.length ? (
          <Image source={{ uri: post.image_urls[0] }} style={styles.thumb} />
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  row: { flexDirection: "row" },
  title: { fontSize: 15, fontWeight: "700" },
  meta: { flexDirection: "row", marginTop: 6, alignItems: "center" },
  metaText: { marginLeft: 4, fontSize: 12 },
  thumb: { width: 70, height: 70, borderRadius: 8, marginLeft: 10 },
});
