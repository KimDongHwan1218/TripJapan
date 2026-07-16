import { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { CommunityStackParamList } from "@/navigation/CommunityStackNavigator";
import { usePostCreate } from "./hooks/usePostCreate";
import PostCreateView from "./PostCreateScreen.view";

type Props = NativeStackScreenProps<CommunityStackParamList, "PostCreateScreen">;

export default function PostCreateScreenContainer() {
  const navigation = useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();
  const route = useRoute<Props["route"]>();
  const { user } = useAuth();

  const [boardType, setBoardType] = useState<string>(route.params.boardType);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const { loading, images, pickImages, submitPost } = usePostCreate();
  const { showToast } = useToast();

  function handleSubmit() {
    submitPost({
      userId: user?.id ? Number(user.id) : undefined,
      boardType,
      title,
      body,
      onSuccess: (newPost) => {
        showToast("게시글이 등록됐습니다.", "success");
        navigation.navigate("CommunityScreen", { newPost, fromCreate: true });
      },
    });
  }

  return (
    <PostCreateView
      boardType={boardType}
      title={title}
      body={body}
      images={images}
      loading={loading}
      onChangeBoardType={setBoardType}
      onChangeTitle={setTitle}
      onChangeBody={setBody}
      onPickImages={pickImages}
      onSubmit={handleSubmit}
      onCancel={() => navigation.goBack()}
    />
  );
}
