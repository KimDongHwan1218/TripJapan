// screens/community/CommentScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import {
  useRoute,
  useNavigation,
  RouteProp,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

// 🚀 스택 파라미터 타입을 이 파일 안에서 직접 정의
type RootStackParamList = {
  CommunityScreen: { updatedPost?: any; fromComment?: boolean } | undefined;
  CommentScreen: { post: any };
};

type CommentScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CommentScreen"
>;
type CommentScreenRouteProp = RouteProp<RootStackParamList, "CommentScreen">;

export default function CommentScreen() {
  const navigation = useNavigation<CommentScreenNavigationProp>();
  const route = useRoute<CommentScreenRouteProp>();
  const { post } = route.params ?? {};

  const [comments, setComments] = useState(post?.comments ?? []);
  const [text, setText] = useState("");

  if (!post) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>게시글을 찾을 수 없습니다.</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginTop: 12 }}
        >
          <Text style={{ color: "#2a6ef7" }}>뒤로가기</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const submit = () => {
    if (!text.trim()) {
      Alert.alert("입력 오류", "댓글을 입력하세요");
      return;
    }
    const newComment = {
      id: Date.now().toString(),
      author: "현재사용자",
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };
    const updated = [...comments, newComment];
    setComments(updated);
    setText("");

    // 변경된 포스트를 CommunityScreen으로 전달
    const updatedPost = { ...post, comments: updated };
    navigation.navigate("CommunityScreen", {
      updatedPost,
      fromComment: true,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} />
        </TouchableOpacity>
        <Text style={{ fontWeight: "700", fontSize: 16, marginLeft: 12 }}>
          댓글
        </Text>
      </View>

      {/* 게시글 본문 */}
      <View style={{ padding: 12 }}>
        <Text style={{ fontWeight: "700" }}>{post.title}</Text>
        <Text style={{ marginTop: 6 }}>{post.body}</Text>
      </View>

      {/* 댓글 리스트 */}
      <FlatList
        data={comments}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.commentCard}>
            <View style={styles.avatar}>
              <Text>{item.author.slice(0, 1)}</Text>
            </View>
            <View style={{ marginLeft: 8, flex: 1 }}>
              <Text style={{ fontWeight: "700" }}>{item.author}</Text>
              <Text>{item.text}</Text>
              <Text
                style={{
                  color: "#777",
                  fontSize: 12,
                  marginTop: 6,
                }}
              >
                {new Date(item.createdAt).toLocaleString()}
              </Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 140 }}
      />

      {/* 댓글 입력창 */}
      <View style={styles.footer}>
        <TextInput
          placeholder="댓글을 입력하세요"
          style={styles.input}
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity style={styles.postBtn} onPress={submit}>
          <Text style={{ color: "white" }}>전송</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", padding: 12 },
  commentCard: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#f1f1f1",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#eee",
    padding: 10,
    borderRadius: 8,
  },
  postBtn: {
    marginLeft: 8,
    backgroundColor: "#2a6ef7",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
});
