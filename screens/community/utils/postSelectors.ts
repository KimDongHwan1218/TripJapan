import { Post } from "@/contexts/CommunityContext";

export function selectHotPosts(posts: Post[], limit = 5) {
  return [...posts]
    .sort((a, b) => {
      const scoreA = a.likesCount * 2 + a.commentsCount + a.views * 0.1;
      const scoreB = b.likesCount * 2 + b.commentsCount + b.views * 0.1;
      return scoreB - scoreA;
    })
    .slice(0, limit);
}

export function selectLatestPosts(posts: Post[], limit = 5) {
  return [...posts]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )
    .slice(0, limit);
}

export function selectBoardPosts(posts: Post[], boardKey: string) {
  return posts.filter((p) => p.category === boardKey);
}
