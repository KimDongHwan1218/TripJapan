import { useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ENV } from "@/config/env";
import { useAuth } from "@/contexts/AuthContext";

const API_BASE = ENV.API_BASE_URL;

// initialImages: 수정 모드에서 기존 글의 이미지 URL(이미 업로드된 것) — 새로 고르지 않으면 그대로 유지
export function usePostCreate(initialImages: string[] = []) {
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>(initialImages);

  async function pickImages() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 10,
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
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
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
    editPostId?: number;
    onSuccess: (newPost: any) => void;
  }) {
    const { userId, boardType, title, body, editPostId, onSuccess } = params;

    if (!title.trim() || !body.trim()) {
      Alert.alert("입력 오류", "제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      setLoading(true);

      const uploadedUrls: string[] = [];
      for (const uri of images) {
        // 이미 업로드된 이미지(수정 모드의 기존 URL)는 다시 올리지 않음
        uploadedUrls.push(uri.startsWith("http") ? uri : await uploadSingleImage(uri));
      }

      const payload = { category: boardType, title: title.trim(), content: body.trim(), image_urls: uploadedUrls };
      // 수정이면 PATCH — 예전엔 글 상세의 "수정"이 빈 작성 화면을 열어서 저장하면 새 글이 하나 더 생겼음
      const res = editPostId
        ? await fetch(`${API_BASE}/community/posts/${editPostId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
            body: JSON.stringify(payload),
          })
        : await fetch(`${API_BASE}/community/posts`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
            body: JSON.stringify({ user_id: userId, ...payload }),
          });

      const newPost = await res.json();
      if (!res.ok) throw new Error(newPost?.message ?? "게시글 저장 실패");
      onSuccess(newPost);
    } catch (err: any) {
      Alert.alert("에러", err.message ?? "게시글 등록 실패");
    } finally {
      setLoading(false);
    }
  }

  return { loading, images, pickImages, submitPost };
}
