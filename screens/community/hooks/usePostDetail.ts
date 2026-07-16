import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { ENV } from "@/config/env";

const API_BASE = ENV.API_BASE_URL;

type PostType = {
  id: number;
  user_id: number;
  title?: string;
  content?: string;
  category?: string;
  created_at?: string;
  updated_at?: string;
  image_url?: string | null;
  image_urls?: string[] | null;
  views?: number;
  likes?: number;
  nickname?: string;
  profile_image_url?: string | null;
};

type CommentType = {
  id: number;
  post_id: number;
  user_id?: number | null;
  content?: string | null;
  created_at?: string | null;
  nickname?: string | null;
  profile_image?: string | null;
};

export function usePostDetail(postId: number, onInvalidId: () => void, userId?: number) {
  const [post, setPost] = useState<PostType | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [likesCount, setLikesCount] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
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
        body: JSON.stringify({ post_id: postId, user_id: userId, content: input.trim() }),
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
    // optimistic update: 즉시 UI 반영 (좋아요/취소 토글이므로 현재 liked 상태 기준으로 증감)
    const prevCount = likesCount ?? 0;
    const prevLiked = liked;
    const nextLiked = !prevLiked;
    setLiked(nextLiked);
    setLikesCount(nextLiked ? prevCount + 1 : Math.max(0, prevCount - 1));

    try {
      const res = await fetch(`${API_BASE}/community/posts/${postId}/like-toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });
      if (!res.ok) throw new Error(`like-toggle failed ${res.status}`);

      // 서버 실제 카운트로 동기화
      const lRes = await fetch(`${API_BASE}/community/posts/${postId}/likes-count`);
      if (lRes.ok) {
        const lJson = await lRes.json();
        setLikesCount(typeof lJson.count === "number" ? lJson.count : prevCount);
      }
    } catch {
      // 실패 시 rollback
      setLiked(prevLiked);
      setLikesCount(prevCount);
    }
  }

  return { post, images, comments, likesCount, liked, loading, submittingComment, submitComment, toggleLike };
}
