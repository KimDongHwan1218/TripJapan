import React from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing, radius } from "@/styles";
import type { Post } from "@/contexts/CommunityContext";
import BoardPromoBanner from "./components/BoardPromoBanner";

type Props = {
  board: { key: string; label: string };
  posts: Post[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  onRefresh: () => void;
  onPressPost: (postId: number) => void;
  onPressCreate: () => void;
  onGoBack: () => void;
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

function FeedItem({ post, onPress }: { post: Post; onPress: () => void }) {
  const dateStr = post.created_at
    ? new Date(post.created_at).toLocaleDateString("ko-KR", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
      })
    : "";
  const hasImage = post.image_urls && post.image_urls.length > 0;

  return (
    <TouchableOpacity style={styles.feedItem} onPress={onPress} activeOpacity={0.8}>
      <Avatar uri={post.profile_image_url} size={38} />
      <View style={styles.feedBody}>
        <Text style={styles.feedAuthor}>{post.nickname ?? "사용자"}</Text>
        <Text style={styles.feedTitle} numberOfLines={1}>{post.title}</Text>
        {post.content ? (
          <Text style={styles.feedContent} numberOfLines={2}>{post.content}</Text>
        ) : null}
        {hasImage && (
          <Image
            source={{ uri: post.image_urls![0] }}
            style={styles.feedImage}
            resizeMode="cover"
          />
        )}
        <View style={styles.feedMetaRow}>
          <View style={styles.metaGroup}>
            <View style={styles.metaItem}>
              <Ionicons name="heart" size={12} color={colors.primary} />
              <Text style={styles.metaNum}>{post.likesCount ?? 0}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="chatbubble-ellipses" size={12} color={colors.neutral500} />
              <Text style={styles.metaNum}>{post.commentsCount ?? 0}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="eye-outline" size={12} color={colors.neutral500} />
              <Text style={styles.metaNum}>{post.views ?? 0}</Text>
            </View>
          </View>
          <Text style={styles.feedDate}>{dateStr}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function BoardScreenView({
  board,
  posts,
  loading,
  error,
  refreshing,
  onRefresh,
  onPressPost,
  onPressCreate,
  onGoBack,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{board.label}</Text>
        <TouchableOpacity onPress={onPressCreate} style={styles.writeBtn}>
          <Text style={styles.writeBtnText}>글쓰기</Text>
        </TouchableOpacity>
      </View>

      <BoardPromoBanner />

      {/* 에러 */}
      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={onRefresh}>
            <Text style={styles.retryText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 스켈레톤 */}
      {!error && loading && posts.length === 0 ? (
        <View>
          {Array.from({ length: 6 }).map((_, idx) => (
            <View key={idx} style={styles.skeletonRow}>
              <View style={styles.skeletonAvatar} />
              <View style={{ flex: 1, gap: 8 }}>
                <View style={styles.skeletonTitle} />
                <View style={styles.skeletonMeta} />
              </View>
            </View>
          ))}
        </View>
      ) : !error ? (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <FeedItem post={item} onPress={() => onPressPost(item.id)} />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="document-text-outline" size={48} color={colors.neutral300} />
              <Text style={styles.emptyText}>아직 게시글이 없어요</Text>
            </View>
          }
        />
      ) : null}

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={onPressCreate} activeOpacity={0.85}>
        <Ionicons name="create-outline" size={24} color={colors.textWhite} />
      </TouchableOpacity>
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
    height: 52,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  backBtn: { padding: 4 },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  writeBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  writeBtnText: {
    color: colors.textWhite,
    fontSize: 13,
    fontWeight: "700",
  },

  // Feed item — 구분선 없이 여백으로만 분리
  feedItem: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: spacing.md,
  },
  feedBody: { flex: 1, gap: 5 },
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
  feedTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    lineHeight: 20,
  },
  feedContent: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
  },
  feedImage: {
    height: 160,
    borderRadius: radius.md,
    marginTop: 4,
  },
  feedMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  metaGroup: {
    flexDirection: "row",
    gap: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  metaNum: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.neutral500,
  },

  // Skeleton
  skeletonRow: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: spacing.md,
  },
  skeletonAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.neutral200,
  },
  skeletonTitle: {
    height: 14,
    width: "80%",
    backgroundColor: colors.neutral200,
    borderRadius: radius.xs,
  },
  skeletonMeta: {
    height: 12,
    width: "40%",
    backgroundColor: colors.neutral100,
    borderRadius: radius.xs,
  },

  // Error
  errorBox: {
    margin: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    alignItems: "center",
    gap: 8,
  },
  errorText: { color: colors.danger, fontSize: 14 },
  retryText: { color: colors.primary, fontWeight: "600", fontSize: 14 },

  // Empty
  emptyBox: {
    alignItems: "center",
    marginTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textTertiary,
  },

  // FAB
  fab: {
    position: "absolute",
    right: 18,
    bottom: 28,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
});
