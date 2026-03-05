import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import Header from "@/components/Header/Header";
import { layout } from "@/styles";
import { useAuth } from "@/contexts/AuthContext";
import { ENV } from "@/config/env";
import { CommunityStackParamList } from "@/navigation/CommunityStackNavigator";

const API_BASE = ENV.API_BASE_URL;

type Props = NativeStackScreenProps<
  CommunityStackParamList,
  "PostCreateScreen"
>;

export default function PostCreateScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();

  const route = useRoute<Props["route"]>();
  const { boardType } = route.params; // ✅ 자동 설정된 카테고리

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const { user } = useAuth();

  // ======================
  // 📌 이미지 선택
  // ======================
  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 3,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages(result.assets.map((a) => a.uri));
    }
  };

  // ======================
  // 📌 이미지 업로드
  // ======================
  const uploadSingleImage = async (uri: string): Promise<string> => {
    const filename = `post_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2)}.jpg`;

    const presigned = await fetch(`${API_BASE}/community/upload-url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename }),
    });

    const { url, path } = await presigned.json();
    if (!url) throw new Error("Presigned URL 에러");

    const file = await fetch(uri);
    const blob = await file.blob();

    const uploadRes = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "image/jpeg" },
      body: blob,
    });

    if (!uploadRes.ok) throw new Error("이미지 업로드 실패");

    return `https://wwmdmngncknalzfcpejn.supabase.co/storage/v1/object/public/post-images/${path}`;
  };

  // ======================
  // 📌 게시글 등록
  // ======================
  const onSubmit = async () => {
    if (!title.trim() || !body.trim()) {
      Alert.alert("입력 오류", "제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      setLoading(true);

      const uploadedUrls: string[] = [];
      for (const uri of images) {
        uploadedUrls.push(await uploadSingleImage(uri));
      }

      const res = await fetch(`${API_BASE}/community/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user?.id,
          category: boardType, // ✅ 자동 설정
          title: title.trim(),
          content: body.trim(),
          image_urls: uploadedUrls,
        }),
      });

      const newPost = await res.json();

      navigation.navigate("CommunityScreen", {
        newPost,
        fromCreate: true,
      });
    } catch (err: any) {
      Alert.alert("에러", err.message ?? "게시글 등록 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header backwardButton title="새 글 작성" />

      <ScrollView contentContainerStyle={styles.content}>
        {/* 현재 게시판 표시 */}
        <Text style={styles.boardLabel}>
          {boardType === "free"
            ? "자유 게시판"
            : boardType === "review"
            ? "리뷰 게시판"
            : "질문 게시판"}
        </Text>

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

        <Text style={[styles.label, { marginTop: 12 }]}>이미지 (1~3장)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {images.map((img, i) => (
            <Image
              key={i}
              source={{ uri: img }}
              style={styles.image}
            />
          ))}
          <TouchableOpacity onPress={pickImages} style={styles.imageAddBtn}>
            <Text style={{ fontSize: 32 }}>+</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.btnRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.btn, { backgroundColor: "#eee" }]}
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...layout.screen,
  },
  content: {
    ...layout.content,
    padding: 16,
  },
  boardLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2a6ef7",
    marginBottom: 8,
  },
  label: { marginBottom: 6, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#eee",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "white",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
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
