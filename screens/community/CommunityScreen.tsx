import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Image, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CommunityStackParamList } from "../../navigation/CommunityStackNavigator";
import Header from "@/components/Header/Header";
import { useCommunity } from "@/contexts/CommunityContext";
import { ENV } from "@/config/env";

const API_BASE = ENV.API_BASE_URL;

export interface Comment {
  id: number;
  post_id: number;
  user_id?: number | null;
  content?: string | null;
  created_at: string;
  updated_at: string;
}

type CommunityNav = NativeStackNavigationProp<CommunityStackParamList>;


export default function CommunityScreen() {
  const navigation = useNavigation<CommunityNav>();

  const categories = ["전체", "인기", "리뷰", "질문"];
  const [selectedTab, setSelectedTab] = useState("전체");

  const {
    getPosts,
    fetchPostsIfNeeded,
    isLoading,
  } = useCommunity();

  useEffect(() => {
    fetchPostsIfNeeded(selectedTab);
  }, [selectedTab]);

  const posts = getPosts(selectedTab);
  const loading = isLoading(selectedTab);

  const onToggleLike = async (postId: number) => {
    try {
      await fetch(
        `${API_BASE}/community/posts/${postId}/like-toggle`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: 1 }),
        }
      );
    } catch {
      Alert.alert("오류", "좋아요 처리 실패");
    }
  };

  const onPressPost = async (post: any) => {
    await fetch(
      `${API_BASE}/community/posts/${post.id}/view`,
      { method: "POST" }
    );

    navigation.navigate("PostDetailScreen", { postId: post.id });
  };

  const renderPost = ({ item }: any) => {
    const previewComments = item.comments.slice(0, 2);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Image
            source={{ uri: item.profile_image_url }}
            style={styles.avatar}
          />   

          <View style={{ marginLeft: 10 }}>
            <Text style={styles.authorName}> {item.nickname}</Text>
            <Text style={styles.createdAt}>
              {new Date(item.created_at).toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Body */}
        <TouchableOpacity onPress={() => onPressPost(item)}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.body}>{item.content}</Text>

          {item.image_urls?.length ? (
            <Image
              source={{ uri: item.image_urls[0] }}
              style={styles.postImage}
            />
          ) : null}
        </TouchableOpacity>

        {/* 댓글 미리보기 */}
        <View style={{ marginTop: 10 }}>
          {previewComments.map((c: any) => (
            <View key={c.id} style={styles.commentRow}>
              <View style={styles.commentAvatar}>
                <Text>{`U${c.user_id}`}</Text>
              </View>
              <View style={{ marginLeft: 6 }}>
                <Text style={{ fontWeight: "700" }}>
                  사용자 {c.user_id}
                </Text>
                <Text>{c.content}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* 메타 데이터 */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="heart-outline" size={18} />
            <Text style={styles.metaText}>{item.likesCount}</Text>
          </View>

          <View style={styles.metaItem}>
            <Ionicons name="chatbubble-outline" size={18} />
            <Text style={styles.metaText}>{item.comments.length}</Text>
          </View>

          <View style={styles.metaItem}>
            <Ionicons name="eye-outline" size={18} />
            <Text style={styles.metaText}>{item.views}</Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading && posts.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#2a6ef7" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="커뮤 니티" />

      <FlatList
        data={posts}
        keyExtractor={(i) => i.id.toString()}
        renderItem={renderPost}
        ListHeaderComponent={
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={ styles.category }
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
    </View>
  );
}



const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
  },
  category: {
    paddingHorizontal: 8,
    flexDirection: "row",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "white",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  cardHeader: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { 
    fontWeight: "700" 
  },
  authorName: { 
    fontWeight: "700" 
  },
  createdAt: { 
    color: "#777",
    fontSize: 12 
  },
  title: { 
    fontSize: 16, 
    fontWeight: "700", 
    marginTop: 8 
  },
  body: { 
    marginTop: 6, 
    color: "#333" 
  },
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
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    color: "#fff",
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
