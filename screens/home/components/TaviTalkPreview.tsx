import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius } from "@/styles";
import { useCommunity } from "@/contexts/CommunityContext";
import { selectLatestPosts } from "@/screens/community/utils/postSelectors";

interface Props {
  onPressTaviTalk: () => void;
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMin = Math.floor((now.getTime() - d.getTime()) / 60000);
    if (diffMin < 1) return "방금";
    if (diffMin < 60) return `${diffMin}분 전`;
    if (diffMin < 60 * 24) return `${Math.floor(diffMin / 60)}시간 전`;
    return `${String(d.getFullYear()).slice(2)}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  } catch {
    return "";
  }
}

function avatarColor(nickname: string) {
  const colors = ["#E8B4A0", "#A0C4E8", "#B4E8A0", "#E8E0A0", "#C4A0E8", "#A0E8C4"];
  const idx = (nickname?.charCodeAt(0) ?? 0) % colors.length;
  return colors[idx];
}

export default function TaviTalkPreview({ onPressTaviTalk }: Props) {
  const { getPosts, fetchPostsIfNeeded, isLoading } = useCommunity();

  useEffect(() => {
    fetchPostsIfNeeded("전체");
  }, []);

  const posts = selectLatestPosts(getPosts("전체"), 3);
  const loading = isLoading("전체");

  return (
    <View style={styles.container}>
      {/* 섹션 헤더 */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{"일본 여행의 수다!\n실시간 타비톡"}</Text>
      </View>

      {loading && posts.length === 0 ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : posts.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>아직 게시글이 없어요</Text>
        </View>
      ) : (
        posts.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.feedItem}
            onPress={onPressTaviTalk}
            activeOpacity={0.8}
          >
            <View style={[styles.avatar, { backgroundColor: avatarColor(item.nickname) }]} />
            <View style={styles.feedBody}>
              <View style={styles.feedTopRow}>
                <Text style={styles.author}>{item.nickname}</Text>
                <Text style={styles.date}>{formatDate(item.created_at)}</Text>
              </View>
              {item.title ? (
                <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
              ) : null}
              <Text style={styles.content} numberOfLines={2}>{item.content}</Text>
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Ionicons name="heart" size={11} color={colors.primary} />
                  <Text style={styles.metaNum}>{item.likesCount}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="chatbubble-ellipses" size={11} color={colors.neutral500} />
                  <Text style={styles.metaNum}>{item.commentsCount}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}

      {/* 타비톡 바로가기 */}
      <TouchableOpacity style={styles.moreBtn} onPress={onPressTaviTalk} activeOpacity={0.7}>
        <Text style={styles.moreBtnText}>타비톡 바로가기</Text>
        <Ionicons name="chevron-forward" size={14} color={colors.textTertiary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    paddingBottom: spacing.sm,
  },
  sectionHeader: {
    paddingHorizontal: spacing.md,
    paddingTop: 28,
    paddingBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.3,
    lineHeight: 26,
  },

  loadingBox: {
    paddingVertical: 32,
    alignItems: "center",
  },
  emptyBox: {
    paddingVertical: 24,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 13,
    color: colors.textTertiary,
  },

  feedItem: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    flexShrink: 0,
  },
  feedBody: {
    flex: 1,
    gap: 4,
  },
  feedTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  author: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  date: {
    fontSize: 10,
    color: colors.neutral300,
    fontWeight: "600",
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  content: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
  },
  metaRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 2,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  metaNum: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.neutral500,
  },

  moreBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 4,
  },
  moreBtnText: {
    fontSize: 13,
    color: colors.textTertiary,
    fontWeight: "600",
  },
});
