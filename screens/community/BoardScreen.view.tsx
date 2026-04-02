import React from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header/Header";
import PostListItem from "./components/PostListItem";
import { layout, colors, spacing, radius } from "@/styles";
import type { Post } from "@/contexts/CommunityContext";

type Props = {
  board: { key: string; label: string };
  posts: Post[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  onRefresh: () => void;
  onPressPost: (postId: number) => void;
  onPressCreate: () => void;
};

export default function BoardScreenView({
  board,
  posts,
  loading,
  error,
  refreshing,
  onRefresh,
  onPressPost,
  onPressCreate,
}: Props) {
  return (
    <View style={styles.container}>
      <Header title={board.label} />

      <View style={styles.actionBar}>
        <Text style={styles.count}>총 {posts.length}개 글</Text>
        <Text style={styles.sort}>최신순 ▾</Text>
      </View>

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={onRefresh}>
            <Text style={styles.retryText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      )}

      {!error && (loading || posts.length === 0) ? (
        <View>
          {Array.from({ length: 6 }).map((_, idx) => (
            <View key={idx} style={styles.skeletonRow}>
              <View style={styles.skeletonTitle} />
              <View style={styles.skeletonMeta} />
            </View>
          ))}
        </View>
      ) : !error ? (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PostListItem post={item} onPress={() => onPressPost(item.id)} />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        />
      ) : null}

      <TouchableOpacity style={styles.fab} onPress={onPressCreate}>
        <Ionicons name="create-outline" size={26} color={colors.textWhite} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...layout.screen },
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  count: { fontSize: 13, color: colors.textSecondary },
  sort: { fontSize: 13, color: colors.textSecondary },
  skeletonRow: {
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  skeletonTitle: { height: 16, width: "80%", backgroundColor: colors.neutral200, borderRadius: radius.sm, marginBottom: 8 },
  skeletonMeta: { height: 12, width: "40%", backgroundColor: colors.neutral100, borderRadius: radius.sm },
  errorBox: { margin: spacing.md, padding: spacing.md, backgroundColor: colors.primarySoft, borderRadius: radius.sm, alignItems: "center", gap: 8 },
  errorText: { color: colors.danger, fontSize: 14 },
  retryText: { color: colors.primary, fontWeight: "600", fontSize: 14 },
  fab: {
    position: "absolute",
    right: 18,
    bottom: 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
});
