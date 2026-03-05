import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { layout } from "@/styles";

import Header from "@/components/Header/Header";
import { useCommunity } from "@/contexts/CommunityContext";

import PostListItem from "./components/PostListItem";
import { selectHotPosts } from "./utils/postSelectors";

export default function HotPostsScreen() {
  const { getPosts } = useCommunity();
  const allPosts = getPosts("전체");

  const hotPosts = selectHotPosts(allPosts, 100);

  return (
    <View style={styles.container}>
      <Header title="실시간 인기글" />

      <FlatList
        data={hotPosts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PostListItem post={item} onPress={() => {}} />
        )}
        contentContainerStyle={styles.content}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...layout.screen,
  },
  content: {
    ...layout.content,
  },
});
