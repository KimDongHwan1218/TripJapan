import { useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ENV } from "@/config/env";
import { useAuth } from "@/contexts/AuthContext";

const API_BASE = ENV.API_BASE_URL;
const MAX_IMAGES = 10;

type ExistingReview = {
  id: number;
  rating: number;
  title: string | null;
  content: string;
  image_urls: string[];
};

export function useReviewWrite(placeId: number, existingReview?: ExistingReview) {
  const { user, accessToken } = useAuth();
  const isEditMode = !!existingReview;
  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [title, setTitle] = useState(existingReview?.title ?? "");
  const [content, setContent] = useState(existingReview?.content ?? "");
  const [images, setImages] = useState<string[]>(existingReview?.image_urls ?? []);
  const [loading, setLoading] = useState(false);

  async function pickImages() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: MAX_IMAGES,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImages((prev) => [...prev, ...result.assets.map((a) => a.uri)].slice(0, MAX_IMAGES));
    }
  }

  function removeImage(uri: string) {
    setImages((prev) => prev.filter((u) => u !== uri));
  }

  async function uploadSingleImage(uri: string): Promise<string> {
    const filename = `review_${placeId}_${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;
    const presigned = await fetch(`${API_BASE}/community/upload-url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename }),
    });
    const { url, path } = await presigned.json();
    const file = await fetch(uri);
    const blob = await file.blob();
    await fetch(url, { method: "PUT", headers: { "Content-Type": "image/jpeg" }, body: blob });
    return `https://wwmdmngncknalzfcpejn.supabase.co/storage/v1/object/public/post-images/${path}`;
  }

  async function submit(onSuccess: () => void) {
    if (rating === 0) {
      Alert.alert("별점 필요", "별점을 선택해주세요.");
      return;
    }
    if (!content.trim()) {
      Alert.alert("내용 필요", "리뷰 내용을 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      const uploadedUrls: string[] = [];
      for (const uri of images) {
        uploadedUrls.push(uri.startsWith("http") ? uri : await uploadSingleImage(uri));
      }

      const url = isEditMode
        ? `${API_BASE}/places/${placeId}/reviews/${existingReview!.id}`
        : `${API_BASE}/places/${placeId}/reviews`;

      const res = await fetch(url, {
        method: isEditMode ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          ...(isEditMode && accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          user_id: user?.id ?? null,
          rating,
          title: title.trim() || undefined,
          content: content.trim(),
          image_urls: uploadedUrls,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message ?? `review ${isEditMode ? "edit" : "post"} failed: ${res.status}`);
      }

      onSuccess();
    } catch (err: any) {
      Alert.alert("오류", err.message ?? `리뷰 ${isEditMode ? "수정" : "작성"}에 실패했습니다.`);
    } finally {
      setLoading(false);
    }
  }

  return {
    isEditMode,
    rating, setRating,
    title, setTitle,
    content, setContent,
    images,
    maxImages: MAX_IMAGES,
    loading,
    pickImages,
    removeImage,
    submit,
  };
}
