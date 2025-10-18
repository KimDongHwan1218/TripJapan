// screens/community/PostCreateScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

// 🚀 서버 URL (Render에 올린 서버 주소로 교체하세요)
const API_BASE = "http://192.168.35.167:3000/community";
// const API_BASE = "https://your-render-app.onrender.com/community";

// ✅ 네비게이션 타입 정의
type CommunityStackParamList = {
  CommunityScreen: { newPost: any; fromCreate: boolean };
  PostCreateScreen: undefined;
};

export default function PostCreateScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!title.trim() || !body.trim()) {
      Alert.alert("입력 오류", "제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      setLoading(true);

      // ✅ 서버에 새 글 저장
      const res = await fetch(`${API_BASE}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: 1, // TODO: 실제 로그인된 사용자 ID로 교체 필요
          title: title.trim(),
          content: body.trim(), // DB에서 body → content
        }),
      });

      if (!res.ok) {
        throw new Error("게시글 등록 실패");
      }

      const newPost = await res.json();

      // CommunityScreen으로 돌아가면서 새 글 전달
      navigation.navigate("CommunityScreen", { newPost, fromCreate: true });
    } catch (err: any) {
      Alert.alert("에러", err.message ?? "게시글 등록 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <View style={{ marginBottom: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: "700" }}>새 글 작성</Text>
      </View>

      <Text style={{ marginBottom: 6 }}>제목</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="제목을 입력하세요"
        style={styles.input}
      />

      <Text style={{ marginTop: 12, marginBottom: 6 }}>내용</Text>
      <TextInput
        value={body}
        onChangeText={setBody}
        placeholder="내용을 입력하세요"
        style={[styles.input, { height: 140 }]}
        multiline
      />

      <View
        style={{
          marginTop: 16,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.btn, { backgroundColor: "#eee" }]}
          disabled={loading}
        >
          <Text>취소</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onSubmit}
          style={[styles.btn, { backgroundColor: "#2a6ef7" }]}
          disabled={loading}
        >
          <Text style={{ color: "white" }}>
            {loading ? "작성 중..." : "작성하기"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#eee",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "white",
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
});
