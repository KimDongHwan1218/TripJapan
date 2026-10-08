import React from "react";
import { View, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Text from "@/components/ui/Text";
import { colors, radius, spacing } from "@/styles";
import { getCategoryLabel } from "@/screens/community/utils/postSelectors";
import { PICK_CATEGORIES, PLACE_CATEGORY_LABEL, PlaceThumb, timeAgo, useLatestTalk, useTaviPick } from "./shared";

// 홈 시안 B "상황별 홈"용 — 차분한 목록형.
//  - 카드·아바타·하트 아이콘 없이 글자 위계만으로(제목 → 메타 한 줄). 오늘 카드가 주인공이라 아래 섹션은 조용하게
//  - 카테고리는 밑줄 탭(D2: 채우기 없음), 장소는 한글명 먼저

export function TaviPickB() {
  const { cat, setCat, places, loading, openPlace, openMore } = useTaviPick();
  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
        {PICK_CATEGORIES.map((c) => {
          const on = c.key === cat.key;
          return (
            <TouchableOpacity key={c.key} onPress={() => setCat(c)} style={[styles.tab, on && styles.tabOn]} activeOpacity={0.7}>
              <Text style={[styles.tabText, on && styles.tabTextOn]}>{c.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View style={styles.list}>
        {loading && places.length === 0 ? (
          <ActivityIndicator color={colors.neutral500} style={{ paddingVertical: spacing.xl }} />
        ) : (
          places.slice(0, 4).map((p) => (
            <TouchableOpacity key={p.id} style={styles.placeRow} onPress={() => openPlace(p)} activeOpacity={0.7}>
              <PlaceThumb uri={p.thumbnail_url} category={p.category} style={styles.thumb} iconSize={20} />
              <View style={{ flex: 1 }}>
                <Text style={styles.title} numberOfLines={1}>{p.name_ko || p.name}</Text>
                <Text style={styles.meta} numberOfLines={1}>
                  {[PLACE_CATEGORY_LABEL[p.category ?? ""], p.name_ko ? p.name : p.address].filter(Boolean).join(" · ")}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
        {cat.apiKey !== "" && (
          <TouchableOpacity style={styles.more} onPress={openMore} activeOpacity={0.7}>
            <Text style={styles.moreText}>{cat.label} 더 보기</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export function TaviTalkB({ onPressPost }: { onPressPost: (id: number) => void }) {
  const { posts, loading } = useLatestTalk(4);
  return (
    <View style={styles.list}>
      {loading && posts.length === 0 ? (
        <ActivityIndicator color={colors.neutral500} style={{ paddingVertical: spacing.xl }} />
      ) : posts.length === 0 ? (
        <Text style={styles.meta}>아직 게시글이 없어요</Text>
      ) : (
        posts.map((post, i) => (
          <TouchableOpacity
            key={post.id}
            style={[styles.postRow, i > 0 && styles.divider]}
            onPress={() => onPressPost(post.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.title} numberOfLines={1}>{post.title || post.content}</Text>
            <Text style={styles.meta} numberOfLines={1}>
              {getCategoryLabel(post.category) || "자유게시판"} · {post.nickname} · {timeAgo(post.created_at)}
              {post.likesCount > 0 ? ` · 좋아요 ${post.likesCount}` : ""}
              {post.commentsCount > 0 ? ` · 댓글 ${post.commentsCount}` : ""}
            </Text>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: { paddingHorizontal: spacing.gutter, gap: spacing.lg },
  tab: { height: 40, justifyContent: "center", borderBottomWidth: 2, borderBottomColor: "transparent" },
  tabOn: { borderBottomColor: colors.textPrimary },
  tabText: { fontSize: 15, lineHeight: 22, fontWeight: "600", color: colors.textTertiary },
  tabTextOn: { color: colors.textPrimary, fontWeight: "700" },

  list: { paddingHorizontal: spacing.gutter, marginTop: spacing.sm },
  placeRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingVertical: spacing.sm, minHeight: 64 },
  thumb: { width: 48, height: 48, borderRadius: radius.sm, borderCurve: "continuous" },
  postRow: { paddingVertical: spacing.md, gap: 2 },
  divider: { borderTopWidth: 1, borderTopColor: colors.divider },
  title: { fontSize: 16, lineHeight: 24, fontWeight: "600", color: colors.textPrimary },
  meta: { fontSize: 13, lineHeight: 18, color: colors.textTertiary },
  more: { flexDirection: "row", alignItems: "center", gap: 2, alignSelf: "flex-start", minHeight: 44 },
  moreText: { fontSize: 14, lineHeight: 20, fontWeight: "600", color: colors.textSecondary },
});
