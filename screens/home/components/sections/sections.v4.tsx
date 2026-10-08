import React from "react";
import { View, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Text from "@/components/ui/Text";
import { colors, radius, spacing } from "@/styles";
import { tones, BOARD_TONE } from "@/styles/tones";
import { getCategoryLabel } from "@/screens/community/utils/postSelectors";
import { PICK_CATEGORIES, PLACE_CATEGORY_LABEL, PlaceThumb, timeAgo, useLatestTalk, useTaviPick } from "./shared";

// 홈 시안 D "위젯 대시보드"용 — 섹션도 위젯처럼 테두리 상자 하나에 담음.
//  - 실시간 타비톡 위젯: 제목 줄(●실시간) + 글 4줄(게시판 색 점 · 한 줄 · 시간) + 아래 "타비톡 열기"
//  - 타비 PICK 위젯: 위에 구간 선택(세그먼트), 아래 2×2 장소 타일

export function TaviTalkD({ onPressPost, onPressTaviTalk }: { onPressPost: (id: number) => void; onPressTaviTalk: () => void }) {
  const { posts, loading } = useLatestTalk(4);
  return (
    <View style={styles.widget}>
      <View style={styles.widgetHead}>
        <View style={styles.liveDot} />
        <Text style={styles.widgetTitle}>실시간 타비톡</Text>
      </View>
      {loading && posts.length === 0 ? (
        <ActivityIndicator color={colors.neutral500} style={{ paddingVertical: spacing.xl }} />
      ) : (
        posts.map((post) => {
          const t = tones[BOARD_TONE[post.category ?? "free"] ?? "yellow"];
          return (
            <TouchableOpacity key={post.id} style={styles.talkRow} onPress={() => onPressPost(post.id)} activeOpacity={0.7}>
              <View style={[styles.boardDot, { backgroundColor: t.fg }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.talkLine} numberOfLines={1}>{post.title || post.content}</Text>
                <Text style={styles.talkMeta} numberOfLines={1}>
                  {getCategoryLabel(post.category) || "자유게시판"} · {timeAgo(post.created_at)}
                </Text>
              </View>
              {post.commentsCount > 0 && (
                <View style={styles.count}>
                  <Ionicons name="chatbubble-outline" size={14} color={colors.textTertiary} />
                  <Text style={styles.countText}>{post.commentsCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })
      )}
      <TouchableOpacity style={styles.widgetFoot} onPress={onPressTaviTalk} activeOpacity={0.7}>
        <Text style={styles.widgetFootText}>타비톡 열기</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
}

export function TaviPickD() {
  const { cat, setCat, places, loading, openPlace, openMore } = useTaviPick();
  return (
    <View style={styles.widget}>
      <View style={styles.widgetHead}>
        <Ionicons name="sparkles" size={16} color={tones.yellow.fg} />
        <Text style={styles.widgetTitle}>타비 PICK</Text>
      </View>
      <View style={styles.segment}>
        {PICK_CATEGORIES.map((c) => {
          const on = c.key === cat.key;
          return (
            <TouchableOpacity key={c.key} onPress={() => setCat(c)} style={[styles.segItem, on && styles.segOn]} activeOpacity={0.7}>
              <Text style={[styles.segText, on && styles.segTextOn]}>{c.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {loading && places.length === 0 ? (
        <ActivityIndicator color={colors.neutral500} style={{ paddingVertical: spacing.xxl }} />
      ) : (
        <View style={styles.grid}>
          {places.slice(0, 4).map((p) => (
            <TouchableOpacity key={p.id} style={styles.tile} onPress={() => openPlace(p)} activeOpacity={0.8}>
              <PlaceThumb uri={p.thumbnail_url} category={p.category} style={styles.tileImg} iconSize={28} />
              <Text style={styles.tileName} numberOfLines={1}>{p.name_ko || p.name}</Text>
              <Text style={styles.tileMeta} numberOfLines={1}>{PLACE_CATEGORY_LABEL[p.category ?? ""] ?? ""}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <TouchableOpacity style={styles.widgetFoot} onPress={openMore} activeOpacity={0.7}>
        <Text style={styles.widgetFootText}>{cat.apiKey ? `${cat.label} 더 보기` : "검색에서 더 보기"}</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  widget: {
    marginHorizontal: spacing.gutter,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: colors.divider,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  widgetHead: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.sm },
  widgetTitle: { fontSize: 16, lineHeight: 24, fontWeight: "700", color: colors.textPrimary },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  widgetFoot: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    height: 48,
    marginTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  widgetFootText: { fontSize: 14, lineHeight: 20, fontWeight: "600", color: colors.textSecondary },

  talkRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, minHeight: 56 },
  boardDot: { width: 8, height: 8, borderRadius: 4 },
  talkLine: { fontSize: 15, lineHeight: 22, fontWeight: "600", color: colors.textPrimary },
  talkMeta: { fontSize: 12, lineHeight: 16, color: colors.textTertiary },
  count: { flexDirection: "row", alignItems: "center", gap: 2 },
  countText: { fontSize: 12, lineHeight: 16, fontWeight: "600", color: colors.textTertiary },

  segment: { flexDirection: "row", backgroundColor: colors.neutral100, borderRadius: radius.md, padding: 3, marginVertical: spacing.sm },
  segItem: { flex: 1, height: 32, borderRadius: radius.sm, alignItems: "center", justifyContent: "center" },
  segOn: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  segText: { fontSize: 13, lineHeight: 18, fontWeight: "600", color: colors.textTertiary },
  segTextOn: { color: colors.textPrimary, fontWeight: "700" },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: spacing.sm },
  tile: { width: "47%", flexGrow: 1 },
  tileImg: { width: "100%", aspectRatio: 1.4, borderRadius: radius.md, borderCurve: "continuous" },
  tileName: { fontSize: 14, lineHeight: 20, fontWeight: "600", color: colors.textPrimary, marginTop: spacing.sm },
  tileMeta: { fontSize: 12, lineHeight: 16, color: colors.textTertiary },
});
