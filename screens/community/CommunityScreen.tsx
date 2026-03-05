import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Header from "@/components/Header/Header";
import { layout } from "@/styles";
import { CommunityStackParamList } from "@/navigation/CommunityStackNavigator";
import { useCommunity } from "@/contexts/CommunityContext";
import { selectHotPosts, selectLatestPosts } from "./utils/postSelectors";

type CommunityNav =
  NativeStackNavigationProp<CommunityStackParamList, "CommunityScreen">;

const TAB_HEIGHT = 54;
const CATEGORY = "전체";

export default function CommunityScreen() {
  const navigation = useNavigation<CommunityNav>();
  const scrollY = useRef(new Animated.Value(0)).current;

  const { getPosts, fetchPostsIfNeeded, refreshPosts, isLoading } =
    useCommunity();

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

  const boards = [
    { key: "review", label: "후기" },
    { key: "question", label: "질문" },
    { key: "free", label: "자유" },
    { key: "info", label: "정보" },
  ];

  const tabOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const tabTranslate = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [0, -40],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <Header title="커뮤니티" />

      <Animated.ScrollView
        contentContainerStyle={{
          paddingTop: TAB_HEIGHT + 20,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#E60012"
            colors={["#E60012"]}
            progressViewOffset={TAB_HEIGHT}
          />
        }
      >
        {/* 광고 배너 */}
        <View style={styles.adBanner}>
          <Text style={styles.adBadge}>PROMOTION</Text>
          <Text style={styles.adTitle}>✈ 삿포로 특가 항공권 199,000원~</Text>
          <Text style={styles.adSub}>이번주 한정 특가 · 선착순 마감</Text>
        </View>

        {/* 실시간 인기글 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>실시간 인기글</Text>

          {loading && hotPosts.length === 0
            ? Array.from({ length: 5 }).map((_, idx) => (
                <View key={idx} style={styles.skeletonRow}>
                  <View style={styles.skeletonRank} />
                  <View style={styles.skeletonTitle} />
                </View>
              ))
            : hotPosts.map((post, index) => (
                <TouchableOpacity
                  key={post.id}
                  style={styles.rankRow}
                  onPress={() =>
                    navigation.navigate("PostDetailScreen", {
                      postId: post.id,
                    })
                  }
                >
                  <Text
                    style={[styles.rankNumber, index < 3 && styles.topRank]}
                  >
                    {index + 1}
                  </Text>
                  <Text style={styles.rankTitle} numberOfLines={1}>
                    {post.title}
                  </Text>
                  <Text style={styles.commentCount}>
                    ({post.commentsCount})
                  </Text>
                </TouchableOpacity>
              ))}
        </View>

        {/* 최신글 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>최신글</Text>

          {loading && latestPosts.length === 0
            ? Array.from({ length: 3 }).map((_, idx) => (
                <View key={idx} style={styles.skeletonRow}>
                  <View style={styles.skeletonFull} />
                </View>
              ))
            : latestPosts.map((post) => (
                <TouchableOpacity
                  key={post.id}
                  style={styles.listRow}
                  onPress={() =>
                    navigation.navigate("PostDetailScreen", {
                      postId: post.id,
                    })
                  }
                >
                  <View style={styles.listTop}>
                    <Text style={styles.boardLabel}>[{post.category}]</Text>
                    <Text style={styles.listTitle} numberOfLines={1}>
                      {post.title}
                    </Text>
                    <Text style={styles.commentCount}>
                      ({post.commentsCount})
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
        </View>
      </Animated.ScrollView>

      {/* ===== Overlay 카테고리 바 ===== */}
      <Animated.View
        style={[
          styles.tabOverlay,
          {
            opacity: tabOpacity,
            transform: [{ translateY: tabTranslate }],
          },
        ]}
      >
        <View style={styles.tabContainer}>
          {boards.map((b) => (
            <TouchableOpacity
              key={b.key}
              style={styles.tabButton}
              onPress={() =>
                navigation.navigate("BoardScreen", { board: b })
              }
            >
              <Text style={styles.tabText}>{b.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...layout.screen,
    backgroundColor: "#F6F7F9",
  },

  /* ===== Overlay Tab ===== */
  tabOverlay: {
    position: "absolute",
    top: 100,
    left: 0,
    right: 0,
    height: TAB_HEIGHT,
    backgroundColor: "rgba(246,247,249,0.96)",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    zIndex: 10,
    justifyContent: "center",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  tabButton: {
    paddingHorizontal: 12,
  },
  tabText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
  },

  /* ===== 광고 ===== */
  adBanner: {
    marginHorizontal: 16,
    backgroundColor: "#E9EEFF",
    borderRadius: 16,
    padding: 18,
  },
  adBadge: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4A6CF7",
    marginBottom: 6,
  },
  adTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  adSub: {
    fontSize: 12,
    color: "#555",
    marginTop: 4,
  },

  /* ===== 섹션 ===== */
  section: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 16,
  },

  /* 인기글 */
  rankRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  rankNumber: {
    width: 24,
    fontWeight: "800",
    fontSize: 15,
    color: "#999",
  },
  topRank: {
    color: "#E60023",
  },
  rankTitle: {
    flex: 1,
    fontSize: 14,
  },

  /* 최신글 */
  listRow: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#ECECEC",
  },
  listTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  boardLabel: {
    color: "#888",
    marginRight: 6,
  },
  listTitle: {
    flex: 1,
    fontSize: 15,
  },
  commentCount: {
    color: "#E60023",
    fontWeight: "600",
    marginLeft: 6,
  },

  /* 스켈레톤 */
  skeletonRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 8,
  },
  skeletonRank: {
    width: 18,
    height: 14,
    backgroundColor: "#eee",
    borderRadius: 4,
  },
  skeletonTitle: {
    flex: 1,
    height: 14,
    backgroundColor: "#eee",
    borderRadius: 4,
  },
  skeletonFull: {
    flex: 1,
    height: 14,
    backgroundColor: "#eee",
    borderRadius: 4,
  },
});
