import { useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ENV } from "@/config/env";

const API_BASE = ENV.API_BASE_URL;

export function usePostCreate() {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  async function pickImages() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 3,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImages(result.assets.map((a) => a.uri));
    }
  }

  async function uploadSingleImage(uri: string): Promise<string> {
    const filename = `post_${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;

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
  }

  async function submitPost(params: {
    userId: number | undefined;
    boardType: string;
    title: string;
    body: string;
    onSuccess: (newPost: any) => void;
  }) {
    const { userId, boardType, title, body, onSuccess } = params;

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
          user_id: userId,
          category: boardType,
          title: title.trim(),
          content: body.trim(),
          image_urls: uploadedUrls,
        }),
      });

      const newPost = await res.json();
      onSuccess(newPost);
    } catch (err: any) {
      Alert.alert("에러", err.message ?? "게시글 등록 실패");
    } finally {
      setLoading(false);
    }
  }

  return { loading, images, pickImages, submitPost };
}
