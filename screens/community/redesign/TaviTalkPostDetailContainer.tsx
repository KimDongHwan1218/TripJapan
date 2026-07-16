import { useState } from "react";
import { Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { CommunityStackParamList } from "@/navigation/CommunityStackNavigator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { usePostDetail } from "../hooks/usePostDetail";
import TaviTalkPostDetailView from "./TaviTalkPostDetailView";
import { ENV } from "@/config/env";

const API_BASE = ENV.API_BASE_URL;

type RouteProps = RouteProp<CommunityStackParamList, "PostDetailScreen">;
type NavProps = NativeStackNavigationProp<CommunityStackParamList, "PostDetailScreen">;

export default function TaviTalkPostDetailContainer() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavProps>();
  const { showToast } = useToast();

  const rawId = route.params?.postId;
  const postId = typeof rawId === "number" ? rawId : Number(rawId);

  const { user } = useAuth();
  const [input, setInput] = useState("");

  const {
    post,
    images,
    comments,
    likesCount,
    liked,
    loading,
    submittingComment,
    submitComment,
    toggleLike,
  } = usePostDetail(postId, () => navigation.goBack(), user?.id ? Number(user.id) : undefined);

  const isMyPost = !!user?.id && !!post?.user_id && Number(user.id) === post.user_id;

  const handleSubmitComment = () => {
    submitComment(input, () => {
      setInput("");
      showToast("댓글이 등록됐습니다.", "success");
    });
  };

  const handleEdit = () => {
    if (!post) return;
    navigation.navigate("PostCreateScreen", {
      boardType: (post.category ?? "free") as "free" | "review" | "question" | "info" | "food" | "shopping",
    });
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_BASE}/community/posts/${postId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("삭제 실패");
      showToast("게시글이 삭제됐습니다.", "info");
      navigation.goBack();
    } catch {
      showToast("게시글 삭제에 실패했습니다.", "error");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      const res = await fetch(`${API_BASE}/community/comments/${commentId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("댓글 삭제 실패");
      showToast("댓글이 삭제됐습니다.", "info");
    } catch {
      showToast("댓글 삭제에 실패했습니다.", "error");
    }
  };

  const handleReport = async (reason: string) => {
    if (!user?.id) {
      showToast("로그인이 필요합니다.", "error");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/community/posts/${postId}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reporter_id: Number(user.id), reason }),
      });
      if (res.status === 409) {
        showToast("이미 신고한 게시글입니다.", "info");
      } else if (!res.ok) {
        showToast("신고에 실패했습니다.", "error");
      } else {
        showToast("신고가 접수됐습니다.", "success");
      }
    } catch {
      showToast("신고에 실패했습니다.", "error");
    }
  };

  return (
    <TaviTalkPostDetailView
      post={post}
      images={images}
      comments={comments}
      likesCount={likesCount}
      liked={liked}
      loading={loading}
      isMyPost={isMyPost}
      currentUserId={user?.id ? Number(user.id) : undefined}
      input={input}
      submittingComment={submittingComment}
      onInputChange={setInput}
      onSubmitComment={handleSubmitComment}
      onToggleLike={toggleLike}
      onGoBack={() => navigation.goBack()}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onDeleteComment={handleDeleteComment}
      onReport={handleReport}
    />
  );
}
