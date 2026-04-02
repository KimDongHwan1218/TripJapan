import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  RefreshControl,
  FlatList,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing, radius } from "@/styles";
import type { Post } from "@/contexts/CommunityContext";

const BOARDS = [
  { key: "free", label: "자유게시판" },
  { key: "review", label: "여행후기" },
  { key: "question", label: "질문 Q&A" },
  { key: "food", label: "맛집 추천" },
  { key: "info", label: "정보" },
  { key: "shopping", label: "쇼핑" },
];

type Props = {
  hotPosts: Post[];
  latestPosts: Post[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  onPressPost: (postId: number) => void;
  onPressBoard: (board: { key: string; label: string }) => void;
  onPressMyPosts: () => void;
};

function Avatar({ uri, size = 36 }: { uri?: string | null; size?: number }) {
  return uri ? (
    <Image
      source={{ uri }}
      style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.neutral200 }}
    />
  ) : (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.neutral200,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Ionicons name="person" size={size * 0.55} color={colors.neutral500} />
    </View>
  );
}

function HotPostCard({ post, onPress }: { post: Post; onPress: () => void }) {
  const dateStr = post.created_at
    ? new Date(post.created_at).toLocaleDateString("ko-KR", { year: "2-digit", month: "2-digit", day: "2-digit" })
    : "";
  return (
    <TouchableOpacity style={styles.hotCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.hotCardHeader}>
        <Avatar uri={post.profile_image_url} size={24} />
        <Text style={styles.hotCardAuthor} numberOfLines={1}>{post.nickname ?? "사용자"}</Text>
        <Text style={styles.hotCardDate}>{dateStr}</Text>
      </View>
      <Text style={styles.hotCardContent} numberOfLines={3}>
        {post.title}
      </Text>
      <View style={styles.hotCardFooter}>
        <Text style={styles.categoryLabel}>{post.category ?? ""}</Text>
        <View style={styles.metaRow}>
          <Ionicons name="heart" size={11} color={colors.primary} />
          <Text style={styles.metaNum}>{post.likesCount ?? 0}</Text>
          <Ionicons name="chatbubble-ellipses" size={11} color={colors.neutral500} style={{ marginLeft: 6 }} />
          <Text style={styles.metaNum}>{post.commentsCount ?? 0}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function FeedItem({ post, onPress }: { post: Post; onPress: () => void }) {
  const dateStr = post.created_at
    ? new Date(post.created_at).toLocaleDateString("ko-KR", { year: "2-digit", month: "2-digit", day: "2-digit" })
    : "";
  const hasImages = post.image_urls && post.image_urls.length > 0;

  return (
    <TouchableOpacity style={styles.feedItem} onPress={onPress} activeOpacity={0.8}>
      <Avatar uri={post.profile_image_url} size={38} />
      <View style={styles.feedBody}>
        <View style={styles.feedTopRow}>
          <Text style={styles.feedAuthor}>{post.nickname ?? "사용자"}</Text>
          <Text style={styles.feedDate}>{dateStr}</Text>
        </View>
        <Text style={styles.feedContent} numberOfLines={4}>
          {post.title}
          {post.content ? `\n${post.content}` : ""}
        </Text>
        {hasImages && (
          <Image
            source={{ uri: post.image_urls![0] }}
            style={styles.feedImage}
            resizeMode="cover"
          />
        )}
        <View style={styles.feedMetaRow}>
          <Text style={styles.categoryLabel}>{post.category ?? ""}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="heart" size={11} color={colors.primary} />
            <Text style={styles.metaNum}>{post.likesCount ?? 0}</Text>
            <Ionicons name="chatbubble-ellipses" size={11} color={colors.neutral500} style={{ marginLeft: 6 }} />
            <Text style={styles.metaNum}>{post.commentsCount ?? 0}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function CommunityScreenView({
  hotPosts,
  latestPosts,
  loading,
  refreshing,
  onRefresh,
  onPressPost,
  onPressBoard,
  onPressMyPosts,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>tabi</Text>
        <TouchableOpacity
          style={styles.writeBtn}
          onPress={() => Alert.alert("준비 중입니다")}
        >
          <Text style={styles.writeBtnText}>글쓰기</Text>
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* 이번주 인기글 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>타비톡 이번주 인기글</Text>
          {loading && hotPosts.length === 0 ? (
            <View style={styles.hotListContent}>
              {[0, 1, 2].map((i) => (
                <View key={i} style={[styles.hotCard, styles.skeleton]} />
              ))}
            </View>
          ) : (
            <FlatList
              data={hotPosts}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.hotListContent}
              renderItem={({ item }) => (
                <HotPostCard post={item} onPress={() => onPressPost(item.id)} />
              )}
            />
          )}
        </View>

        {/* 카테고리 탭 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryTabsContent}
        >
          {BOARDS.map((b) => (
            <TouchableOpacity
              key={b.key}
              style={styles.categoryTab}
              onPress={() => onPressBoard(b)}
              activeOpacity={0.7}
            >
              <Text style={styles.categoryTabText}>{b.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 내 글 보기 */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>내 글 보기</Text>
            <TouchableOpacity onPress={onPressMyPosts}>
              <Text style={styles.seeAll}>내 글 모두보기 &gt;</Text>
            </TouchableOpacity>
          </View>
          {latestPosts.length > 0 && (
            <TouchableOpacity
              style={styles.myPostCard}
              onPress={() => onPressPost(latestPosts[0].id)}
              activeOpacity={0.8}
            >
              <View style={styles.myPostTopRow}>
                <Text style={styles.hotCardDate}>
                  {latestPosts[0].created_at
                    ? new Date(latestPosts[0].created_at).toLocaleDateString("ko-KR", {
                        year: "2-digit", month: "2-digit", day: "2-digit",
                      })
                    : ""}
                </Text>
                <View style={styles.metaRow}>
                  <Ionicons name="heart" size={11} color={colors.primary} />
                  <Text style={styles.metaNum}>{latestPosts[0].likesCount ?? 0}</Text>
                  <Ionicons name="chatbubble-ellipses" size={11} color={colors.neutral500} style={{ marginLeft: 6 }} />
                  <Text style={styles.metaNum}>{latestPosts[0].commentsCount ?? 0}</Text>
                </View>
              </View>
              <Text style={styles.myPostContent} numberOfLines={2}>
                {latestPosts[0].title}
              </Text>
              <Text style={styles.categoryLabel}>{latestPosts[0].category ?? ""}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 실시간 타비톡 피드 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{"지금 바로\n실시간 타비톡"}</Text>
          {loading && latestPosts.length === 0
            ? [0, 1, 2].map((i) => (
                <View key={i} style={[styles.feedSkeletonRow]}>
                  <View style={styles.skeletonAvatar} />
                  <View style={{ flex: 1, gap: 8 }}>
                    <View style={styles.skeletonLine} />
                    <View style={[styles.skeletonLine, { width: "60%" }]} />
                  </View>
                </View>
              ))
            : latestPosts.map((post) => (
                <FeedItem key={post.id} post={post} onPress={() => onPressPost(post.id)} />
              ))}
        </View>

        <View style={{ height: 32 }} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  logo: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: -0.5,
  },
  writeBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
  },
  writeBtnText: {
    color: colors.textWhite,
    fontSize: 13,
    fontWeight: "700",
  },

  // Section
  section: {
    marginTop: 28,
    paddingHorizontal: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  seeAll: {
    fontSize: 13,
    color: colors.textTertiary,
  },

  // Hot Posts
  hotListContent: {
    gap: 12,
    paddingRight: spacing.md,
  },
  hotCard: {
    width: 220,
    backgroundColor: colors.neutral100,
    borderRadius: radius.lg,
    padding: 14,
    gap: 8,
  },
  hotCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  hotCardAuthor: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  hotCardDate: {
    fontSize: 10,
    color: colors.neutral300,
    fontWeight: "600",
  },
  hotCardContent: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
  },
  hotCardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },

  // Category Tabs
  categoryTabsContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    gap: 8,
  },
  categoryTab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    backgroundColor: colors.surface,
  },
  categoryTabText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
  },

  // My Post
  myPostCard: {
    backgroundColor: colors.neutral100,
    borderRadius: radius.lg,
    padding: 14,
    gap: 8,
  },
  myPostTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  myPostContent: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
  },

  // Feed
  feedItem: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  feedBody: {
    flex: 1,
    gap: 6,
  },
  feedTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  feedAuthor: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  feedDate: {
    fontSize: 10,
    color: colors.neutral300,
    fontWeight: "600",
  },
  feedContent: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  feedImage: {
    height: 180,
    borderRadius: radius.md,
    marginTop: 4,
  },
  feedMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },

  // Common
  categoryLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.neutral300,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  metaNum: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.neutral500,
  },

  // Skeleton
  skeleton: {
    opacity: 0.4,
  },
  feedSkeletonRow: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  skeletonAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.neutral200,
  },
  skeletonLine: {
    height: 14,
    backgroundColor: colors.neutral200,
    borderRadius: radius.xs,
    width: "100%",
  },
});
