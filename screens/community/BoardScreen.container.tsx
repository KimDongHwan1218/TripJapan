import React, { useState, useCallback, useEffect } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CommunityStackParamList } from "@/navigation/CommunityStackNavigator";
import { useCommunity } from "@/contexts/CommunityContext";
import BoardScreenView from "./BoardScreen.view";

type BoardKey = "free" | "review" | "question" | "info" | "food" | "shopping";
type Route = RouteProp<CommunityStackParamList, "BoardScreen">;
type Nav = NativeStackNavigationProp<CommunityStackParamList, "BoardScreen">;

// board.key === "all"이면 전체 글(타비톡 메인 "실시간 타비톡" 전체보기), 아니면 해당 게시판.
// 예전엔 "전체" 첫 페이지를 받아 앱에서 카테고리로 걸러서, 서버가 limit를 제대로 지키기 시작하면
// 최신 20개 안에 없는 게시판 글은 아예 안 보이는 구조였음 → 게시판별 API + 무한 스크롤로 변경
export default function BoardScreenContainer() {
  const route = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { board } = route.params;
  const category = board.key === "all" ? "전체" : board.key;

  const { getPosts, isLoading, isLoadingMore, refreshPosts, loadMorePosts, fetchPostsIfNeeded, getError } =
    useCommunity();

  useEffect(() => {
    fetchPostsIfNeeded(category);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshPosts(category);
    setRefreshing(false);
  }, [refreshPosts, category]);

  const onPressPost = useCallback(
    (postId: number) => {
      navigation.navigate("PostDetailScreen", { postId });
    },
    [navigation]
  );

  const onPressCreate = useCallback(() => {
    navigation.navigate("PostCreateScreen", {
      boardType: (board.key === "all" ? "free" : board.key) as BoardKey,
    });
  }, [navigation, board.key]);

  return (
    <BoardScreenView
      board={board}
      posts={getPosts(category)}
      loading={isLoading(category)}
      loadingMore={isLoadingMore(category)}
      error={getError(category)}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onLoadMore={() => loadMorePosts(category)}
      onPressPost={onPressPost}
      onPressCreate={onPressCreate}
      onGoBack={() => navigation.goBack()}
    />
  );
}
