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
      setPosts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError("게시글을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return { posts, loading, error, refresh: fetchMyPosts };
}
