import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  RefreshControl,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/styles";
import type { Post } from "@/contexts/CommunityContext";

// ── 카테고리 보드 ─────────────────────────────────────────────────────────
const BOARDS = [
  { key: "free",     label: "자유게시판", icon: "chatbubbles"   as const, color: "#F4B400", bg: "#FFF8E1" },
  { key: "review",   label: "여행후기",   icon: "trail-sign"    as const, color: "#4285F4", bg: "#E8F0FE" },
  { key: "question", label: "질문 Q&A",   icon: "help-circle"   as const, color: "#9C27B0", bg: "#F3E5F5" },
  { key: "food",     label: "맛집 추천",  icon: "restaurant"    as const, color: "#FF5722", bg: "#FBE9E7" },
  { key: "info",     label: "애니 성지",  icon: "star"          as const, color: "#00897B", bg: "#E0F2F1" },
  { key: "shopping", label: "쇼핑 성지",  icon: "bag-handle"    as const, color: "#E91E63", bg: "#FCE4EC" },
];

// ── tabi 로고 — 텍스트 + 빨간 점 ────────────────────────────────────────
function TabiLogo() {
  return (
    <View style={{ position: "relative", height: 26, justifyContent: "flex-end" }}>
      {/* 브랜드 red dot — 'i' 위 */}
      <View style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.primary,
      }} />
      <Text style={{ fontSize: 22, fontWeight: "800", color: "#2F2F31", letterSpacing: -0.5, lineHeight: 22 }}>
        tabi
      </Text>
    </View>
  );
}

// ── 카테고리 아이콘 박스 ─────────────────────────────────────────────────
function CategoryIcon({
  icon,
  color,
  bg,
  size = 36,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bg: string;
  size?: number;
}) {
  return (
    <View style={{
      width: size,
      height: size,
      borderRadius: size * 0.28,
      backgroundColor: bg,
      justifyContent: "center",
      alignItems: "center",
    }}>
      <Ionicons name={icon} size={size * 0.55} color={color} />
    </View>
  );
}

// ── Avatar ───────────────────────────────────────────────────────────────
// Figma: Ellipse 26×26
function Avatar({ uri, size = 26 }: { uri?: string | null; size?: number }) {
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

// ── 날짜 포맷 (Figma: "26.03.12") ────────────────────────────────────────
function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${String(d.getFullYear()).slice(2)}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

// ── 카테고리 레이블 ──────────────────────────────────────────────────────
const CATEGORY_LABELS: Record<string, string> = {
  free: "자유게시판",
  review: "여행후기",
  question: "질문 Q&A",
  food: "맛집 추천",
  info: "애니 성지",
  shopping: "쇼핑 성지",
};

// ── 메타 아이콘 (좋아요 + 댓글) ─────────────────────────────────────────
function MetaRow({ likes, comments }: { likes: number; comments: number }) {
  return (
    <View style={styles.metaGroup}>
      <View style={styles.metaItem}>
        <Ionicons name="heart" size={12} color={colors.primary} />
        <Text style={styles.metaCount}>{likes}</Text>
      </View>
      <View style={styles.metaItem}>
        <Ionicons name="chatbubble-ellipses" size={12} color={colors.neutral500} />
        <Text style={styles.metaCount}>{comments}</Text>
      </View>
    </View>
  );
}

// ── 게시글 카드 컴포넌트 (hot/feed/my post 동일 CSS) ─────────────────────
// Figma: bg-white border-[#ECECEC] px-20 py-16 rounded-12
// gap-9 사이 섹션, author gap-10, row gap-30 (left 220 + date)
function PostCard({ post, onPress }: { post: Post; onPress: () => void }) {
  const categoryLabel = CATEGORY_LABELS[post.category ?? ""] ?? post.category ?? "";
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {/* 내용 블록 — Figma: gap-9 */}
      <View style={styles.cardContent}>
        {/* 상단 섹션 — Figma: gap-10 */}
        <View style={styles.cardTop}>
          {/* 작성자 행 — Figma: gap-30 (left w-220 + date) */}
          <View style={styles.authorRow}>
            {/* 왼쪽: avatar + name, gap-5, w-220 */}
            <View style={styles.authorLeft}>
              <Avatar uri={post.profile_image_url} size={26} />
              {/* Figma: SemiBold 14px #2F2F31 lineHeight:18 */}
              <Text style={styles.authorName} numberOfLines={1}>
                {post.nickname ?? "사용자"}
              </Text>
            </View>
            {/* Figma: SemiBold 10px #D9D9DB text-right lineHeight:14 */}
            <Text style={styles.postDate}>{formatDate(post.created_at)}</Text>
          </View>
          {/* 본문 — Figma: Medium 14px #55575B lineHeight:20 */}
          <Text style={styles.postContent} numberOfLines={3}>
            {post.content || post.title}
          </Text>
        </View>

        {/* 하단 메타 행 — Figma: justify-between */}
        <View style={styles.cardBottom}>
          {/* Figma: Bold 12px #D9D9DB lineHeight:14 */}
          <Text style={styles.categoryLabel}>{categoryLabel}</Text>
          <MetaRow
            likes={post.likesCount ?? 0}
            comments={post.commentsCount ?? 0}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────
type Props = {
  hotPosts: Post[];
  latestPosts: Post[];
  loading: boolean;
  refreshing: boolean;
  userAvatar?: string | null;
  userNickname?: string | null;
  onRefresh: () => void;
  onPressPost: (postId: number) => void;
  onPressBoard: (board: { key: string; label: string }) => void;
  onPressMyPosts: () => void;
  onPressWrite: () => void;
};

// ── 메인 뷰 ──────────────────────────────────────────────────────────────
export default function CommunityScreenView({
  hotPosts,
  latestPosts,
  loading,
  refreshing,
  userAvatar,
  userNickname,
  onRefresh,
  onPressPost,
  onPressBoard,
  onPressMyPosts,
  onPressWrite,
}: Props) {
  const insets = useSafeAreaInsets();
  const myLatest = latestPosts[0];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      {/* ── 헤더 — Figma 네비_로고: tabi 로고 + (아바타+닉네임) + 글쓰기 ── */}
      <View style={styles.header}>
        <TabiLogo />
        <View style={styles.headerRight}>
          <Avatar uri={userAvatar} size={26} />
          <Text style={styles.headerNickname} numberOfLines={1}>
            {userNickname ?? ""}
          </Text>
          <TouchableOpacity style={styles.writeBtn} onPress={onPressWrite} activeOpacity={0.8}>
            <Text style={styles.writeBtnText}>글쓰기</Text>
          </TouchableOpacity>
        </View>
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

        {/* ── 타비톡 이번주 인기글 ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{"타비톡\n이번주 인기글"}</Text>
          <FlatList
            data={hotPosts}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.hotList}
            renderItem={({ item }) => (
              <View style={{ width: 300, marginRight: 12 }}>
                <PostCard post={item} onPress={() => onPressPost(item.id)} />
              </View>
            )}
            ListEmptyComponent={
              loading ? (
                <View style={styles.hotSkeleton} />
              ) : null
            }
          />
        </View>

        {/* ── 카테고리 아이콘 — Figma: y=364, 60px×47px each, gap=4, paddingLeft=16 ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryRow}
        >
          {BOARDS.map((b) => (
            <TouchableOpacity
              key={b.key}
              style={styles.categoryItem}
              onPress={() => onPressBoard(b)}
              activeOpacity={0.7}
            >
              <CategoryIcon icon={b.icon} color={b.color} bg={b.bg} size={36} />
              {/* Figma: SemiBold 12px #2F2F31 lineHeight:14 center */}
              <Text style={styles.categoryItemLabel}>{b.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── 내 글 보기 ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>내 글 보기</Text>
            <TouchableOpacity onPress={onPressMyPosts} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.seeAll}>내 글 모두보기 &gt;</Text>
            </TouchableOpacity>
          </View>
          {myLatest ? (
            <PostCard post={myLatest} onPress={() => onPressPost(myLatest.id)} />
          ) : (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>아직 작성한 글이 없어요</Text>
            </View>
          )}
        </View>

        {/* ── 지금 바로 실시간 타비톡 ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{"지금 바로\n실시간 타비톡"}</Text>
          <View style={styles.feedList}>
            {loading && latestPosts.length === 0
              ? [0, 1, 2].map((i) => <View key={i} style={styles.feedSkeleton} />)
              : latestPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onPress={() => onPressPost(post.id)}
                  />
                ))}
          </View>
        </View>

        <View style={{ height: 32 }} />
      </Animated.ScrollView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // #FAFAFA (카드들 사이 배경)
  },

  // ── 헤더 — Figma 네비_로고: height=58, bg=#FAFAFA ──
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    height: 58,
    backgroundColor: "#FAFAFA",
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  // Figma: SemiBold 14px #2F2F31 lineHeight:18
  headerNickname: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2F2F31",
    lineHeight: 18,
    maxWidth: 70,
    marginRight: 8,
  },
  // Figma: bg=#3A3A3D, rounded-12, h=24, px=13, py=5, SemiBold 12px white
  writeBtn: {
    backgroundColor: "#3A3A3D",
    paddingHorizontal: 13,
    paddingVertical: 5,
    borderRadius: 12,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  writeBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 14,
  },

  // ── 섹션 ──
  section: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 8,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  // Figma: Bold 18px #2F2F31 lineHeight:26 letterSpacing:-0.3
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 14,
    letterSpacing: -0.3,
    lineHeight: 26,
  },
  seeAll: {
    fontSize: 13,
    color: colors.textTertiary,
  },

  // ── 인기글 horizontal ──
  hotList: {
    paddingRight: 20,
  },
  hotSkeleton: {
    width: 300,
    height: 120,
    borderRadius: 12,
    backgroundColor: colors.neutral200,
  },

  // ── 카테고리 아이콘 ──
  // Figma: y=364, paddingLeft=16, gap=4, each 60px wide
  categoryScroll: {
    marginTop: 20,
  },
  categoryRow: {
    paddingHorizontal: 16,
    gap: 4,
  },
  // Figma: flex-col gap-10 items-center, width=60, height=47
  categoryItem: {
    width: 60,
    alignItems: "center",
    gap: 10,
    paddingVertical: 4,
  },
  // Figma: SemiBold 12px #2F2F31 lineHeight:14 center
  categoryItemLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2F2F31",
    textAlign: "center",
    lineHeight: 14,
  },

  // ── 피드 목록 ──
  feedList: {
    gap: 12,
  },

  // ── 게시글 카드 ──
  // Figma: bg-white border #ECECEC 1px rounded-12 px-20 py-16
  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#ECECEC",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  // Figma: flex-col gap-9
  cardContent: {
    gap: 9,
  },
  // Figma: flex-col gap-10 (author row + content text)
  cardTop: {
    gap: 10,
  },
  // Figma: flex-row gap-30 items-center (left 220px + date)
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 30,
  },
  // Figma: flex-row gap-5 items-center w-220
  authorLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  // Figma: SemiBold 14px #2F2F31 lineHeight:18
  authorName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#2F2F31",
    lineHeight: 18,
  },
  // Figma: SemiBold 10px #D9D9DB lineHeight:14 text-right
  postDate: {
    fontSize: 10,
    fontWeight: "600",
    color: "#D9D9DB",
    lineHeight: 14,
    textAlign: "right",
    flexShrink: 0,
  },
  // Figma: Medium 14px #55575B lineHeight:20
  postContent: {
    fontSize: 14,
    fontWeight: "500",
    color: "#55575B",
    lineHeight: 20,
  },
  // Figma: justify-between (category + meta)
  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  // Figma: Bold 12px #D9D9DB lineHeight:14
  categoryLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#D9D9DB",
    lineHeight: 14,
  },

  // ── 메타 (좋아요 + 댓글) ──
  // Figma: gap-8 between groups
  metaGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  // Figma: gap-5 within each group
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  // Figma: Bold 12px #8E9196 lineHeight:14
  metaCount: {
    fontSize: 12,
    fontWeight: "700",
    color: "#8E9196",
    lineHeight: 14,
  },

  // ── 빈 상태 ──
  emptyBox: {
    paddingVertical: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 13,
    color: colors.textTertiary,
  },

  // ── 스켈레톤 ──
  feedSkeleton: {
    height: 120,
    borderRadius: 12,
    backgroundColor: colors.neutral200,
  },
});
