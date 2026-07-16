import { useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ENV } from "@/config/env";
import { useAuth } from "@/contexts/AuthContext";

const API_BASE = ENV.API_BASE_URL;

export function useReviewWrite(placeId: number) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
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
      let uploadedImageUrl: string | null = null;

      if (imageUri) {
        // presigned upload
        const filename = `review_${placeId}_${Date.now()}.jpg`;
        const presigned = await fetch(`${API_BASE}/community/upload-url`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename }),
        });
        const { url, path } = await presigned.json();
        const file = await fetch(imageUri);
        const blob = await file.blob();
        await fetch(url, { method: "PUT", headers: { "Content-Type": "image/jpeg" }, body: blob });
        uploadedImageUrl = `https://wwmdmngncknalzfcpejn.supabase.co/storage/v1/object/public/post-images/${path}`;
      }

      const res = await fetch(`${API_BASE}/places/${placeId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user?.id ?? null,
          rating,
          title: title.trim() || undefined,
          content: content.trim(),
          image_url: uploadedImageUrl,
        }),
      });

      if (!res.ok) throw new Error(`review post failed: ${res.status}`);

      onSuccess();
    } catch (err: any) {
      Alert.alert("오류", err.message ?? "리뷰 작성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return {
    rating, setRating,
    title, setTitle,
    content, setContent,
    imageUri,
    loading,
    pickImage,
    submit,
  };
}
