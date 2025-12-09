// screens/community/PostDetailScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { CommunityStackParamList } from "../../navigation/CommunityStackNavigator";
import Header from "@/components/Header/Header";

const API_BASE = "https://tavi-server.onrender.com";
const SCREEN_WIDTH = Dimensions.get("window").width;

type PostType = {
  id: number;
  user_id: number;
  title?: string;
  content?: string;
  created_at?: string;
  updated_at?: string;
  // 서버가 single image_url 또는 image_urls 배열 둘 중 하나만 제공할 수 있으니 둘 다 optional 처리
  image_url?: string | null;
  image_urls?: string[] | null;
  views?: number;
  likes?: number; // legacy
  // we will store likesCount separately
};

type CommentType = {
  id: number;
  post_id: number;
  user_id?: number | null;
  content?: string | null;
  created_at?: string | null;
};

type Props = {
  route: RouteProp<CommunityStackParamList, "PostDetailScreen">;
  navigation: NativeStackNavigationProp<CommunityStackParamList, "PostDetailScreen">;
};

export default function PostDetailScreen({ route, navigation }: Props) {
  // postId는 number 자료형이라는 전제 (하지만 안전하게 변환)
  const rawId = route.params?.postId;
  const postId = typeof rawId === "number" ? rawId : Number(rawId);

  const [post, setPost] = useState<PostType | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [input, setInput] = useState("");
  const [likesCount, setLikesCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (!postId || Number.isNaN(postId)) {
      Alert.alert("잘못된 접근", "유효한 게시글 ID가 전달되지 않았습니다.");
      navigation.goBack();
      return;
    }

    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  async function loadAll() {
    try {
      setLoading(true);

      // 1) 게시글
      const pRes = await fetch(`${API_BASE}/community/posts/${postId}`);
      if (!pRes.ok) throw new Error(`post fetch failed: ${pRes.status}`);
      const pJson: PostType = await pRes.json();

      // normalize images: support image_urls (array) or image_url (single)
      const imgs: string[] = [];
      if (Array.isArray(pJson.image_urls) && pJson.image_urls.length > 0) {
        imgs.push(...pJson.image_urls);
      } else if (typeof pJson.image_url === "string" && pJson.image_url.length > 0) {
        imgs.push(pJson.image_url);
      }

      setPost(pJson);
      setImages(imgs);

      // 2) 댓글
      const cRes = await fetch(`${API_BASE}/community/posts/${postId}/comments`);
      if (!cRes.ok) throw new Error(`comments fetch failed: ${cRes.status}`);
      const cJson: CommentType[] = await cRes.json();
      setComments(cJson);

      // 3) 좋아요 개수
      const lRes = await fetch(`${API_BASE}/community/posts/${postId}/likes-count`);
      if (lRes.ok) {
        const lJson = await lRes.json();
        // server returns { count }
        setLikesCount(typeof lJson.count === "number" ? lJson.count : 0);
      } else {
        setLikesCount(pJson.likes ?? 0);
      }
    } catch (err: any) {
      console.error("loadAll error", err);
      Alert.alert("오류", "게시글을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function submitComment() {
    if (!input.trim()) return;
    setSubmittingComment(true);
    try {
      // the server has an endpoint POST /community/comments
      const res = await fetch(`${API_BASE}/community/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: postId,
          user_id: 1,
          content: input.trim(),
        }),
      });
      if (!res.ok) throw new Error(`comment post failed ${res.status}`);
      const newComment = await res.json();
      setComments((prev) => [...prev, newComment]);
      setInput("");
    } catch (err) {
      console.error("submitComment error", err);
      Alert.alert("오류", "댓글 작성에 실패했습니다.");
    } finally {
      setSubmittingComment(false);
    }
  }

  async function toggleLike() {
    try {
      // like-toggle endpoint returns { liked: true/false } per server impl
      const res = await fetch(`${API_BASE}/community/posts/${postId}/like-toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: 1 }),
      });
      if (!res.ok) throw new Error(`like-toggle failed ${res.status}`);

      // refresh likes count
      const lRes = await fetch(`${API_BASE}/community/posts/${postId}/likes-count`);
      if (lRes.ok) {
        const lJson = await lRes.json();
        setLikesCount(typeof lJson.count === "number" ? lJson.count : likesCount ?? 0);
      } else {
        // fallback: toggle locally
        setLikesCount((prev) => (typeof prev === "number" ? prev + 1 : 1));
      }
    } catch (err) {
      console.error("toggleLike error", err);
      Alert.alert("오류", "좋아요 처리에 실패했습니다.");
    }
  }

  if (loading || !post) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#2a6ef7" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <Header backwardButton="simple" middleContent="게시글" />
        <View style={styles.header}>
          <Text style={styles.title}>{post.title ?? "제목 없음"}</Text>
          <Text style={styles.subText}>
            {post.created_at ? new Date(post.created_at).toLocaleString() : ""}
            {"  ·  "}
            조회 {post.views ?? 0}
          </Text>
        </View>

        {/* 이미지 슬라이드: images 배열이 비어있으면 placeholder */}
        {images.length > 0 ? (
          <FlatList
            data={images}
            keyExtractor={(uri, idx) => `${postId}-${idx}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.image} resizeMode="cover" />
            )}
            style={{ maxHeight: 320 }}
          />
        ) : (
          <View style={styles.noImageBox}>
            <Text style={{ color: "#fff" }}>이미지 없음</Text>
          </View>
        )}

        <View style={styles.contentWrap}>
          <Text style={styles.contentText}>{post.content ?? ""}</Text>

          <View style={styles.metaRow}>
            <TouchableOpacity style={styles.metaItem} onPress={toggleLike}>
              <Ionicons name="heart-outline" size={20} color="#e74c3c" />
              <Text style={styles.metaText}>{likesCount ?? "-"}</Text>
            </TouchableOpacity>

            <View style={styles.metaItem}>
              <Ionicons name="chatbubble-outline" size={20} />
              <Text style={styles.metaText}>{comments.length}</Text>
            </View>

            <View style={styles.metaItem}>
              <Ionicons name="eye-outline" size={20} />
              <Text style={styles.metaText}>{post.views ?? 0}</Text>
            </View>
          </View>
        </View>

        <View style={styles.commentsSection}>
          <Text style={styles.commentHeader}>댓글 ({comments.length})</Text>

          {comments.map((c) => (
            <View key={c.id} style={styles.commentRow}>
              <View style={styles.commentAvatar}>
                <Text>{`U${c.user_id ?? "?"}`}</Text>
              </View>
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={{ fontWeight: "700" }}>사용자 {c.user_id ?? "-"}</Text>
                <Text>{c.content}</Text>
                {c.created_at ? (
                  <Text style={{ color: "#777", fontSize: 12, marginTop: 4 }}>
                    {new Date(c.created_at).toLocaleString()}
                  </Text>
                ) : null}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.inputRow}>
          <TextInput
            placeholder="댓글을 입력하세요"
            style={styles.input}
            value={input}
            onChangeText={setInput}
            editable={!submittingComment}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={submitComment} disabled={submittingComment}>
            <Text style={{ color: "white" }}>{submittingComment ? "..." : "작성"}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* styles */
const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: { padding: 16 },
  title: { fontSize: 20, fontWeight: "700" },
  subText: { marginTop: 6, color: "#777" },

  image: { width: SCREEN_WIDTH, height: 320 },
  noImageBox: {
    height: 220,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },

  contentWrap: { padding: 16 },
  contentText: { fontSize: 16, lineHeight: 22 },

  metaRow: { flexDirection: "row", marginTop: 12, alignItems: "center" },
  metaItem: { flexDirection: "row", alignItems: "center", marginRight: 18 },
  metaText: { marginLeft: 8, color: "#333" },

  commentsSection: { paddingHorizontal: 16, paddingBottom: 12 },
  commentHeader: { fontWeight: "700", fontSize: 16, marginTop: 8, marginBottom: 6 },

  commentRow: { flexDirection: "row", paddingVertical: 10, borderBottomWidth: 0.5, borderColor: "#eee" },
  commentAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#eee", justifyContent: "center", alignItems: "center" },

  inputRow: { flexDirection: "row", padding: 10, borderTopWidth: 1, borderColor: "#eee", backgroundColor: "#fff" },
  input: { flex: 1, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10 },
  sendBtn: { backgroundColor: "#2a6ef7", paddingHorizontal: 16, marginLeft: 8, borderRadius: 8, justifyContent: "center", alignItems: "center" },
});
