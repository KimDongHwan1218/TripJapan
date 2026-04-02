import React, { useState, useCallback } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CommunityStackParamList } from "@/navigation/CommunityStackNavigator";
import { useCommunity } from "@/contexts/CommunityContext";
import { selectBoardPosts } from "./utils/postSelectors";
import BoardScreenView from "./BoardScreen.view";

type BoardKey = "free" | "review" | "question" | "info";
type Route = RouteProp<CommunityStackParamList, "BoardScreen">;
type Nav = NativeStackNavigationProp<CommunityStackParamList, "BoardScreen">;

export default function BoardScreenContainer() {
  const route = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { board } = route.params;

  const { getPosts, isLoading, refreshPosts, getError } = useCommunity();

  const allPosts = getPosts("전체");
  const loading = isLoading("전체");
  const error = getError("전체");

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshPosts("전체");
    setRefreshing(false);
  }, [refreshPosts]);

  const posts =
    board.key === "all"
      ? allPosts
      : selectBoardPosts(allPosts, board.key as BoardKey);

  const onPressPost = (postId: number) => {
    navigation.navigate("PostDetailScreen", { postId });
  };

  const onPressCreate = () => {
    navigation.navigate("PostCreateScreen", { boardType: board.key as BoardKey });
  };

  return (
    <BoardScreenView
      board={board}
      posts={posts}
      loading={loading}
      error={error}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onPressPost={onPressPost}
      onPressCreate={onPressCreate}
    />
  );
}
