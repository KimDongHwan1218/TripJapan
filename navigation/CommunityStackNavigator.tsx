import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CommunityScreen from "../screens/community/CommunityScreen";
import PostCreateScreen from "../screens/community/PostCreateScreen";
import PostDetailScreen from "../screens/community/PostDetailScreen";

export type CommunityStackParamList = {
  CommunityScreen: {
    newPost?: any;
    updatedPost?: any;
    fromCreate?: boolean;
    fromComment?: boolean;
  } | undefined;
  PostCreateScreen: undefined;
  PostDetailScreen: {
    postId: number;
  };
};

const Stack = createNativeStackNavigator<CommunityStackParamList>();

export default function CommunityStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
      headerShown: false, // ✅ 모든 화면의 기본 헤더 비활성화
    }}>
      <Stack.Screen 
        name="CommunityScreen" 
        component={CommunityScreen} 
        // options={{ title: "커뮤니티" }} 
      />
      <Stack.Screen 
        name="PostCreateScreen" 
        component={PostCreateScreen} 
        // options={{ title: "새 글쓰기" }} 
      />
      <Stack.Screen 
        name="PostDetailScreen" 
        component={PostDetailScreen} 
        // options={{ title: "댓글" }} 
      />
    </Stack.Navigator>
  );
}