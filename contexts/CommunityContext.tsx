import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { ENV } from "@/config/env";

const API_BASE = ENV.API_BASE_URL;

export type Comment = {
  id: number;
  post_id: number;
  user_id?: number | null;
  content?: string | null;
  created_at: string;
};

export type Post = {
  id: number;
  user_id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  image_urls?: string[];
  views: number;
  category?: string;
  likesCount: number;
  comments: Comment[];
  profileId: number;
  nickname: string;
  profile_image_url: string;
};

type CommunityContextType = {
  getPosts: (category: string) => Post[];
  fetchPostsIfNeeded: (category: string) => Promise<void>;
  refreshPosts: (category: string) => Promise<void>;
  isLoading: (category: string) => boolean;
};

const CommunityContext = createContext<CommunityContextType | null>(null);

export function CommunityProvider({ children }: { children: React.ReactNode }) {
  const [postsByCategory, setPostsByCategory] = useState<Record<string, Post[]>>(
    {}
  );
  const [loadingByCategory, setLoadingByCategory] = useState<
    Record<string, boolean>
  >({});

  const fetchPosts = useCallback(async (category: string) => {
    setLoadingByCategory((prev) => ({ ...prev, [category]: true }));

    try {
      const url =
        category === "전체"
          ? `${API_BASE}/community/posts`
          : `${API_BASE}/community/category/${category}`;

      const res = await fetch(url);
      const data = await res.json();

      // 아직 서버가 N+1 구조라 여기서 병합
      const postsWithDetails = await Promise.all(
        data.map(async (post: any) => {
          const [commentsRes, likesRes] = await Promise.all([
            fetch(`${API_BASE}/community/posts/${post.id}/comments`),
            fetch(`${API_BASE}/community/posts/${post.id}/likes-count`),
          ]);

          const comments = await commentsRes.json();
          const { count: likesCount } = await likesRes.json();

          return {
            ...post,
            comments,
            likesCount,
          };
        })
      );

      setPostsByCategory((prev) => ({
        ...prev,
        [category]: postsWithDetails,
      }));
    } catch (e) {
      console.error("fetchPosts error:", e);
    } finally {
      setLoadingByCategory((prev) => ({ ...prev, [category]: false }));
    }
  }, []);

  // 이미 있으면 fetch 안 함
  const fetchPostsIfNeeded = useCallback(
    async (category: string) => {
      if (postsByCategory[category]) return;
      await fetchPosts(category);
    },
    [postsByCategory, fetchPosts]
  );

  const refreshPosts = useCallback(
    async (category: string) => {
      await fetchPosts(category);
    },
    [fetchPosts]
  );

  const getPosts = useCallback(
    (category: string) => {
      return postsByCategory[category] || [];
    },
    [postsByCategory]
  );

  const isLoading = useCallback(
    (category: string) => {
      return !!loadingByCategory[category];
    },
    [loadingByCategory]
  );

  const value = useMemo(
    () => ({
      getPosts,
      fetchPostsIfNeeded,
      refreshPosts,
      isLoading,
    }),
    [getPosts, fetchPostsIfNeeded, refreshPosts, isLoading]
  );

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunity() {
  const ctx = useContext(CommunityContext);
  if (!ctx) throw new Error("useCommunity must be used within CommunityProvider");
  return ctx;
}
