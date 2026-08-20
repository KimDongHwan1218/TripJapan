import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CommunityScreen from "../screens/community/CommunityScreen";
import PostCreateScreen from "../screens/community/PostCreateScreen";
import PostDetailScreen from "../screens/community/redesign/TaviTalkPostDetailContainer";
import BoardScreen from "../screens/community/BoardScreen";
import HotPostsScreen from "../screens/community/HotPostsScreen";
import MyPostsScreen from "../screens/community/MyPostsScreen";
import ReviewWriteScreen from "../screens/home/ReviewWriteScreen";

export type CommunityStackParamList = {
  CommunityScreen:
    | {
        newPost?: any;
        updatedPost?: any;
        fromCreate?: boolean;
        fromComment?: boolean;
      }
    | undefined;

  BoardScreen: {
    board: {
      key: string;
      label: string;
    };
  };

  HotPostsScreen: undefined;
  MyPostsScreen: undefined;

  PostCreateScreen: {
    boardType: "free" | "review" | "question" | "info" | "food" | "shopping";
  };

  PostDetailScreen: {
    postId: number;
  };

  ReviewWrite: {
    placeId: number;
    placeName: string;
    existingReview?: { id: number; rating: number; title: string | null; content: string; image_urls: string[] };
  };
};

const Stack = createNativeStackNavigator<CommunityStackParamList>();

export default function CommunityStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CommunityScreen" component={CommunityScreen} />
      <Stack.Screen name="BoardScreen" component={BoardScreen} />
      <Stack.Screen name="HotPostsScreen" component={HotPostsScreen} />
      <Stack.Screen name="MyPostsScreen" component={MyPostsScreen} />
      <Stack.Screen name="PostCreateScreen" component={PostCreateScreen} />
      <Stack.Screen name="PostDetailScreen" component={PostDetailScreen} />
      <Stack.Screen name="ReviewWrite" component={ReviewWriteScreen} />
    </Stack.Navigator>
  );
}
