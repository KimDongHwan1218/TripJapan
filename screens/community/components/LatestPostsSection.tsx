// components/LatestPostsSection.tsx
import { View, Text, StyleSheet } from "react-native";
import PostListItem from "./PostListItem";
import { colors } from "@/styles/colors";

type Post = {
  id: number;
  [key: string]: any;
};

type Props = {
  posts: Post[];
  onPressPost: (post: Post) => void;
};

export default function LatestPostsSection({ posts, onPressPost }: Props) {
  const visiblePosts = posts.slice(0, 10);

  return (
    <View style={styles.sectionWrapper}>
      <Text style={styles.title}>🕒 최신글</Text>

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
  sectionWrapper: {
    marginTop: 24,
    backgroundColor: colors.whitebackground,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 8,
    paddingHorizontal: 16,
    color: "#111",
  },
  placeholderRow: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  placeholderTitle: {
    width: "75%",
    height: 14,
    backgroundColor: "#eee",
    borderRadius: 6,
    marginBottom: 8,
  },
  placeholderMeta: {
    width: "40%",
    height: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
  },
});
