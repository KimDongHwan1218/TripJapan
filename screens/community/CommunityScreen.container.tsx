import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CommunityStackParamList } from "@/navigation/CommunityStackNavigator";
import { useCommunity } from "@/contexts/CommunityContext";
import { useAuth } from "@/contexts/AuthContext";
import { selectHotPosts, selectLatestPosts } from "./utils/postSelectors";
import { useMyPosts } from "./hooks/useMyPosts";
import CommunityScreenView from "./CommunityScreen.view";
import { FlatList } from "react-native";

type CommunityNav = NativeStackNavigationProp<CommunityStackParamList, "CommunityScreen">;

const CATEGORY = "전체";

export default function CommunityScreenContainer() {
  const navigation = useNavigation<CommunityNav>();
  const route = useRoute();
  const { getPosts, fetchPostsIfNeeded, refreshPosts, isLoading } = useCommunity();
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
        refreshMyPosts();
        // params 소비 후 초기화 (중복 갱신 방지)
        navigation.setParams({ fromCreate: undefined, fromEdit: undefined } as any);
      }
    }, [route.params])
  );

  const allPosts = getPosts(CATEGORY);
  const loading = isLoading(CATEGORY);
  const hotPosts = selectHotPosts(allPosts);
  // 메인에선 실시간 피드 5개만 미리보기 — 전체는 "실시간 타비톡" 헤더 → BoardScreen(all)에서 무한 스크롤
  const latestPosts = selectLatestPosts(allPosts, 5);
  // 내 글은 서버 작성자 필터(user_id)로 따로 받음 — "전체" 첫 페이지 안에 내 글이 없어도 보이도록
  const { posts: myPosts, refresh: refreshMyPosts } = useMyPosts(user?.id);
  const myLatestPost = myPosts[0] ?? null;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refreshPosts(CATEGORY), refreshMyPosts()]);
    setRefreshing(false);
  }, [refreshPosts, refreshMyPosts]);

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

  const onPressPost = useCallback(
    (postId: number) => {
      navigation.navigate("PostDetailScreen", { postId });
    },
    [navigation]
  );

  const onPressBoard = (board: { key: string; label: string }) => {
    navigation.navigate("BoardScreen", { board });
  };

  return (
    <CommunityScreenView
      flatListRef={flatListRef}
      hotPosts={hotPosts}
      latestPosts={latestPosts}
      myLatestPost={myLatestPost}
      loading={loading}
      refreshing={refreshing}
      userAvatar={user?.profile_image ?? null}
      userNickname={user?.nickname ?? null}
      onRefresh={onRefresh}
      onScroll={handleScroll}
      onPressPost={onPressPost}
      onPressBoard={onPressBoard}
      onPressMyPosts={() => navigation.navigate("MyPostsScreen")}
      onPressHotPosts={() => navigation.navigate("HotPostsScreen")}
      onPressAllPosts={() => navigation.navigate("BoardScreen", { board: { key: "all", label: "실시간 타비톡" } })}
      onPressWrite={() => navigation.navigate("PostCreateScreen", { boardType: "free" })}
    />
  );
}
