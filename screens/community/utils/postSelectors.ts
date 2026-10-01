import { Post } from "@/contexts/CommunityContext";

// 게시판 key → 화면 표시명. 화면마다 따로 삼항식으로 매핑하다가 "free"가 그대로 노출되거나
// 쇼핑/애니 글이 "질문"으로 표시되는 문제가 있어서 한 곳으로 모음
export const CATEGORY_LABELS: Record<string, string> = {
  free: "자유게시판",
  review: "여행후기",
  question: "질문 Q&A",
  food: "맛집 추천",
  info: "애니 성지",
  shopping: "쇼핑 성지",
};

export function getCategoryLabel(category?: string | null) {
  if (!category) return "";
  return CATEGORY_LABELS[category] ?? category;
}

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

// 불러온 글 중 내가 쓴 가장 최근 글. 예전엔 latestPosts[0](남의 글 포함 최신 글)을
// 그대로 "내 글 보기"에 보여주고 있었음
export function selectMyLatestPost(posts: Post[], userId?: string | number | null) {
  if (userId == null) return null;
  return selectLatestPosts(posts.filter((p) => String(p.user_id) === String(userId)), 1)[0] ?? null;
}

export function selectBoardPosts(posts: Post[], boardKey: string) {
  return posts.filter((p) => p.category === boardKey);
}
