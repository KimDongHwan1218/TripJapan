import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius } from "@/styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ── Mock Data ─────────────────────────────────────────────────

const MOCK_POST = {
  author: "사사봉봉",
  avatarColor: "#E8B4A0",
  date: "26.03.12",
  category: "자유게시판",
  content:
    "오늘 도톤보리에서 지갑 주우신분 ㅠㅠ\n핑크색 입생로랑 지갑이예요...\n산지 얼마 안됐는데 도톤보리 거리에서\n쇼핑한 물건 정리하느라\n그 다리쪽에서 잃어버린 것 같아요\n분명 그전엔 있었거든요.\n\n못 찾을거 알지만 그래도 혹시나 여쭤봐요 ㅠㅠㅠㅠ",
  likes: 12,
  comments: 3,
};

const MOCK_COMMENTS = [
  {
    id: 1,
    author: "바람의검신",
    avatarColor: "#A0C4E8",
    date: "2분전",
    content:
      "앗 사사봉봉님 저 방금 그 다리위에\n핑크색 입생로랑 지갑 올려진거 봤어요!!\n지금 얼른 가보세요!!",
    replies: [
      {
        id: 11,
        author: "사사봉봉",
        avatarColor: "#E8B4A0",
        date: "지금",
        content: "바람의 검신님 너무 감사해요 ㅠㅠㅠ\n지금 바로 찾았어요!!",
      },
    ],
  },
];

// ── Sub Components ────────────────────────────────────────────

function Avatar({ color, size = 36 }: { color: string; size?: number }) {
  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
      ]}
    />
  );
}

// ── Props ─────────────────────────────────────────────────────

type Props = {
  isMyPost?: boolean;
  onGoBack?: () => void;
};

// ── Main View ─────────────────────────────────────────────────

export default function TaviTalkPostDetailView({ isMyPost = false, onGoBack }: Props) {
  const insets = useSafeAreaInsets();
  const [input, setInput] = useState("");

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
        {isMyPost && (
          <View style={styles.headerActions}>
            <TouchableOpacity>
              <Text style={styles.headerAction}>수정</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={[styles.headerAction, { color: colors.danger }]}>삭제</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 게시글 본문 */}
        <View style={styles.postSection}>
          {/* 작성자 */}
          <View style={styles.authorRow}>
            <Avatar color={MOCK_POST.avatarColor} size={36} />
            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>{MOCK_POST.author}</Text>
            </View>
            <Text style={styles.postDate}>{MOCK_POST.date}</Text>
          </View>

          {/* 본문 */}
          <Text style={styles.postContent}>{MOCK_POST.content}</Text>

          {/* 메타 (카테고리 + 좋아요/댓글) */}
          <View style={styles.postMetaRow}>
            <Text style={styles.categoryLabel}>{MOCK_POST.category}</Text>
            <View style={styles.metaGroup}>
              <TouchableOpacity style={styles.metaItem}>
                <Ionicons name="heart" size={14} color={colors.primary} />
                <Text style={styles.metaNum}>{MOCK_POST.likes}</Text>
              </TouchableOpacity>
              <View style={styles.metaItem}>
                <Ionicons name="chatbubble-ellipses" size={14} color={colors.neutral500} />
                <Text style={styles.metaNum}>{MOCK_POST.comments}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 구분선 */}
        <View style={styles.divider} />

        {/* 댓글 목록 */}
        <View style={styles.commentsSection}>
          {MOCK_COMMENTS.map((comment) => (
            <View key={comment.id}>
              {/* 댓글 */}
              <View style={styles.commentItem}>
                <Avatar color={comment.avatarColor} size={28} />
                <View style={styles.commentBody}>
                  <View style={styles.commentTopRow}>
                    <Text style={styles.commentAuthor}>{comment.author}</Text>
                    <Text style={styles.commentDate}>{comment.date}</Text>
                  </View>
                  <Text style={styles.commentContent}>{comment.content}</Text>
                  <View style={styles.commentActions}>
                    <TouchableOpacity>
                      <Text style={styles.replyBtn}>답글달기</Text>
                    </TouchableOpacity>
                    {isMyPost && (
                      <TouchableOpacity>
                        <Text style={[styles.replyBtn, { color: colors.danger }]}>삭제</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>

              {/* 대댓글 */}
              {comment.replies.map((reply) => (
                <View key={reply.id} style={styles.replyItem}>
                  <Avatar color={reply.avatarColor} size={24} />
                  <View style={styles.commentBody}>
                    <View style={styles.commentTopRow}>
                      <Text style={styles.commentAuthor}>{reply.author}</Text>
                      <Text style={styles.commentDate}>{reply.date}</Text>
                    </View>
                    <Text style={styles.commentContent}>{reply.content}</Text>
                    <View style={styles.commentActions}>
                      <TouchableOpacity>
                        <Text style={styles.replyBtn}>답글달기</Text>
                      </TouchableOpacity>
                      {isMyPost && (
                        <>
                          <TouchableOpacity>
                            <Text style={styles.replyBtn}>수정</Text>
                          </TouchableOpacity>
                          <TouchableOpacity>
                            <Text style={[styles.replyBtn, { color: colors.danger }]}>삭제</Text>
                          </TouchableOpacity>
                        </>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* 댓글 입력창 */}
      <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            placeholder="댓글을 남겨주세요."
            placeholderTextColor={colors.neutral500}
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity style={styles.sendBtn} disabled={!input.trim()}>
            <Ionicons
              name="arrow-up"
              size={18}
              color={input.trim() ? colors.textWhite : colors.neutral500}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// ── Styles ────────────────────────────────────────────────────

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
  backBtn: {
    padding: 4,
  },
  headerActions: {
    flexDirection: "row",
    gap: 16,
  },
  headerAction: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
  },

  scrollContent: {
    paddingBottom: 24,
  },

  // Post
  postSection: {
    paddingHorizontal: spacing.md,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 14,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {},
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  postDate: {
    fontSize: 10,
    color: colors.neutral300,
    fontWeight: "600",
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
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.neutral300,
  },
  metaGroup: {
    flexDirection: "row",
    gap: 10,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaNum: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.neutral500,
  },

  // Divider
  divider: {
    height: 8,
    backgroundColor: colors.neutral100,
  },

  // Comments
  commentsSection: {
    paddingHorizontal: spacing.md,
    paddingTop: 8,
  },
  commentItem: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  replyItem: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 12,
    paddingLeft: 38,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  commentBody: {
    flex: 1,
    gap: 6,
  },
  commentTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  commentAuthor: {
    fontSize: 14,
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
  commentActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 2,
  },
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
});
