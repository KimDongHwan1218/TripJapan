import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { ENV } from "@/config/env";

const API_BASE = ENV.API_BASE_URL;

type PostType = {
  id: number;
  user_id: number;
  title?: string;
  content?: string;
  created_at?: string;
  updated_at?: string;
  image_url?: string | null;
  image_urls?: string[] | null;
  views?: number;
  likes?: number;
};

type CommentType = {
  id: number;
  post_id: number;
  user_id?: number | null;
  content?: string | null;
  created_at?: string | null;
};

export function usePostDetail(postId: number, onInvalidId: () => void) {
  const [post, setPost] = useState<PostType | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [likesCount, setLikesCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (!postId || Number.isNaN(postId)) {
      Alert.alert("잘못된 접근", "유효한 게시글 ID가 전달되지 않았습니다.");
      onInvalidId();
      return;
    }
    loadAll();
  }, [postId]);

  async function loadAll() {
    try {
      setLoading(true);

      const pRes = await fetch(`${API_BASE}/community/posts/${postId}`);
      if (!pRes.ok) throw new Error(`post fetch failed: ${pRes.status}`);
      const pJson: PostType = await pRes.json();

      const imgs: string[] = [];
      if (Array.isArray(pJson.image_urls) && pJson.image_urls.length > 0) {
        imgs.push(...pJson.image_urls);
      } else if (typeof pJson.image_url === "string" && pJson.image_url.length > 0) {
        imgs.push(pJson.image_url);
      }
      setPost(pJson);
      setImages(imgs);

      const cRes = await fetch(`${API_BASE}/community/posts/${postId}/comments`);
      if (!cRes.ok) throw new Error(`comments fetch failed: ${cRes.status}`);
      setComments(await cRes.json());

      const lRes = await fetch(`${API_BASE}/community/posts/${postId}/likes-count`);
      if (lRes.ok) {
        const lJson = await lRes.json();
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

  async function submitComment(input: string, onSuccess: () => void) {
    if (!input.trim()) return;
    setSubmittingComment(true);
    try {
      const res = await fetch(`${API_BASE}/community/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: postId, user_id: 1, content: input.trim() }),
      });
      if (!res.ok) throw new Error(`comment post failed ${res.status}`);
      const newComment = await res.json();
      setComments((prev) => [...prev, newComment]);
      onSuccess();
    } catch (err) {
      Alert.alert("오류", "댓글 작성에 실패했습니다.");
    } finally {
      setSubmittingComment(false);
    }
  }

  async function toggleLike() {
    try {
      const res = await fetch(`${API_BASE}/community/posts/${postId}/like-toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: 1 }),
      });
      if (!res.ok) throw new Error(`like-toggle failed ${res.status}`);

      const lRes = await fetch(`${API_BASE}/community/posts/${postId}/likes-count`);
      if (lRes.ok) {
        const lJson = await lRes.json();
        setLikesCount(typeof lJson.count === "number" ? lJson.count : likesCount ?? 0);
      } else {
        setLikesCount((prev) => (typeof prev === "number" ? prev + 1 : 1));
      }
    } catch (err) {
      Alert.alert("오류", "좋아요 처리에 실패했습니다.");
    }
  }

  return { post, images, comments, likesCount, loading, submittingComment, submitComment, toggleLike };
}
