// screens/community/CommunityScreen.tsx
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
  RouteProp,
} from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CommunityStackParamList } from "../../navigation/CommunityStackNavigator";
import Header from "@/components/Header/Header";

const API_BASE = "https://tavi-server.onrender.com";

export interface Comment {
  id: number;
  post_id: number;
  user_id?: number | null;
  content?: string | null;
  created_at: string;
  updated_at: string;
}

type Post = {
  id: number;
  user_id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  image_urls?: string[];
  views: number;
  category?: string;
  likesCount: number;
  comments: Comment[];
};

type RouteParams = {
  params?: {
    fromCreate?: boolean;
    newPost?: Post;
  };
};

type CommunityNav = NativeStackNavigationProp<CommunityStackParamList>;

export default function CommunityScreen() {
  const navigation = useNavigation<CommunityNav>();
  const route = useRoute() as RouteProp<Record<string, any>, string> & RouteParams;

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedPostIds, setExpandedPostIds] = useState<number[]>([]);
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const categories = ["전체", "인기", "리뷰", "질문"];
  const [selectedTab, setSelectedTab] = useState("전체");

  /* ========================================================
      1) 게시글 + 댓글 + 좋아요수 불러오기
  ======================================================== */

  const fetchPosts = async () => {
    try {
      setLoading(true);

      const url =
        selectedTab === "전체"
          ? `${API_BASE}/community/posts`
          : `${API_BASE}/community/category/${selectedTab}`;

      const res = await fetch(url);
      const data = await res.json();

      const postsWithDetails = await Promise.all(
        data.map(async (post: any) => {
          // 댓글
          const cRes = await fetch(
            `${API_BASE}/community/posts/${post.id}/comments`
          );
          const comments = await cRes.json();

          // 좋아요 개수
          const likeRes = await fetch(
            `${API_BASE}/community/posts/${post.id}/likes-count`
          );
          const { count: likesCount } = await likeRes.json();

          return { ...post, likesCount, comments };
        })
      );

      setPosts(postsWithDetails);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [selectedTab])
  );

  /* ========================================================
      2) 좋아요 토글
  ======================================================== */

  const onToggleLike = async (postId: number) => {
    try {
      await fetch(`${API_BASE}/community/posts/${postId}/like-toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: 1 }),
      });

      // 좋아요 개수 다시 불러오기
      const res = await fetch(`${API_BASE}/community/posts/${postId}/likes-count`);
      const { count } = await res.json();

      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, likesCount: count } : p
        )
      );
    } catch (err) {
      Alert.alert("오류", "좋아요 처리 실패");
    }
  };

  /* ========================================================
      3) 조회수 증가 후 상세페이지로 이동
  ======================================================== */

  const onPressPost = async (post: Post) => {
    await fetch(`${API_BASE}/community/posts/${post.id}/view`, { method: "POST" });

    navigation.navigate("PostDetailScreen", { postId: post.id });
  };

  /* ========================================================
      4) 댓글 작성
  ======================================================== */

  const onSubmitCommentInline = async (postId: number) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    try {
      const res = await fetch(`${API_BASE}/community/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: postId,
          user_id: 1,
          content: text,
        }),
      });

      const newComment = await res.json();

      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, comments: [...p.comments, newComment] }
            : p
        )
      );

      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    } catch (err) {
      Alert.alert("오류", "댓글 작성 실패");
    }
  };

  /* ========================================================
      렌더링
  ======================================================== */

  const renderPost = ({ item }: { item: Post }) => {
    const isExpanded = expandedPostIds.includes(item.id);
    const preview = item.comments.slice(0, 2);
    return (
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={styles.avatar}>
            <Text>{`U${item.user_id}`}</Text>
          </View>

          <View style={{ marginLeft: 10 }}>
            <Text style={styles.authorName}>작성자 {item.user_id}</Text>
            <Text style={styles.createdAt}>
              {new Date(item.created_at).toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Body */}
        <TouchableOpacity onPress={() => onPressPost(item)}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.body}>{item.content}</Text>

          {/* 🔥 이미지가 있을 때만 렌더링 */}
          {item.image_urls && item.image_urls.length > 0 ? (
            <Image
              source={{ uri: item.image_urls[0] }}
              style={styles.postImage}
              resizeMode="cover"
            />
          ) : null}
        </TouchableOpacity>

        {/* Comments */}
        <View style={{ marginTop: 10 }}>
          {(isExpanded ? item.comments : preview).map((c) => (
            <View key={c.id} style={styles.commentRow}>
              <View style={styles.commentAvatar}>
                <Text>{`U${c.user_id}`}</Text>
              </View>
              <View style={{ marginLeft: 6 }}>
                <Text style={{ fontWeight: "700" }}>사용자 {c.user_id}</Text>
                <Text>{c.content}</Text>
              </View>
            </View>
          ))}

          <View style={styles.commentActions}>
            <TouchableOpacity
              onPress={() =>
                setExpandedPostIds((prev) =>
                  prev.includes(item.id)
                    ? prev.filter((v) => v !== item.id)
                    : [...prev, item.id]
                )
              }
            >
              <Text style={{ color: "#2a6ef7" }}>
                {isExpanded ? "댓글 접기" : "댓글 보기"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* 메타 정보 */}
          <View style={styles.metaRow}>
            {/* 좋아요 */}
            <TouchableOpacity
              style={styles.metaItem}
              onPress={() => onToggleLike(item.id)}
            >
              <Ionicons name="heart-outline" size={18} />
              <Text style={styles.metaText}>{item.likesCount}</Text>
            </TouchableOpacity>

            {/* 댓글 */}
            <View style={styles.metaItem}>
              <Ionicons name="chatbubble-outline" size={18} />
              <Text style={styles.metaText}>{item.comments.length}</Text>
            </View>

            {/* 조회수 */}
            <View style={styles.metaItem}>
              <Ionicons name="eye-outline" size={18} />
              <Text style={styles.metaText}>{item.views}</Text>
            </View>
          </View>

          {/* 댓글 입력 */}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <View style={styles.inlineCommentRow}>
              <TextInput
                placeholder="댓글 입력"
                style={styles.commentInput}
                value={commentInputs[item.id] || ""}
                onChangeText={(t) =>
                  setCommentInputs((prev) => ({ ...prev, [item.id]: t }))
                }
              />
              <TouchableOpacity
                style={styles.sendBtn}
                onPress={() => onSubmitCommentInline(item.id)}
              >
                <Text style={{ color: "white" }}>작성</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#2a6ef7" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header middleContent="커뮤니티" />

      <FlatList
        data={posts}
        keyExtractor={(i) => i.id.toString()}
        renderItem={renderPost}
        contentContainerStyle={{ padding: 12, paddingBottom: 140 }}
        ListHeaderComponent={
          <ScrollView
            horizontal
            contentContainerStyle={{ flexDirection: "row" }}
            showsHorizontalScrollIndicator={false}
          >
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.tabBtn,
                  selectedTab === cat && styles.tabBtnSelected,
                ]}
                onPress={() => setSelectedTab(cat)}
              >
                <Text
                  style={[
                    styles.tabText,
                    selectedTab === cat && styles.tabTextSelected,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("PostCreateScreen")}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

/* styles 동일 — 아래 생략 */


const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontWeight: "700" },
  authorName: { fontWeight: "700" },
  createdAt: { color: "#777", fontSize: 12 },
  title: { fontSize: 16, fontWeight: "700", marginTop: 8 },
  body: { marginTop: 6, color: "#333" },

  // 이미지 자리
  postImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: "#f0f0f0",
  },
  imagePlaceholder: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: "#000", // 검정 배경
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    color: "#fff", // 흰 글씨
    fontWeight: "700",
  },

  commentRow: {
    flexDirection: "row",
    marginTop: 8,
    alignItems: "flex-start",
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f1f1f1",
    justifyContent: "center",
    alignItems: "center",
  },
  commentActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  inlineCommentRow: {
    flexDirection: "row",
    marginTop: 8,
    alignItems: "center",
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#eee",
    padding: 8,
    borderRadius: 8,
  },
  sendBtn: {
    marginLeft: 8,
    backgroundColor: "#2a6ef7",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  // FAB
  fab: {
    position: "absolute",
    right: 18,
    bottom: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2a6ef7",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },

  // 상단 탭
  tabContainer: {
    flexDirection: "row",
    marginTop: 6,
  },
  tabBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#eee",
    borderRadius: 20,
    marginRight: 8,
  },
  tabBtnSelected: {
    backgroundColor: "#2a6ef7",
  },
  tabText: {
    color: "#333",
    fontWeight: "600",
  },
  tabTextSelected: {
    color: "white",
  },

  // 메타 정보 row
  metaRow: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  metaText: {
    marginLeft: 6,
    color: "#333",
  },

  // 미구현 표시용 pill
  unimplementedPill: {
    marginLeft: 6,
    backgroundColor: "#000",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  unimplementedText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
});
