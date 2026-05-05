import { useState } from "react";
import { Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { CommunityStackParamList } from "@/navigation/CommunityStackNavigator";
import { useAuth } from "@/contexts/AuthContext";
import { usePostDetail } from "./hooks/usePostDetail";
import PostDetailView from "./PostDetailScreen.view";
import { ENV } from "@/config/env";

const API_BASE = ENV.API_BASE_URL;

type RouteProps = RouteProp<CommunityStackParamList, "PostDetailScreen">;
type NavProps = NativeStackNavigationProp<CommunityStackParamList, "PostDetailScreen">;

export default function PostDetailScreenContainer() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavProps>();

  const rawId = route.params?.postId;
  const postId = typeof rawId === "number" ? rawId : Number(rawId);

  const { user } = useAuth();
  const [input, setInput] = useState("");

  const { post, images, comments, likesCount, loading, submittingComment, submitComment, toggleLike } =
    usePostDetail(postId, () => navigation.goBack(), user?.id);

  const isMyPost = !!user?.id && !!post?.user_id && Number(user.id) === post.user_id;

  function handleSubmitComment() {
    submitComment(input, () => setInput(""));
  }

  async function handleReport(reason: string) {
    if (!user?.id) {
      Alert.alert("로그인이 필요합니다.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/community/posts/${postId}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reporter_id: Number(user.id), reason }),
      });
      const data = await res.json();

      if (res.status === 409) {
        Alert.alert("이미 신고한 게시글입니다.");
      } else if (res.status === 400) {
        Alert.alert(data.error ?? "신고할 수 없습니다.");
      } else if (!res.ok) {
        Alert.alert("신고에 실패했습니다. 잠시 후 다시 시도해주세요.");
      } else {
        Alert.alert("신고가 완료되었습니다.", "검토 후 조치하겠습니다.");
      }
    } catch {
      Alert.alert("신고에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  }

  return (
    <PostDetailView
      post={post}
      images={images}
      comments={comments}
      likesCount={likesCount}
      loading={loading}
      submittingComment={submittingComment}
      input={input}
      isMyPost={isMyPost}
      onInputChange={setInput}
      onSubmitComment={handleSubmitComment}
      onToggleLike={toggleLike}
      onGoBack={() => navigation.goBack()}
      onReport={handleReport}
    />
  );
}
