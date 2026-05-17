import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header/Header";
import { layout, colors, spacing, typography, radius } from "@/styles";
import type { Post } from "@/contexts/CommunityContext";

type Props = {
  posts: Post[];
  loading: boolean;
  error: string | null;
  onPressPost: (postId: number) => void;
  onGoBack: () => void;
  onRefresh: () => void;
};

export default function MyPostsView({
  posts,
  loading,
  error,
  onPressPost,
  onGoBack,
  onRefresh,
}: Props) {
  return (
    <View style={styles.container}>
      <Header backwardButton="simple" title="내가 쓴 글" />

      {loading && posts.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={onRefresh}>
            <Text style={styles.retryText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onRefresh} tintColor={colors.primary} />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="document-text-outline" size={48} color={colors.neutral300} />
              <Text style={styles.emptyText}>아직 작성한 게시글이 없어요</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => onPressPost(item.id)}>
              <View style={styles.cardTop}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>
                    {item.category === "free" ? "자유" : item.category === "review" ? "리뷰" : "질문"}
                  </Text>
                </View>
                <Text style={styles.date}>
                  {item.created_at ? new Date(item.created_at).toLocaleDateString("ko-KR") : ""}
                </Text>
              </View>

              <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.preview} numberOfLines={2}>{item.content}</Text>

              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Ionicons name="heart-outline" size={14} color={colors.textTertiary} />
                  <Text style={styles.metaText}>{item.likesCount ?? 0}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="chatbubble-outline" size={14} color={colors.textTertiary} />
                  <Text style={styles.metaText}>{item.commentsCount ?? 0}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="eye-outline" size={14} color={colors.textTertiary} />
                  <Text style={styles.metaText}>{item.views ?? 0}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...layout.screen },
  content: { padding: spacing.lg, gap: spacing.md },
  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: spacing.md },

  empty: { alignItems: "center", marginTop: 80, gap: spacing.sm },
  emptyText: { ...typography.body, color: colors.textTertiary },

  errorText: { ...typography.body, color: colors.danger },
  retryBtn: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, backgroundColor: colors.primary, borderRadius: radius.sm },
  retryText: { color: colors.textWhite, fontWeight: "600" },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  cardTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },

  categoryBadge: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  categoryText: { fontSize: 11, fontWeight: "600", color: colors.primary },

  date: { ...typography.caption, color: colors.textTertiary },

  title: { fontSize: 15, fontWeight: "700", color: colors.textPrimary, lineHeight: 22 },
  preview: { ...typography.body, color: colors.textSecondary, lineHeight: 20 },

  metaRow: { flexDirection: "row", gap: spacing.md, marginTop: spacing.xs },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { ...typography.caption, color: colors.textTertiary },
});
