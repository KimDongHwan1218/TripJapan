import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CommunityScreen from "../screens/community/CommunityScreen";
import PostCreateScreen from "../screens/community/PostCreateScreen";
import CommentScreen from "../screens/community/CommentScreen";

export type CommunityStackParamList = {
  CommunityScreen: undefined;
  PostCreateScreen: undefined;
  CommentScreen: undefined;
};

const Stack = createNativeStackNavigator<CommunityStackParamList>();

export default function CommunityStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="CommunityScreen" 
        component={CommunityScreen} 
        options={{ title: "커뮤니티" }} 
      />
      <Stack.Screen 
        name="PostCreateScreen" 
        component={PostCreateScreen} 
        options={{ title: "새 글쓰기" }} 
      />
      <Stack.Screen 
        name="CommentScreen" 
        component={CommentScreen} 
        options={{ title: "댓글" }} 
      />
    </Stack.Navigator>
  );
}