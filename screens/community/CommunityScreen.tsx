import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Image, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CommunityStackParamList } from "../../navigation/CommunityStackNavigator";
import Header from "@/components/Header/Header";
import { useCommunity } from "@/contexts/CommunityContext";
import { ENV } from "@/config/env";
import PostListItem from "./components/PostListItem";
import HotPostSection from "./components/HotPostSection";
import CategoryTabs from "./components/CategoryTabs";
import BoardSection from "./components/BoardSection";

const API_BASE = ENV.API_BASE_URL;

export interface Comment {
  id: number;
  post_id: number;
  user_id?: number | null;
  content?: string | null;
  created_at: string;
  updated_at: string;
}

type CommunityNav = NativeStackNavigationProp<CommunityStackParamList>;


export default function CommunityScreen() {
  const navigation = useNavigation<CommunityNav>();
  const categories = ["전체", "리뷰", "질문"];
  const [selectedTab, setSelectedTab] = useState("전체");

  const { getPosts, fetchPostsIfNeeded, isLoading } = useCommunity();

  useEffect(() => {
    fetchPostsIfNeeded(selectedTab);
  }, [selectedTab]);

  const posts = getPosts(selectedTab);
  const hotPosts = [...posts].sort((a, b) => b.likesCount - a.likesCount);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header title="커뮤니티" />

      <FlatList
        data={posts}
        keyExtractor={(i) => i.id.toString()}
        renderItem={({ item }) => (
          <PostListItem
            post={item}
            onPress={() =>
              navigation.navigate("PostDetailScreen", { postId: item.id })
            }
          />
        )}
        ListHeaderComponent={
          <>
            <BoardSection onPress={setSelectedTab} />
            <HotPostSection
              posts={hotPosts}
              onPress={(p: any) =>
                navigation.navigate("PostDetailScreen", { postId: p.id })
              }
            />
            <CategoryTabs
              categories={categories}
              selected={selectedTab}
              onSelect={setSelectedTab}
            />
          </>
        }
      />

      {/* FAB 유지 */}
    </View>
  );
}
