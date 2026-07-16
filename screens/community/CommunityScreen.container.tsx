import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CommunityStackParamList } from "@/navigation/CommunityStackNavigator";
import { useCommunity } from "@/contexts/CommunityContext";
import { useAuth } from "@/contexts/AuthContext";
import { selectHotPosts, selectLatestPosts } from "./utils/postSelectors";
import CommunityScreenView from "./CommunityScreen.view";
import { FlatList } from "react-native";

type CommunityNav = NativeStackNavigationProp<CommunityStackParamList, "CommunityScreen">;

const CATEGORY = "전체";

export default function CommunityScreenContainer() {
  const navigation = useNavigation<CommunityNav>();
  const route = useRoute();
  const { getPosts, fetchPostsIfNeeded, refreshPosts, loadMorePosts, isLoading, isLoadingMore, hasMore } = useCommunity();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  // 최초 로드
  useEffect(() => {
    fetchPostsIfNeeded(CATEGORY);
  }, []);

  // 글 작성/수정 후 돌아오면 목록 갱신
  useFocusEffect(
    useCallback(() => {
      const params = route.params as any;
      if (params?.fromCreate || params?.fromEdit) {
        refreshPosts(CATEGORY);
        // params 소비 후 초기화 (중복 갱신 방지)
        navigation.setParams({ fromCreate: undefined, fromEdit: undefined } as any);
      }
    }, [route.params])
  );

  const allPosts = getPosts(CATEGORY);
  const loading = isLoading(CATEGORY);
  const loadingMore = isLoadingMore(CATEGORY);
  const hotPosts = selectHotPosts(allPosts);
  const latestPosts = selectLatestPosts(allPosts);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshPosts(CATEGORY);
    setRefreshing(false);
  }, [refreshPosts]);

  // ── 스크롤 위치 복원 ──────────────────────────────────────────
  const flatListRef = useRef<FlatList>(null);
  const scrollOffsetRef = useRef(0);

  const handleScroll = useCallback((offset: number) => {
    scrollOffsetRef.current = offset;
  }, []);

  useFocusEffect(
    useCallback(() => {
      // 화면 복귀 시 저장된 위치로 복원 (약간 지연 — FlatList 렌더 후)
      const timer = setTimeout(() => {
        if (scrollOffsetRef.current > 0) {
          flatListRef.current?.scrollToOffset({
            offset: scrollOffsetRef.current,
            animated: false,
          });
        }
      }, 50);
      return () => clearTimeout(timer);
    }, [])
  );

  const onPressPost = (postId: number) => {
    navigation.navigate("PostDetailScreen", { postId });
  };

  const onPressBoard = (board: { key: string; label: string }) => {
    navigation.navigate("BoardScreen", { board });
  };

  return (
    <CommunityScreenView
      flatListRef={flatListRef}
      hotPosts={hotPosts}
      latestPosts={latestPosts}
      loading={loading}
      refreshing={refreshing}
      loadingMore={loadingMore}
      userAvatar={user?.profile_image ?? null}
      userNickname={user?.nickname ?? null}
      onRefresh={onRefresh}
      onLoadMore={() => loadMorePosts(CATEGORY)}
      onScroll={handleScroll}
      onPressPost={onPressPost}
      onPressBoard={onPressBoard}
      onPressMyPosts={() => navigation.navigate("MyPostsScreen")}
      onPressWrite={() => navigation.navigate("PostCreateScreen", { boardType: "free" })}
    />
  );
}
