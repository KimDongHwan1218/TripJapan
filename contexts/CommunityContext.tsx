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
  commentsCount: number;
  profileId: number;
  nickname: string;
  profile_image_url: string;
};

type CommunityContextType = {
  getPosts: (category: string) => Post[];
  fetchPostsIfNeeded: (category: string) => Promise<void>;
  refreshPosts: (category: string) => Promise<void>;
  isLoading: (category: string) => boolean;
  getError: (category: string) => string | null;
};

const CommunityContext = createContext<CommunityContextType | null>(null);

export function CommunityProvider({ children }: { children: React.ReactNode }) {
  const [postsByCategory, setPostsByCategory] = useState<Record<string, Post[]>>(
    {}
  );
  const [loadingByCategory, setLoadingByCategory] = useState<
    Record<string, boolean>
  >({});
  const [errorByCategory, setErrorByCategory] = useState<
    Record<string, string | null>
  >({});

  const fetchPosts = useCallback(async (category: string) => {
    setLoadingByCategory((prev) => ({ ...prev, [category]: true }));
    setErrorByCategory((prev) => ({ ...prev, [category]: null }));

    try {
      const url =
        category === "전체"
          ? `${API_BASE}/community/posts`
          : `${API_BASE}/community/category/${category}`;

      const res = await fetch(url);
      const data = await res.json();

      const posts: Post[] = data.map((post: any) => ({
        ...post,
        likesCount: post.likes_count ?? 0,
        commentsCount: post.comments_count ?? 0,
      }));

      setPostsByCategory((prev) => ({
        ...prev,
        [category]: posts,
      }));
    } catch (e) {
      console.error("fetchPosts error:", e);
      setErrorByCategory((prev) => ({
        ...prev,
        [category]: "게시글을 불러오지 못했습니다.",
      }));
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

  const getError = useCallback(
    (category: string) => {
      return errorByCategory[category] ?? null;
    },
    [errorByCategory]
  );

  const value = useMemo(
    () => ({
      getPosts,
      fetchPostsIfNeeded,
      refreshPosts,
      isLoading,
      getError,
    }),
    [getPosts, fetchPostsIfNeeded, refreshPosts, isLoading, getError]
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
