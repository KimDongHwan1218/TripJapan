import React, { createContext, useContext, useState, useCallback, useMemo, useRef } from "react";
import { ENV } from "@/config/env";

const API_BASE = ENV.API_BASE_URL;
const PAGE_SIZE = 20;

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

type CategoryState = {
  posts: Post[];
  offset: number;
  hasMore: boolean;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
};

const DEFAULT_STATE: CategoryState = {
  posts: [],
  offset: 0,
  hasMore: true,
  loading: false,
  loadingMore: false,
  error: null,
};

type CommunityContextType = {
  getPosts: (category: string) => Post[];
  fetchPostsIfNeeded: (category: string) => Promise<void>;
  refreshPosts: (category: string) => Promise<void>;
  loadMorePosts: (category: string) => Promise<void>;
  isLoading: (category: string) => boolean;
  isLoadingMore: (category: string) => boolean;
  hasMore: (category: string) => boolean;
  getError: (category: string) => string | null;
};

const CommunityContext = createContext<CommunityContextType | null>(null);

export function CommunityProvider({ children }: { children: React.ReactNode }) {
  const [stateByCategory, setStateByCategory] = useState<Record<string, CategoryState>>({});

  const getState = (category: string): CategoryState =>
    stateByCategory[category] ?? DEFAULT_STATE;

  const patchState = useCallback((category: string, patch: Partial<CategoryState>) => {
    setStateByCategory((prev) => ({
      ...prev,
      [category]: { ...(prev[category] ?? DEFAULT_STATE), ...patch },
    }));
  }, []);

  const buildUrl = (category: string, offset: number) => {
    const base =
      category === "전체"
        ? `${API_BASE}/community/posts`
        : `${API_BASE}/community/category/${category}`;
    return `${base}?limit=${PAGE_SIZE}&offset=${offset}`;
  };

  const mapPosts = (data: any[]): Post[] =>
    data.map((p: any) => ({
      ...p,
      likesCount: p.likes_count ?? 0,
      commentsCount: p.comments_count ?? 0,
    }));

  // 첫 페이지 로드
  const fetchPosts = useCallback(async (category: string) => {
    patchState(category, { loading: true, error: null });
    try {
      const res = await fetch(buildUrl(category, 0));
      const data: any[] = await res.json();
      const posts = mapPosts(data);
      patchState(category, {
        posts,
        offset: posts.length,
        hasMore: posts.length === PAGE_SIZE,
        loading: false,
      });
    } catch {
      patchState(category, { loading: false, error: "게시글을 불러오지 못했습니다." });
    }
  }, [patchState]);

  // 캐시 있으면 skip
  const fetchPostsIfNeeded = useCallback(async (category: string) => {
    if (stateByCategory[category]?.posts.length) return;
    await fetchPosts(category);
  }, [stateByCategory, fetchPosts]);

  // 새로고침 (첫 페이지 재로드)
  const refreshPosts = useCallback(async (category: string) => {
    await fetchPosts(category);
  }, [fetchPosts]);

  // 다음 페이지 로드
  const loadMorePosts = useCallback(async (category: string) => {
    const s = stateByCategory[category] ?? DEFAULT_STATE;
    if (s.loadingMore || !s.hasMore || s.loading) return;

    patchState(category, { loadingMore: true });
    try {
      const res = await fetch(buildUrl(category, s.offset));
      const data: any[] = await res.json();
      const newPosts = mapPosts(data);
      patchState(category, {
        posts: [...s.posts, ...newPosts],
        offset: s.offset + newPosts.length,
        hasMore: newPosts.length === PAGE_SIZE,
        loadingMore: false,
      });
    } catch {
      patchState(category, { loadingMore: false });
    }
  }, [stateByCategory, patchState]);

  const getPosts = useCallback((category: string) =>
    (stateByCategory[category] ?? DEFAULT_STATE).posts, [stateByCategory]);

  const isLoading = useCallback((category: string) =>
    (stateByCategory[category] ?? DEFAULT_STATE).loading, [stateByCategory]);

  const isLoadingMore = useCallback((category: string) =>
    (stateByCategory[category] ?? DEFAULT_STATE).loadingMore, [stateByCategory]);

  const hasMore = useCallback((category: string) =>
    (stateByCategory[category] ?? DEFAULT_STATE).hasMore, [stateByCategory]);

  const getError = useCallback((category: string) =>
    (stateByCategory[category] ?? DEFAULT_STATE).error, [stateByCategory]);

  const value = useMemo(() => ({
    getPosts,
    fetchPostsIfNeeded,
    refreshPosts,
    loadMorePosts,
    isLoading,
    isLoadingMore,
    hasMore,
    getError,
  }), [getPosts, fetchPostsIfNeeded, refreshPosts, loadMorePosts, isLoading, isLoadingMore, hasMore, getError]);

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
