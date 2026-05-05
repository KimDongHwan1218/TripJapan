import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CommunityStackParamList } from "@/navigation/CommunityStackNavigator";
import { layout, colors, spacing, radius, typography } from "@/styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCommunity } from "@/contexts/CommunityContext";
import { selectHotPosts } from "./utils/postSelectors";
import type { Post } from "@/contexts/CommunityContext";

type NavProp = NativeStackNavigationProp<CommunityStackParamList>;

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("ko-KR", { month: "2-digit", day: "2-digit" }).replace(". ", ".").replace(".", "");
  } catch {
    return "";
  }
}

function HotPostItem({ post, rank, onPress }: { post: Post; rank: number; onPress: () => void }) {
  const isTop3 = rank <= 3;
  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.75}>
      {/* 순위 배지 */}
      <View style={[styles.rankBadge, isTop3 && styles.rankBadgeTop]}>
        <Text style={[styles.rankText, isTop3 && styles.rankTextTop]}>{rank}</Text>
      </View>

      {/* 본문 */}
      <View style={styles.itemBody}>
        <View style={styles.itemTopRow}>
          {post.category ? (
            <View style={styles.categoryChip}>
              <Text style={styles.categoryChipText}>
                {post.category === "free" ? "자유" :
                 post.category === "review" ? "여행후기" :
                 post.category === "question" ? "Q&A" :
                 post.category === "food" ? "맛집" :
                 post.category === "shopping" ? "쇼핑" : post.category}
              </Text>
            </View>
          ) : null}
          <Text style={styles.date}>{formatDate(post.created_at)}</Text>
        </View>

        <Text style={styles.title} numberOfLines={2}>{post.title}</Text>

        <View style={styles.metaRow}>
          <Ionicons name="heart" size={12} color={colors.primary} />
          <Text style={styles.metaNum}>{post.likesCount}</Text>
          <Ionicons name="chatbubble-ellipses" size={12} color={colors.neutral500} />
          <Text style={styles.metaNum}>{post.commentsCount}</Text>
          <Ionicons name="eye-outline" size={12} color={colors.neutral500} />
          <Text style={styles.metaNum}>{post.views ?? 0}</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={16} color={colors.neutral300} />
    </TouchableOpacity>
  );
}

export default function HotPostsScreen() {
  const navigation = useNavigation<NavProp>();
  const insets = useSafeAreaInsets();
  const { getPosts } = useCommunity();
  const allPosts = getPosts("전체");
  const hotPosts = selectHotPosts(allPosts, 100);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTextBox}>
          <Text style={styles.headerTitle}>실시간 인기글</Text>
          <Text style={styles.headerSub}>지금 가장 뜨거운 게시글</Text>
        </View>
      </View>

      {/* 배너 */}
      <View style={styles.banner}>
        <Ionicons name="flame" size={18} color={colors.warning} />
        <Text style={styles.bannerText}>
          좋아요 · 댓글 · 조회수로 집계된 실시간 인기글입니다
        </Text>
      </View>

      <FlatList
        data={hotPosts}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="flame-outline" size={44} color={colors.neutral300} />
            <Text style={styles.emptyTitle}>아직 인기글이 없어요</Text>
            <Text style={styles.emptyDesc}>게시글에 좋아요와 댓글을 남겨보세요!</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <HotPostItem
            post={item}
            rank={index + 1}
            onPress={() => navigation.navigate("PostDetailScreen", { postId: item.id })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...layout.screen },

  // 헤더
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    gap: spacing.sm,
  },
  backBtn: { padding: 4 },
  headerTextBox: { gap: 2 },
  headerTitle: { fontSize: 17, fontWeight: "700", color: colors.textPrimary },
  headerSub: { fontSize: 12, color: colors.textTertiary },

  // 배너
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.neutral100,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  bannerText: { fontSize: 12, color: colors.textTertiary, flex: 1 },

  listContent: { paddingBottom: spacing.xl },

  // 아이템
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    backgroundColor: colors.surface,
  },

  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: radius.xs,
    backgroundColor: colors.neutral100,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  rankBadgeTop: { backgroundColor: colors.primarySoft },
  rankText: { fontSize: 14, fontWeight: "800", color: colors.textTertiary },
  rankTextTop: { color: colors.primary },

  itemBody: { flex: 1, gap: 6 },

  itemTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  categoryChip: {
    backgroundColor: colors.neutral100,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  categoryChipText: { fontSize: 11, fontWeight: "600", color: colors.textTertiary },

  date: { ...typography.caption, color: colors.neutral300 },

  title: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
    lineHeight: 20,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  metaNum: { fontSize: 12, fontWeight: "600", color: colors.neutral500, marginRight: spacing.xs },

  // 빈 상태
  empty: {
    alignItems: "center",
    marginTop: 80,
    gap: spacing.sm,
  },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: colors.textSecondary },
  emptyDesc: { fontSize: 13, color: colors.textTertiary },
});
