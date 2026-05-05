import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius } from "@/styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ── Types ──────────────────────────────────────────────────────

export type PostType = {
  id: number;
  user_id: number;
  title?: string;
  content?: string;
  created_at?: string;
  image_url?: string | null;
  image_urls?: string[] | null;
  likes?: number;
  nickname?: string;
  profile_image_url?: string | null;
  category?: string;
};

export type CommentType = {
  id: number;
  post_id: number;
  user_id?: number | null;
  content?: string | null;
  created_at?: string | null;
  nickname?: string | null;
  profile_image?: string | null;
};

// ── Helpers ───────────────────────────────────────────────────

function formatRelativeDate(dateStr?: string | null): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "방금";
  if (min < 60) return `${min}분전`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}시간전`;
  const d = new Date(dateStr);
  return `${String(d.getFullYear()).slice(2)}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

const AVATAR_COLORS = ["#E8B4A0", "#A0C4E8", "#A0E8B4", "#C4A0E8", "#E8D4A0", "#A0B4E8"];
function avatarColor(seed?: string | null): string {
  if (!seed) return AVATAR_COLORS[0];
  return AVATAR_COLORS[seed.charCodeAt(0) % AVATAR_COLORS.length];
}

function Avatar({ uri, name, size = 36 }: { uri?: string | null; name?: string | null; size?: number }) {
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
    );
  }
  return (
    <View
      style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: avatarColor(name) }}
    />
  );
}

// ── Props ──────────────────────────────────────────────────────

type Props = {
  post: PostType | null;
  images: string[];
  comments: CommentType[];
  likesCount: number | null;
  loading: boolean;
  isMyPost: boolean;
  currentUserId?: number;
  input: string;
  submittingComment: boolean;
  onInputChange: (text: string) => void;
  onSubmitComment: () => void;
  onToggleLike: () => void;
  onGoBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDeleteComment: (commentId: number) => void;
  onReport: (reason: string) => void;
};

// ── Main View ─────────────────────────────────────────────────

export default function TaviTalkPostDetailView({
  post,
  images,
  comments,
  likesCount,
  loading,
  isMyPost,
  currentUserId,
  input,
  submittingComment,
  onInputChange,
  onSubmitComment,
  onToggleLike,
  onGoBack,
  onEdit,
  onDelete,
  onDeleteComment,
  onReport,
}: Props) {
  const insets = useSafeAreaInsets();

  const showReportSheet = () => {
    Alert.alert("신고 사유를 선택해주세요", "", [
      { text: "스팸", onPress: () => onReport("스팸") },
      { text: "욕설/혐오", onPress: () => onReport("욕설/혐오") },
      { text: "음란물", onPress: () => onReport("음란물") },
      { text: "기타", onPress: () => onReport("기타") },
      { text: "취소", style: "cancel" },
    ]);
  };

  const confirmDelete = () => {
    Alert.alert("게시글 삭제", "정말 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      { text: "삭제", style: "destructive", onPress: onDelete },
    ]);
  };

  const confirmDeleteComment = (commentId: number) => {
    Alert.alert("댓글 삭제", "정말 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      { text: "삭제", style: "destructive", onPress: () => onDeleteComment(commentId) },
    ]);
  };

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
          {isMyPost ? (
            <>
              <TouchableOpacity onPress={onEdit}>
                <Text style={styles.headerAction}>수정</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmDelete}>
                <Text style={[styles.headerAction, { color: colors.danger }]}>삭제</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity onPress={showReportSheet}>
              <Text style={[styles.headerAction, { color: colors.neutral500 }]}>신고</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* 게시글 본문 */}
          <View style={styles.postSection}>
            <View style={styles.authorRow}>
              <Avatar uri={post?.profile_image_url} name={post?.nickname} size={36} />
              <View style={styles.authorInfo}>
                <Text style={styles.authorName}>{post?.nickname ?? "익명"}</Text>
              </View>
              <Text style={styles.postDate}>{formatRelativeDate(post?.created_at)}</Text>
            </View>

            {post?.title ? <Text style={styles.postTitle}>{post.title}</Text> : null}
            <Text style={styles.postContent}>{post?.content}</Text>

            {images.map((uri, i) => (
              <Image key={i} source={{ uri }} style={styles.postImage} resizeMode="cover" />
            ))}

            <View style={styles.postMetaRow}>
              <Text style={styles.categoryLabel}>{post?.category ?? ""}</Text>
              <View style={styles.metaGroup}>
                <TouchableOpacity style={styles.metaItem} onPress={onToggleLike}>
                  <Ionicons name="heart" size={14} color={colors.primary} />
                  <Text style={styles.metaNum}>{likesCount ?? 0}</Text>
                </TouchableOpacity>
                <View style={styles.metaItem}>
                  <Ionicons name="chatbubble-ellipses" size={14} color={colors.neutral500} />
                  <Text style={styles.metaNum}>{comments.length}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* 댓글 목록 */}
          <View style={styles.commentsSection}>
            {comments.length === 0 && (
              <Text style={styles.noComment}>첫 번째 댓글을 남겨보세요!</Text>
            )}
            {comments.map((comment) => {
              const isMyComment = !!currentUserId && comment.user_id === currentUserId;
              return (
                <View key={comment.id} style={styles.commentItem}>
                  <Avatar uri={comment.profile_image} name={comment.nickname} size={28} />
                  <View style={styles.commentBody}>
                    <View style={styles.commentTopRow}>
                      <Text style={styles.commentAuthor}>{comment.nickname ?? "익명"}</Text>
                      <Text style={styles.commentDate}>{formatRelativeDate(comment.created_at)}</Text>
                    </View>
                    <Text style={styles.commentContent}>{comment.content}</Text>
                    {isMyComment && (
                      <TouchableOpacity onPress={() => confirmDeleteComment(comment.id)}>
                        <Text style={styles.deleteComment}>삭제</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}

      {/* 댓글 입력창 */}
      <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            placeholder="댓글을 남겨주세요."
            placeholderTextColor={colors.neutral500}
            value={input}
            onChangeText={onInputChange}
            onSubmitEditing={onSubmitComment}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || submittingComment) && styles.sendBtnDisabled]}
            onPress={onSubmitComment}
            disabled={!input.trim() || submittingComment}
          >
            {submittingComment ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons
                name="arrow-up"
                size={18}
                color={input.trim() ? colors.textWhite : colors.neutral500}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// ── Styles ────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },

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

  loadingWrap: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: { paddingBottom: 24 },

  postSection: {
    paddingHorizontal: spacing.md,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 12,
  },
  authorRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  authorInfo: { flex: 1 },
  authorName: { fontSize: 14, fontWeight: "600", color: colors.textPrimary },
  postDate: { fontSize: 10, color: colors.neutral300, fontWeight: "600" },
  postTitle: { fontSize: 16, fontWeight: "700", color: colors.textPrimary },
  postContent: { fontSize: 14, color: colors.textSecondary, lineHeight: 22 },
  postImage: { width: "100%", height: 200, borderRadius: radius.md },

  postMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  categoryLabel: { fontSize: 11, fontWeight: "700", color: colors.neutral300 },
  metaGroup: { flexDirection: "row", gap: 10 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaNum: { fontSize: 12, fontWeight: "700", color: colors.neutral500 },

  divider: { height: 8, backgroundColor: colors.neutral100 },

  commentsSection: { paddingHorizontal: spacing.md, paddingTop: 8 },
  noComment: {
    textAlign: "center",
    color: colors.neutral300,
    fontSize: 13,
    paddingVertical: 24,
  },
  commentItem: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  commentBody: { flex: 1, gap: 4 },
  commentTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  commentAuthor: { fontSize: 14, fontWeight: "600", color: colors.textPrimary },
  commentDate: { fontSize: 10, color: colors.neutral300, fontWeight: "600" },
  commentContent: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
  deleteComment: { fontSize: 10, fontWeight: "600", color: colors.danger, marginTop: 2 },

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
  input: { flex: 1, fontSize: 14, color: colors.textPrimary, paddingVertical: 4 },
  sendBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  sendBtnDisabled: { backgroundColor: colors.neutral200 },
});
