import React, { useEffect, useState, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CommunityStackParamList } from "@/navigation/CommunityStackNavigator";
import { useCommunity } from "@/contexts/CommunityContext";
import { useAuth } from "@/contexts/AuthContext";
import { selectHotPosts, selectLatestPosts } from "./utils/postSelectors";
import CommunityScreenView from "./CommunityScreen.view";

type CommunityNav = NativeStackNavigationProp<CommunityStackParamList, "CommunityScreen">;

const CATEGORY = "전체";

export default function CommunityScreenContainer() {
  const navigation = useNavigation<CommunityNav>();
  const { getPosts, fetchPostsIfNeeded, refreshPosts, isLoading } = useCommunity();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPostsIfNeeded(CATEGORY);
  }, []);

  const allPosts = getPosts(CATEGORY);
  const loading = isLoading(CATEGORY);
  const hotPosts = selectHotPosts(allPosts);
  const latestPosts = selectLatestPosts(allPosts);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshPosts(CATEGORY);
    setRefreshing(false);
  }, [refreshPosts]);

  const onPressPost = (postId: number) => {
    navigation.navigate("PostDetailScreen", { postId });
  };

  const onPressBoard = (board: { key: string; label: string }) => {
    navigation.navigate("BoardScreen", { board });
  };

  return (
    <CommunityScreenView
      hotPosts={hotPosts}
      latestPosts={latestPosts}
      loading={loading}
      refreshing={refreshing}
      userAvatar={user?.profile_image ?? null}
      userNickname={user?.nickname ?? null}
      onRefresh={onRefresh}
      onPressPost={onPressPost}
      onPressBoard={onPressBoard}
      onPressMyPosts={() => navigation.navigate("MyPostsScreen")}
      onPressWrite={() => navigation.navigate("PostCreateScreen", { boardType: "free" })}
    />
  );
}
