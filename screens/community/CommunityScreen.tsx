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

// 🚀 서버 URL
const API_BASE = "http://192.168.35.167:3000";
// const API_BASE = "https://your-render-app.onrender.com/api";

/** DB 기반 타입 */
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
  comments: Comment[];
};

type RouteParams = {
  params?: {
    newPost?: Post;
    updatedPost?: Post;
    fromCreate?: boolean;
    fromComment?: boolean;
  };
};

type CommunityNav = NativeStackNavigationProp<CommunityStackParamList>;

export default function CommunityScreen() {
  const navigation = useNavigation<CommunityNav>();
  const route = useRoute() as RouteProp<Record<string, any>, string> & RouteParams;

  const [posts, setPosts] = useState<Post[]>([]);
  const [expandedPostIds, setExpandedPostIds] = useState<number[]>([]);
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);

  // 서버에서 게시글 + 댓글 불러오기
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/community/posts`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data: Post[] = await res.json();

      // 각 post별 댓글 가져오기
      const postsWithComments: Post[] = await Promise.all(
        data.map(async (post) => {
          const cRes = await fetch(`${API_BASE}/community/posts/${post.id}/comments`);
          const comments = await cRes.json();
          return { ...post, comments };
        })
      );

      setPosts(postsWithComments);
    } catch (err) {
      console.error("게시글 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  // 화면 복귀 시 데이터 새로고침 + route.params 반영
  useFocusEffect(
    useCallback(() => {
      fetchPosts();

      const p = route.params;
      if (!p) return;

      if (p.newPost && p.fromCreate) {
        setPosts((s) => [p.newPost!, ...s]);
        navigation.setParams?.({ newPost: undefined, fromCreate: undefined });
      }
      if (p.updatedPost && p.fromComment) {
        setPosts((s) =>
          s.map((post) =>
            post.id === p.updatedPost!.id ? p.updatedPost! : post
          )
        );
        navigation.setParams?.({ updatedPost: undefined, fromComment: undefined });
      }
    }, [route.params])
  );

  const toggleExpand = (id: number) =>
    setExpandedPostIds((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [id, ...s]
    );

  const onPressMoreComments = (post: Post) => {
    navigation.navigate("CommentScreen", { post });
  };

  const onSubmitCommentInline = async (postId: number) => {
    const text = (commentInputs[postId] ?? "").trim();
    if (!text) return;

    try {
      const res = await fetch(`${API_BASE}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: postId,
          user_id: 1, // TODO: 로그인 연동 시 현재 사용자 ID로 교체
          content: text,
        }),
      });
      if (!res.ok) throw new Error("댓글 작성 실패");
      const newComment = await res.json();

      setPosts((s) =>
        s.map((post) =>
          post.id === postId
            ? { ...post, comments: [...post.comments, newComment] }
            : post
        )
      );
      setCommentInputs((s) => ({ ...s, [postId]: "" }));
    } catch (err) {
      console.error("댓글 작성 실패:", err);
    }
  };

  const renderPost = ({ item }: { item: Post }) => {
    const isExpanded = expandedPostIds.includes(item.id);
    const preview = item.comments.slice(0, 2);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{`U${item.user_id}`}</Text>
          </View>

          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.authorName}>작성자 {item.user_id}</Text>
            <Text style={styles.createdAt}>
              {new Date(item.created_at).toLocaleString()}
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => toggleExpand(item.id)}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.body}>{item.content}</Text>
        </TouchableOpacity>

        <View style={{ marginTop: 10 }}>
          {isExpanded
            ? item.comments.map((c) => (
                <View key={c.id} style={styles.commentRow}>
                  <View style={styles.commentAvatar}>
                    <Text>{`U${c.user_id}`}</Text>
                  </View>
                  <View style={{ marginLeft: 8, flex: 1 }}>
                    <Text style={{ fontWeight: "700" }}>사용자 {c.user_id}</Text>
                    <Text>{c.content}</Text>
                  </View>
                </View>
              ))
            : preview.map((c) => (
                <View key={c.id} style={styles.commentRow}>
                  <View style={styles.commentAvatar}>
                    <Text>{`U${c.user_id}`}</Text>
                  </View>
                  <View style={{ marginLeft: 8, flex: 1 }}>
                    <Text style={{ fontWeight: "700" }}>사용자 {c.user_id}</Text>
                    <Text numberOfLines={1}>{c.content}</Text>
                  </View>
                </View>
              ))}

          <View style={styles.commentActions}>
            <TouchableOpacity onPress={() => toggleExpand(item.id)}>
              <Text style={{ color: "#2a6ef7" }}>
                {isExpanded ? "댓글 접기" : "댓글 보기"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => onPressMoreComments(item)}>
              <Text style={{ color: "#2a6ef7" }}>+ 더보기</Text>
            </TouchableOpacity>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <View style={styles.inlineCommentRow}>
              <TextInput
                placeholder="댓글을 입력하세요"
                style={styles.commentInput}
                value={commentInputs[item.id] ?? ""}
                onChangeText={(t) =>
                  setCommentInputs((s) => ({ ...s, [item.id]: t }))
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
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color="#2a6ef7" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={posts}
        keyExtractor={(i) => i.id.toString()}
        renderItem={renderPost}
        contentContainerStyle={{ padding: 12, paddingBottom: 120 }}
        ListHeaderComponent={
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: "700" }}>커뮤니티</Text>
            <Text style={{ color: "#666" }}>
              (Supabase posts/comments 기반)
            </Text>
          </View>
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
});
