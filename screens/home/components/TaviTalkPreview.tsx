import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "@/styles";
import { useCommunity } from "@/contexts/CommunityContext";
import { selectLatestPosts } from "@/screens/community/utils/postSelectors";

interface Props {
  onPressTaviTalk: () => void;
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return `${String(d.getFullYear()).slice(2)}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  } catch {
    return "";
  }
}

const CATEGORY_LABEL: Record<string, string> = {
  free: "자유게시판",
  review: "여행후기",
  question: "Q&A",
  food: "맛집 추천",
  shopping: "쇼핑",
};

function avatarColor(nickname: string) {
  const palette = ["#E8B4A0", "#A0C4E8", "#B4E8A0", "#E8E0A0", "#C4A0E8", "#A0E8C4"];
  return palette[(nickname?.charCodeAt(0) ?? 0) % palette.length];
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
      {/* Figma 섹션 타이틀: 두 줄, 굵은 */}
      <View style={styles.titleBlock}>
        <Text style={styles.titleLine1}>일본 여행의 수다!</Text>
        <Text style={styles.titleLine2}>실시간 타비톡</Text>
      </View>

      {/* 게시글 카드 */}
      <View style={styles.cardList}>
        {loading && posts.length === 0 ? (
          <ActivityIndicator color={colors.primary} style={{ paddingVertical: 24 }} />
        ) : posts.length === 0 ? (
          <Text style={styles.empty}>아직 게시글이 없어요</Text>
        ) : (
          posts.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={onPressTaviTalk}
              activeOpacity={0.8}
            >
              {/* 작성자 행 */}
              <View style={styles.authorRow}>
                {item.profile_image_url ? (
                  <Image
                    source={{ uri: item.profile_image_url }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={[styles.avatar, { backgroundColor: avatarColor(item.nickname) }]} />
                )}
                <Text style={styles.nickname}>{item.nickname}</Text>
                <Text style={styles.date}>{formatDate(item.created_at)}</Text>
              </View>

              {/* 내용 */}
              <Text style={styles.content} numberOfLines={2}>{item.content}</Text>

              {/* 메타 */}
              <View style={styles.metaRow}>
                <Text style={styles.categoryLabel}>
                  {CATEGORY_LABEL[item.category ?? ""] ?? "자유게시판"}
                </Text>
                <View style={styles.metaRight}>
                  <View style={styles.metaItem}>
                    <Ionicons name="heart" size={12} color={colors.primary} />
                    <Text style={styles.metaNum}>{item.likesCount}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="chatbubble-ellipses" size={12} color={colors.neutral500} />
                    <Text style={styles.metaNum}>{item.commentsCount}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* 타비톡 바로가기 */}
      <TouchableOpacity style={styles.moreBtn} onPress={onPressTaviTalk} activeOpacity={0.7}>
        <Text style={styles.moreBtnText}>타비톡 바로가기</Text>
        <Ionicons name="chevron-forward" size={13} color={colors.textTertiary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.sm,
  },

  // Figma: 섹션 타이틀 두 줄 (x=15, y=10 내부 frame y=10)
  titleBlock: {
    paddingHorizontal: spacing.md,
    paddingTop: 20,
    paddingBottom: 14,
  },
  titleLine1: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: -0.3,
    lineHeight: 22,
  },
  titleLine2: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: -0.3,
    lineHeight: 22,
  },

  cardList: {
    paddingHorizontal: spacing.md,
  },

  // 게시글 목록 — 카드 대신 구분선으로만 분리
  card: {
    paddingVertical: spacing.md,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },

  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.neutral200,
  },
  nickname: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  date: {
    fontSize: 10,
    color: colors.neutral300,
    fontWeight: "500",
  },

  content: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryLabel: {
    fontSize: 11,
    color: colors.neutral300,
    fontWeight: "600",
  },
  metaRight: {
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
    fontWeight: "700",
    color: colors.neutral500,
  },

  // 타비톡 바로가기 (Figma: x=110.5, centered)
  moreBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 4,
  },
  moreBtnText: {
    fontSize: 13,
    color: colors.textTertiary,
    fontWeight: "600",
  },

  empty: {
    fontSize: 13,
    color: colors.textTertiary,
    textAlign: "center",
    paddingVertical: 24,
  },
});
