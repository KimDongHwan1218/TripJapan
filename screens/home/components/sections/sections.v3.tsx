import React, { useState } from "react";
import type { Place } from "@/screens/search/hooks/usePlaces";
import { View, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Text from "@/components/ui/Text";
import { colors, radius, spacing } from "@/styles";
import { tones, BOARD_TONE } from "@/styles/tones";
import { getCategoryLabel } from "@/screens/community/utils/postSelectors";
import { PICK_CATEGORIES, PLACE_CATEGORY_LABEL, PlaceThumb, timeAgo, useLatestTalk, useTaviPick } from "./shared";

// 홈 시안 C "도시 매거진"용 — 넘겨 보는 큰 카드.
//  - 타비 PICK: 세로로 긴 사진 카드 가로 스크롤(사진 없으면 카테고리 색 면 + 큰 아이콘), 여행 도시로 범위 한정
//  - 타비톡: 말풍선 같은 글 카드 가로 스크롤 — 게시판 색 태그, 본문 3줄, 아래에 작성자

export function TaviPickC({ region = "" }: { region?: string }) {
  const { cat, setCat, places, loading, openPlace, openMore } = useTaviPick(region);
  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {PICK_CATEGORIES.map((c) => {
          const on = c.key === cat.key;
          return (
            <TouchableOpacity key={c.key} onPress={() => setCat(c)} style={[styles.chip, on && styles.chipOn]} activeOpacity={0.7}>
              <Text style={[styles.chipText, on && styles.chipTextOn]}>{c.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {loading && places.length === 0 ? (
        <ActivityIndicator color={colors.neutral500} style={{ height: 240 }} />
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardRow}>
          {places.slice(0, 8).map((p) => (
            <PickCard key={p.id} place={p} onPress={() => openPlace(p)} />
          ))}
          <TouchableOpacity style={styles.moreCard} onPress={openMore} activeOpacity={0.7}>
            <Ionicons name="arrow-forward" size={24} color={colors.textPrimary} />
            <Text style={styles.moreCardText}>{cat.apiKey ? `${cat.label}\n더 보기` : "검색에서\n더 보기"}</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

// 사진이 있으면 아래 그림자 + 흰 글씨, 없으면(또는 깨지면) 카테고리 색 면 + 진한 글씨
// (처음엔 둘 다 그림자를 깔아 색 면이 탁한 회색이 됐음 — 실기기)
function PickCard({ place, onPress }: { place: Place; onPress: () => void }) {
  const [broken, setBroken] = useState(false);
  const hasPhoto = !!place.thumbnail_url && !broken;
  return (
    <TouchableOpacity style={styles.pickCard} onPress={onPress} activeOpacity={0.85}>
      <PlaceThumb uri={place.thumbnail_url} category={place.category} style={styles.pickImg} iconSize={44} onBroken={() => setBroken(true)} />
      {hasPhoto && <View style={styles.pickShade} />}
      <View style={styles.pickText}>
        <Text style={[styles.pickCat, !hasPhoto && styles.onTone]}>{PLACE_CATEGORY_LABEL[place.category ?? ""] ?? ""}</Text>
        <Text style={[styles.pickName, !hasPhoto && styles.onToneName]} numberOfLines={2}>{place.name_ko || place.name}</Text>
      </View>
    </TouchableOpacity>
  );
}

export function TaviTalkC({ onPressPost, onPressTaviTalk }: { onPressPost: (id: number) => void; onPressTaviTalk: () => void }) {
  const { posts, loading } = useLatestTalk(6);
  if (loading && posts.length === 0) return <ActivityIndicator color={colors.neutral500} style={{ height: 180 }} />;
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardRow}>
      {posts.map((post) => {
        const t = tones[BOARD_TONE[post.category ?? "free"] ?? "yellow"];
        return (
          <TouchableOpacity key={post.id} style={styles.talkCard} onPress={() => onPressPost(post.id)} activeOpacity={0.8}>
            <View style={[styles.boardTag, { backgroundColor: t.bg }]}>
              <Text style={[styles.boardTagText, { color: t.fg }]}>{getCategoryLabel(post.category) || "자유게시판"}</Text>
            </View>
            <Text style={styles.talkBody} numberOfLines={3}>
              {post.title ? `${post.title}\n` : ""}
              {post.content}
            </Text>
            <View style={styles.talkFoot}>
              {post.profile_image_url ? (
                <Image source={{ uri: post.profile_image_url }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, { backgroundColor: colors.neutral200 }]} />
              )}
              <Text style={styles.talkName} numberOfLines={1}>{post.nickname}</Text>
              <Text style={styles.talkTime}>{timeAgo(post.created_at)}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity style={[styles.moreCard, { height: undefined }]} onPress={onPressTaviTalk} activeOpacity={0.7}>
        <Ionicons name="arrow-forward" size={24} color={colors.textPrimary} />
        <Text style={styles.moreCardText}>{"타비톡\n전체 보기"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chips: { paddingHorizontal: spacing.gutter, gap: spacing.sm, paddingBottom: spacing.md },
  chip: { height: 36, paddingHorizontal: spacing.lg, borderRadius: radius.full, borderWidth: 1, borderColor: colors.border, justifyContent: "center" },
  chipOn: { borderColor: colors.textPrimary },
  chipText: { fontSize: 14, lineHeight: 20, fontWeight: "600", color: colors.textSecondary },
  chipTextOn: { color: colors.textPrimary, fontWeight: "700" },

  cardRow: { paddingHorizontal: spacing.gutter, gap: 12 },
  pickCard: { width: 168, height: 232, borderRadius: radius.lg, borderCurve: "continuous", overflow: "hidden", justifyContent: "flex-end" },
  pickImg: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%" },
  pickShade: { position: "absolute", left: 0, right: 0, bottom: 0, height: 96, backgroundColor: "rgba(0,0,0,0.35)" },
  pickText: { padding: spacing.md },
  pickCat: { fontSize: 12, lineHeight: 16, fontWeight: "700", color: colors.textWhite, opacity: 0.9 },
  onTone: { color: colors.textSecondary, opacity: 1 },
  onToneName: { color: colors.textPrimary },
  pickName: { fontSize: 16, lineHeight: 22, fontWeight: "700", color: colors.textWhite },

  moreCard: {
    width: 120,
    height: 232,
    borderRadius: radius.lg,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  moreCardText: { fontSize: 14, lineHeight: 20, fontWeight: "600", color: colors.textPrimary, textAlign: "center" },

  talkCard: {
    width: 260,
    borderRadius: radius.lg,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    gap: spacing.md,
  },
  boardTag: { alignSelf: "flex-start", height: 24, paddingHorizontal: spacing.sm, borderRadius: radius.full, justifyContent: "center" },
  boardTagText: { fontSize: 12, lineHeight: 16, fontWeight: "700" },
  talkBody: { fontSize: 16, lineHeight: 24, fontWeight: "500", color: colors.textPrimary, minHeight: 72 },
  talkFoot: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  avatar: { width: 24, height: 24, borderRadius: 12 },
  talkName: { flex: 1, fontSize: 13, lineHeight: 18, fontWeight: "600", color: colors.textSecondary },
  talkTime: { fontSize: 12, lineHeight: 16, color: colors.textTertiary },
});
