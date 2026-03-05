import React, { useState, useCallback } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import Header from "@/components/Header/Header";
import { useCommunity } from "@/contexts/CommunityContext";
import { CommunityStackParamList } from "@/navigation/CommunityStackNavigator";
import PostListItem from "./components/PostListItem";
import { selectBoardPosts } from "./utils/postSelectors";
import { layout } from "@/styles";

type BoardKey = "free" | "review" | "question" | "info";

type Route = RouteProp<CommunityStackParamList, "BoardScreen">;
type Nav = NativeStackNavigationProp<
  CommunityStackParamList,
  "BoardScreen"
>;

export default function BoardScreen() {
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

  return (
    <View style={styles.container}>
      <Header title={board.label} />

      {/* 상단 정보 바 (항상 유지) */}
      <View style={styles.actionBar}>
        <Text style={styles.count}>총 {posts.length}개 글</Text>
        <Text style={styles.sort}>최신순 ▾</Text>
      </View>

      {/* 에러 상태 */}
      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={onRefresh}>
            <Text style={styles.retryText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 리스트 / 스켈레톤 */}
      {!error && (loading || posts.length === 0) ? (
        <View>
          {Array.from({ length: 6 }).map((_, idx) => (
            <View key={idx} style={styles.skeletonRow}>
              <View style={styles.skeletonTitle} />
              <View style={styles.skeletonMeta} />
            </View>
          ))}
        </View>
      ) : !error ? (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PostListItem
              post={item}
              onPress={() =>
                navigation.navigate("PostDetailScreen", {
                  postId: item.id,
                })
              }
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#E60012"
              colors={["#E60012"]}
            />
          }
        />
      ) : null}

      {/* 글쓰기 FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          navigation.navigate("PostCreateScreen", {
            boardType: board.key as BoardKey,
          })
        }
      >
        <Ionicons name="create-outline" size={26} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...layout.screen,
  },
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  count: {
    fontSize: 13,
    color: "#555",
  },
  sort: {
    fontSize: 13,
    color: "#555",
  },

  /* Skeleton */
  skeletonRow: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  skeletonTitle: {
    height: 16,
    width: "80%",
    backgroundColor: "#eee",
    borderRadius: 6,
    marginBottom: 8,
  },
  skeletonMeta: {
    height: 12,
    width: "40%",
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
  },

  /* 에러 */
  errorBox: {
    margin: 16,
    padding: 16,
    backgroundColor: "#FFF0F0",
    borderRadius: 8,
    alignItems: "center",
    gap: 8,
  },
  errorText: {
    color: "#CC0000",
    fontSize: 14,
  },
  retryText: {
    color: "#E60012",
    fontWeight: "600",
    fontSize: 14,
  },

  /* FAB */
  fab: {
    position: "absolute",
    right: 18,
    bottom: 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2a6ef7",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
});
