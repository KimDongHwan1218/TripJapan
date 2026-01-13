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
  Image,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Header from "@/components/Header/Header";
import { useAuth } from "@/contexts/AuthContext";
import { ENV } from "@/config/env";

const API_BASE = ENV.API_BASE_URL;

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

  const [images, setImages] = useState<string[]>([]); // 로컬 URI
  const { user } = useAuth();

  // ======================
  // 📌 이미지 선택
  // ======================
  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true, // Expo SDK 49+ 가능
      selectionLimit: 3,
      quality: 0.8,
    });

    if (!result.canceled) {
      const uris = result.assets.map((a) => a.uri);
      setImages(uris);
    }
  };

  // ======================
  // 📌 이미지 1장 업로드
  // ======================
  const uploadSingleImage = async (uri: string): Promise<string> => {
    // ---- 1) Presigned URL 요청 ----
    const filename = `post_${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;

    const presigned = await fetch(`${API_BASE}/community/upload-url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename }),
    });

    const { url, path } = await presigned.json();
    if (!url) throw new Error("Presigned URL 에러");

    // ---- 2) 이미지 파일을 blob으로 변환 ----
    const file = await fetch(uri);
    const blob = await file.blob();

    // ---- 3) PUT 업로드 ----
    const uploadRes = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "image/jpeg" },
      body: blob,
    });

    if (!uploadRes.ok) throw new Error("이미지 업로드 실패");

    // ---- 4) 공개 URL 반환 ----
    const publicUrl = `https://wwmdmngncknalzfcpejn.supabase.co/storage/v1/object/public/post-images/${path}`;
    return publicUrl;
  };

  // ======================
  // 📌 게시글 + 이미지 URL 업로드
  // ======================
  const onSubmit = async () => {
    if (!title.trim() || !body.trim()) {
      Alert.alert("입력 오류", "제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      setLoading(true);

      let uploadedUrls: string[] = [];

      // ---- 이미지 업로드 (있다면) ----
      if (images.length > 0) {
        for (const uri of images) {
          const uploaded = await uploadSingleImage(uri);
          uploadedUrls.push(uploaded);
        }
      }

      // ---- 게시글 저장 ----
      const res = await fetch(`${API_BASE}/community/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user?.id,
          title: title.trim(),
          content: body.trim(),
          image_urls: uploadedUrls, // 서버에 배열로 전달
        }),
      });

      const newPost = await res.json();
      navigation.navigate("CommunityScreen", { newPost, fromCreate: true });
    } catch (err: any) {
      console.error(err);
      Alert.alert("에러", err.message ?? "게시글 등록 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Header backwardButton title="새 글 작성" />

      <Text style={styles.title}>새 글 작성</Text>

      <Text style={styles.label}>제목</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="제목을 입력하세요"
        style={styles.input}
      />

      <Text style={styles.label}>내용</Text>
      <TextInput
        value={body}
        onChangeText={setBody}
        placeholder="내용을 입력하세요"
        style={[styles.input, { height: 140 }]}
        multiline
      />

      {/* ====================== */}
      {/*   이미지 선택 UI */}
      {/* ====================== */}
      <Text style={[styles.label, { marginTop: 12 }]}>이미지 (1~3장)</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {images.map((img, index) => (
          <Image
            key={index}
            source={{ uri: img }}
            style={{ width: 100, height: 100, borderRadius: 8, marginRight: 10 }}
          />
        ))}
        <TouchableOpacity
          onPress={pickImages}
          style={styles.imageAddBtn}
        >
          <Text style={{ fontSize: 32 }}>+</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ====================== */}
      {/*   버튼 */}
      {/* ====================== */}
      <View style={styles.btnRow}>
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
  title: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  label: { marginBottom: 6, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#eee",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "white",
  },
  imageAddBtn: {
    width: 100,
    height: 100,
    backgroundColor: "#eee",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  btnRow: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
});
