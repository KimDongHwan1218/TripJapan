import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import Header from "@/components/Header/Header";
import { useCommunity } from "@/contexts/CommunityContext";
import { CommunityStackParamList } from "@/navigation/CommunityStackNavigator";

import CommunityTopTabs from "./components/CommunityTopTabs";
import HotPostsSection from "./components/HotPostsSection";
import LatestPostsSection from "./components/LatestPostsSection";

import {
  selectHotPosts,
  selectLatestPosts,
} from "./utils/postSelectors";
import { layout } from "@/styles/layout";

type TabKey = "home" | "review" | "question" | "free" | "info";

type CommunityNav =
  NativeStackNavigationProp<CommunityStackParamList, "CommunityScreen">;

export default function CommunityScreen() {
  const navigation = useNavigation<CommunityNav>();
  const { getPosts, fetchPostsIfNeeded, isLoading } = useCommunity();

  const [tab, setTab] = useState<TabKey>("home");
  const category = "전체";

  useEffect(() => {
    fetchPostsIfNeeded(category);
  }, []);

  const allPosts = getPosts(category);
  const hotPosts = selectHotPosts(allPosts);
  const latestPosts = selectLatestPosts(allPosts);

  useEffect(() => {
    if (tab === "home") return;

    const labelMap = {
      review: "후기",
      question: "질문",
      free: "자유",
      info: "정보",
    };

    navigation.navigate("BoardScreen", {
      board: { key: tab, label: labelMap[tab] },
    });

    setTab("home");
  }, [tab]);

  if (isLoading(category) && allPosts.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Header title="커뮤니티" />

      <CommunityTopTabs active={tab} onChange={setTab} />

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <HotPostsSection
            posts={hotPosts}
            onMore={() => navigation.navigate("HotPostsScreen")}
            onPressPost={(post) =>
              navigation.navigate("PostDetailScreen", {
                postId: post.id,
              })
            }
          />
        </View>

        <View style={styles.section}>
          <LatestPostsSection
            posts={latestPosts}
            onPressPost={(post) =>
              navigation.navigate("PostDetailScreen", {
                postId: post.id,
              })
            }
          />
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...layout.screen,
  },
  content: {
    ...layout.communityScroll,
  },
  section: {
    ...layout.communitySection,
  }
});
