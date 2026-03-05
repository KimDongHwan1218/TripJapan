// components/HotPostsSection.tsx
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import PostListItem from "./PostListItem";
import { colors } from "@/styles/colors";

type Post = {
  id: number;
  [key: string]: any;
};

type Props = {
  posts: Post[];
  onMore: () => void;
  onPressPost: (post: Post) => void;
};

export default function HotPostsSection({
  posts,
  onMore,
  onPressPost,
}: Props) {
  const visiblePosts = posts.slice(0, 5);

  return (
    <View style={styles.wrapper}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>실시간 인기글</Text>
        <TouchableOpacity onPress={onMore} hitSlop={10}>
          <Text style={styles.more}>더보기</Text>
        </TouchableOpacity>
      </View>

      {/* 리스트 */}
      {visiblePosts.length > 0 ? (
        visiblePosts.map((p) => (
          <PostListItem
            key={p.id}
            post={p}
            onPress={() => onPressPost(p)}
          />
        ))
      ) : (
        <>
          <PlaceholderRow />
          <PlaceholderRow />
          <PlaceholderRow />
        </>
      )}
    </View>
  );
}

function PlaceholderRow() {
  return (
    <View style={styles.placeholderRow}>
      <View style={styles.placeholderTitle} />
      <View style={styles.placeholderMeta} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.whitebackground,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },
  more: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2a6ef7",
  },

  placeholderRow: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  placeholderTitle: {
    width: "75%",
    height: 14,
    backgroundColor: "#eee",
    borderRadius: 4,
    marginBottom: 6,
  },
  placeholderMeta: {
    width: "40%",
    height: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
  },
});
