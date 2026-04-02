import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header/Header";
import { colors, spacing, radius } from "@/styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SCREEN_WIDTH = Dimensions.get("window").width;

type PostType = {
  id: number;
  user_id: number;
  title?: string;
  content?: string;
  created_at?: string;
  image_url?: string | null;
  image_urls?: string[] | null;
  views?: number;
  likes?: number;
};

type CommentType = {
  id: number;
  post_id: number;
  user_id?: number | null;
  content?: string | null;
  created_at?: string | null;
};

type Props = {
  post: PostType | null;
  images: string[];
  comments: CommentType[];
  likesCount: number | null;
  loading: boolean;
  submittingComment: boolean;
  input: string;
  onInputChange: (text: string) => void;
  onSubmitComment: () => void;
  onToggleLike: () => void;
  onGoBack: () => void;
};

function GenericAvatar({ size = 32 }: { size?: number }) {
  return (
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

export default function PostDetailView({
  post,
  images,
  comments,
  likesCount,
  loading,
  submittingComment,
  input,
  onInputChange,
  onSubmitComment,
  onToggleLike,
  onGoBack,
}: Props) {
  const insets = useSafeAreaInsets();

  if (loading || !post) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const dateStr = post.created_at
    ? new Date(post.created_at).toLocaleDateString("ko-KR", {
        year: "2-digit", month: "2-digit", day: "2-digit",
      })
    : "";

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={insets.top}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => Alert.alert("준비 중입니다")}>
            <Text style={styles.headerAction}>수정</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Alert.alert("준비 중입니다")}>
            <Text style={[styles.headerAction, { color: colors.danger }]}>삭제</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 게시글 본문 */}
        <View style={styles.postSection}>
          {/* 작성자 */}
          <View style={styles.authorRow}>
            <GenericAvatar size={36} />
            <Text style={styles.authorName}>사용자 {post.user_id}</Text>
            <Text style={styles.postDate}>{dateStr}</Text>
          </View>

          {/* 이미지 */}
          {images.length > 0 && (
            <FlatList
              data={images}
              keyExtractor={(uri, idx) => `${post.id}-${idx}`}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <Image source={{ uri: item }} style={styles.image} resizeMode="cover" />
              )}
              style={styles.imageList}
            />
          )}

          {/* 제목 */}
          {post.title ? (
            <Text style={styles.postTitle}>{post.title}</Text>
          ) : null}

          {/* 본문 */}
          <Text style={styles.postContent}>{post.content ?? ""}</Text>

          {/* 메타 */}
          <View style={styles.postMetaRow}>
            <Text style={styles.categoryLabel}>게시글</Text>
            <View style={styles.metaGroup}>
              <TouchableOpacity style={styles.metaItem} onPress={onToggleLike}>
                <Ionicons name="heart" size={14} color={colors.primary} />
                <Text style={styles.metaNum}>{likesCount ?? 0}</Text>
              </TouchableOpacity>
              <View style={styles.metaItem}>
                <Ionicons name="chatbubble-ellipses" size={14} color={colors.neutral500} />
                <Text style={styles.metaNum}>{comments.length}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="eye-outline" size={14} color={colors.neutral500} />
                <Text style={styles.metaNum}>{post.views ?? 0}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 구분선 */}
        <View style={styles.divider} />

        {/* 댓글 목록 */}
        <View style={styles.commentsSection}>
          <Text style={styles.commentsHeader}>댓글 ({comments.length})</Text>
          {comments.map((c) => {
            const commentDate = c.created_at
              ? new Date(c.created_at).toLocaleDateString("ko-KR", {
                  year: "2-digit", month: "2-digit", day: "2-digit",
                })
              : "";
            return (
              <View key={c.id} style={styles.commentItem}>
                <GenericAvatar size={28} />
                <View style={styles.commentBody}>
                  <View style={styles.commentTopRow}>
                    <Text style={styles.commentAuthor}>사용자 {c.user_id ?? "-"}</Text>
                    <Text style={styles.commentDate}>{commentDate}</Text>
                  </View>
                  <Text style={styles.commentContent}>{c.content}</Text>
                  <View style={styles.commentActions}>
                    <TouchableOpacity onPress={() => Alert.alert("준비 중입니다")}>
                      <Text style={styles.replyBtn}>답글달기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Alert.alert("준비 중입니다")}>
                      <Text style={[styles.replyBtn, { color: colors.danger }]}>삭제</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* 댓글 입력창 */}
      <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={styles.inputWrap}>
          <TextInput
            placeholder="댓글을 남겨주세요."
            placeholderTextColor={colors.neutral500}
            style={styles.input}
            value={input}
            onChangeText={onInputChange}
            editable={!submittingComment}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
            onPress={onSubmitComment}
            disabled={submittingComment || !input.trim()}
          >
            {submittingComment ? (
              <ActivityIndicator size="small" color={colors.textWhite} />
            ) : (
              <Ionicons name="arrow-up" size={18} color={colors.textWhite} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  headerActions: { flexDirection: "row", gap: 16 },
  headerAction: { fontSize: 14, fontWeight: "600", color: colors.textSecondary },

  scrollContent: { paddingBottom: 24 },

  // Post
  postSection: {
    paddingHorizontal: spacing.md,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 12,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  authorName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  postDate: {
    fontSize: 10,
    color: colors.neutral300,
    fontWeight: "600",
  },
  imageList: {
    maxHeight: 260,
    borderRadius: radius.md,
    overflow: "hidden",
  },
  image: {
    width: SCREEN_WIDTH - spacing.md * 2,
    height: 260,
    borderRadius: radius.md,
  },
  postTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.textPrimary,
    lineHeight: 24,
  },
  postContent: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  postMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.neutral300,
  },
  metaGroup: { flexDirection: "row", gap: 12 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaNum: { fontSize: 12, fontWeight: "700", color: colors.neutral500 },

  // Divider
  divider: { height: 8, backgroundColor: colors.neutral100 },

  // Comments
  commentsSection: {
    paddingHorizontal: spacing.md,
    paddingTop: 12,
  },
  commentsHeader: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  commentItem: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  commentBody: { flex: 1, gap: 6 },
  commentTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  commentAuthor: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  commentDate: {
    fontSize: 10,
    color: colors.neutral300,
    fontWeight: "600",
  },
  commentContent: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  commentActions: { flexDirection: "row", gap: 12, marginTop: 2 },
  replyBtn: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.neutral300,
  },

  // Input Bar
  inputBar: {
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 4,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.neutral100,
    borderRadius: 20,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    paddingVertical: 4,
  },
  sendBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  sendBtnDisabled: {
    backgroundColor: colors.neutral300,
  },
});
