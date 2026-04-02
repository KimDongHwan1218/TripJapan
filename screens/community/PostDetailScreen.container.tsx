import { useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { CommunityStackParamList } from "@/navigation/CommunityStackNavigator";
import { usePostDetail } from "./hooks/usePostDetail";
import PostDetailView from "./PostDetailScreen.view";

type RouteProps = RouteProp<CommunityStackParamList, "PostDetailScreen">;
type NavProps = NativeStackNavigationProp<CommunityStackParamList, "PostDetailScreen">;

export default function PostDetailScreenContainer() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavProps>();

  const rawId = route.params?.postId;
  const postId = typeof rawId === "number" ? rawId : Number(rawId);

  const [input, setInput] = useState("");

  const { post, images, comments, likesCount, loading, submittingComment, submitComment, toggleLike } =
    usePostDetail(postId, () => navigation.goBack());

  function handleSubmitComment() {
    submitComment(input, () => setInput(""));
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
      onInputChange={setInput}
      onSubmitComment={handleSubmitComment}
      onToggleLike={toggleLike}
      onGoBack={() => navigation.goBack()}
    />
  );
}
