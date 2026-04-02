import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius } from "@/styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ── Mock Data ─────────────────────────────────────────────────

const HOT_POSTS = [
  {
    id: 1,
    author: "사사봉봉",
    avatarColor: "#E8B4A0",
    content: "오늘 도톤보리에서 지갑 주우신분 ㅠㅠ\n핑크색 입생로랑 지갑이예요...",
    date: "26.03.11",
    category: "자유게시판",
    likes: 12,
    comments: 3,
  },
  {
    id: 2,
    author: "나는문어",
    avatarColor: "#A0C4E8",
    content: "같이 사진찍거나 맛집 카메 가실분 구해요\n내일 하루만~~",
    date: "26.03.11",
    category: "자유게시판",
    likes: 12,
    comments: 3,
  },
  {
    id: 3,
    author: "울트라레나니아",
    avatarColor: "#B4E8A0",
    content: "울트라비 거리 다녀왔어요.\n별맛있는데 울트라비 동상 보니까 마음이 벅차네요♥",
    date: "26.03.11",
    category: "여행후기",
    likes: 15,
    comments: 4,
  },
];

const FEED_POSTS = [
  {
    id: 1,
    author: "안아름",
    avatarColor: "#E8B4A0",
    content: "같이 사진찍거나 맛집 카메 가실분 구해요\n내일 하루만~~",
    date: "26.03.12",
    category: "자유게시판",
    likes: 12,
    comments: 3,
    image: null,
  },
  {
    id: 2,
    author: "나는문어",
    avatarColor: "#A0C4E8",
    content: "3일의 오사카 다녀왔어요. (6번째 오사카 ㅋㅋ)\n6번 가는동안 진짜 빠뜨리지 않고 방문했던 곳 리스트 정리해 드려요! 어디서도 찾을 수 없는 꿀팁",
    date: "26.03.12",
    category: "여행후기",
    likes: 41,
    comments: 23,
    image: null,
  },
  {
    id: 3,
    author: "울트라레나니아",
    avatarColor: "#B4E8A0",
    content: "울트라비 거리 다녀왔어요.\n별맛있는데 울트라비 동상 보니까 마음이 벅차네요♥",
    date: "26.03.12",
    category: "여행후기",
    likes: 15,
    comments: 4,
    image: "placeholder",
  },
  {
    id: 4,
    author: "실락절락",
    avatarColor: "#E8E0A0",
    content: "오사카에 새긴 잊혀지지 않는 사물이에요.\n이런 여행사진 공유해봅니다.",
    date: "26.03.12",
    category: "여행후기",
    likes: 22,
    comments: 3,
    image: "placeholder",
  },
  {
    id: 5,
    author: "조아해",
    avatarColor: "#C4A0E8",
    content: "오사카 피규어 살 공유해요!\n진짜 좋은 퀄리티고 가격도 나쁘지 않아요!\n완전 추천합니다",
    date: "26.03.12",
    category: "맛집 추천",
    likes: 24,
    comments: 31,
    image: null,
  },
];

const CATEGORIES = [
  "자유게시판",
  "여행후기",
  "질문 Q&A",
  "맛집 추천",
  "대니 시기",
  "쇼핑",
];

// ── Sub Components ────────────────────────────────────────────

function Avatar({
  color,
  size = 36,
}: {
  color: string;
  size?: number;
}) {
  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
      ]}
    />
  );
}

function HotPostCard({ post }: { post: (typeof HOT_POSTS)[0] }) {
  return (
    <TouchableOpacity style={styles.hotCard} activeOpacity={0.8}>
      <View style={styles.hotCardHeader}>
        <Avatar color={post.avatarColor} size={26} />
        <Text style={styles.hotCardAuthor}>{post.author}</Text>
        <Text style={styles.hotCardDate}>{post.date}</Text>
      </View>
      <Text style={styles.hotCardContent} numberOfLines={3}>
        {post.content}
      </Text>
      <View style={styles.hotCardFooter}>
        <Text style={styles.categoryLabel}>{post.category}</Text>
        <View style={styles.metaRow}>
          <Ionicons name="heart" size={11} color={colors.primary} />
          <Text style={styles.metaNum}>{post.likes}</Text>
          <Ionicons name="chatbubble-ellipses" size={11} color={colors.neutral500} style={{ marginLeft: 6 }} />
          <Text style={styles.metaNum}>{post.comments}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function FeedItem({ post }: { post: (typeof FEED_POSTS)[0] }) {
  return (
    <TouchableOpacity style={styles.feedItem} activeOpacity={0.8}>
      <Avatar color={post.avatarColor} size={36} />
      <View style={styles.feedBody}>
        <View style={styles.feedTopRow}>
          <Text style={styles.feedAuthor}>{post.author}</Text>
          <Text style={styles.feedDate}>{post.date}</Text>
        </View>
        <Text style={styles.feedContent}>{post.content}</Text>
        {post.image === "placeholder" && (
          <View style={styles.feedImagePlaceholder}>
            <Ionicons name="image-outline" size={32} color={colors.neutral300} />
          </View>
        )}
        <View style={styles.feedMetaRow}>
          <Text style={styles.feedCategory}>{post.category}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="heart" size={11} color={colors.primary} />
            <Text style={styles.metaNum}>{post.likes}</Text>
            <Ionicons name="chatbubble-ellipses" size={11} color={colors.neutral500} style={{ marginLeft: 6 }} />
            <Text style={styles.metaNum}>{post.comments}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ── Main View ─────────────────────────────────────────────────

export default function TaviTalkHomeView() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>tabi</Text>
        <View style={styles.headerRight}>
          <Avatar color="#E8B4A0" size={32} />
          <TouchableOpacity style={styles.writeBtn} activeOpacity={0.8}>
            <Text style={styles.writeBtnText}>글쓰기</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 이번주 인기글 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>타비톡 이번주 인기글</Text>
          <FlatList
            data={HOT_POSTS}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.hotListContent}
            renderItem={({ item }) => <HotPostCard post={item} />}
          />
        </View>

        {/* 카테고리 탭 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryTabsContent}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat} style={styles.categoryTab} activeOpacity={0.7}>
              <Text style={styles.categoryTabText}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 내 글 보기 */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>내 글 보기</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>내 글 모두보기 &gt;</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.myPostCard} activeOpacity={0.8}>
            <View style={styles.myPostTop}>
              <Text style={styles.myPostDate}>26.03.11</Text>
              <View style={styles.metaRow}>
                <Ionicons name="heart" size={11} color={colors.primary} />
                <Text style={styles.metaNum}>12</Text>
                <Ionicons name="chatbubble-ellipses" size={11} color={colors.neutral500} style={{ marginLeft: 6 }} />
                <Text style={styles.metaNum}>3</Text>
              </View>
            </View>
            <Text style={styles.myPostContent} numberOfLines={2}>
              같이 사진찍거나 맛집 카메 가실분 구해요{"\n"}내일 하루만~~
            </Text>
            <Text style={styles.categoryLabel}>자유게시판</Text>
          </TouchableOpacity>
        </View>

        {/* 실시간 타비톡 피드 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>지금 바로{"\n"}실시간 타비톡</Text>
          {FEED_POSTS.map((post) => (
            <FeedItem key={post.id} post={post} />
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
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
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    backgroundColor: colors.neutral300,
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

  // Section
  section: {
    marginTop: 24,
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

  // My Post Card
  myPostCard: {
    backgroundColor: colors.neutral100,
    borderRadius: radius.lg,
    padding: 14,
    gap: 8,
  },
  myPostTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  myPostDate: {
    fontSize: 10,
    color: colors.neutral300,
    fontWeight: "600",
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
  feedImagePlaceholder: {
    height: 160,
    borderRadius: radius.md,
    backgroundColor: colors.neutral100,
    justifyContent: "center",
    alignItems: "center",
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
});
