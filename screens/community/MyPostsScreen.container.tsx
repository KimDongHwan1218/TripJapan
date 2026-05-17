import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "@/contexts/AuthContext";
import { CommunityStackParamList } from "@/navigation/CommunityStackNavigator";
import { useMyPosts } from "./hooks/useMyPosts";
import MyPostsView from "./MyPostsScreen.view";

type NavProp = NativeStackNavigationProp<CommunityStackParamList>;

export default function MyPostsScreenContainer() {
  const navigation = useNavigation<NavProp>();
  const { user } = useAuth();
  const { posts, loading, error, refresh } = useMyPosts(user?.id);

  return (
    <MyPostsView
      posts={posts}
      loading={loading}
      error={error}
      onPressPost={(postId) => navigation.navigate("PostDetailScreen", { postId })}
      onGoBack={() => navigation.goBack()}
      onRefresh={refresh}
    />
  );
}
