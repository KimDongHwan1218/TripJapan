// components/PostListItem.tsx
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

export default function PostListItem({ post, onPress }: any) {
  return (
    <TouchableOpacity onPress={() => onPress(post)} style={styles.item}>
      <Text style={styles.title} numberOfLines={1}>
        {post.title}
      </Text>
      <View style={styles.meta}>
        <Text>❤️ {post.likesCount}</Text>
        <Text> 💬 {post.commentsCount}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: { fontWeight: "600", marginBottom: 4 },
  meta: { flexDirection: "row", gap: 10 },
});
