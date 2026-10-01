import { useState, useEffect } from "react";
import { ENV } from "@/config/env";
import type { Post } from "@/contexts/CommunityContext";

const API_BASE = ENV.API_BASE_URL;

export function useMyPosts(userId: string | undefined) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    fetchMyPosts();
  }, [userId]);

  async function fetchMyPosts() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/community/posts?user_id=${userId}`);
      if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
      const data = await res.json();
      // 서버 GET /community/posts가 user_id 쿼리를 무시하고 전체 글을 돌려줘서 남의 글까지
      // "내가 쓴 글"에 뜨고 있었음 — 서버 필터가 고쳐져도 무해하도록 여기서도 한 번 거름.
      // 서버는 likes_count/comments_count로 주는데 화면은 likesCount를 읽어서 늘 0이던 것도 매핑
      const mine = (Array.isArray(data) ? data : [])
        .filter((p: any) => String(p.user_id) === String(userId))
        .map((p: any) => ({ ...p, likesCount: p.likes_count ?? 0, commentsCount: p.comments_count ?? 0 }));
      setPosts(mine);
    } catch (err: any) {
      setError("게시글을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return { posts, loading, error, refresh: fetchMyPosts };
}
