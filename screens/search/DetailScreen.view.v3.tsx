import React, { useState } from "react";
import { View, Image, ScrollView, StyleSheet, TouchableOpacity, Linking } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Text from "@/components/ui/Text";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import { colors, radius, spacing } from "@/styles";
import { tones, CATEGORY_TONE } from "@/styles/tones";
import DetailView, { ReviewCard, CATEGORY_LABEL } from "./DetailScreen.view";
import { openDirections, sharePlace, copyAddress, hasCoords } from "./utils/placeActions";

type Props = React.ComponentProps<typeof DetailView>;
type IconName = keyof typeof Ionicons.glyphMap;

const CATEGORY_ICON: Record<string, IconName> = {
  attraction: "location",
  restaurant: "restaurant",
  cafe: "cafe",
  shopping: "bag-handle",
};

// 장소 상세 시안 C "요약 카드 + 탭 + 하단 고정 버튼".
//  - 맨 위는 큰 사진 대신 "명함" 카드: 사진이 있으면 사진 위에 이름, 없으면 카테고리 색 면 + 큰 아이콘
//  - 정보 / 리뷰를 탭으로 나눠 스크롤을 줄임(리뷰가 많아도 정보가 밀려나지 않음)
//  - 화면 아래 고정: [저장] 테두리 버튼 + [길찾기] 채운 버튼 — 이 화면에서 "정말 강조할" 버튼 하나만 채움(D2)
export default function DetailViewV3(p: Props) {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<"info" | "review">("info");
  // 더미 데이터는 사진 주소가 있어도 안 열리는 경우가 많아 → 실패하면 색 카드로
  const [photoBroken, setPhotoBroken] = useState(false);
  const { place } = p;

  if (p.error) {
    return (
      <View style={styles.center}>
        <EmptyState icon="alert-circle-outline" title="장소 정보를 불러오지 못했습니다" description="네트워크 상태를 확인하고 다시 시도해주세요." actionLabel="다시 시도" onAction={p.onRetry} />
      </View>
    );
  }
  if (p.loading || !place) {
    return (
      <View style={styles.center}>
        <Spinner />
      </View>
    );
  }

  const tone = tones[CATEGORY_TONE[place.category ?? ""] ?? "blue"];
  const icon = CATEGORY_ICON[place.category ?? ""] ?? "location";
  const photo = photoBroken ? null : place.images[0] ?? place.thumbnail_url ?? null;
  const avg = place.reviews.length > 0 ? place.reviews.reduce((s, r) => s + r.rating, 0) / place.reviews.length : null;
  const categoryLabel = place.category ? CATEGORY_LABEL[place.category] ?? place.category : null;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={p.onBack} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerBtn} onPress={() => sharePlace(place)} hitSlop={8}>
          <Ionicons name="share-outline" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xxxl }}>
        {/* 명함 카드 */}
        <View style={styles.cardWrap}>
          {photo ? (
            <View style={styles.photoCard}>
              <Image source={{ uri: photo }} style={styles.photoImg} resizeMode="cover" onError={() => setPhotoBroken(true)} />
              <View style={styles.photoShade} />
              <View style={styles.photoText}>
                {categoryLabel && <Text style={styles.photoCat}>{categoryLabel}</Text>}
                <Text style={styles.photoName} numberOfLines={2}>{place.name}</Text>
              </View>
            </View>
          ) : (
            <View style={[styles.toneCard, { backgroundColor: tone.bg }]}>
              <View style={styles.toneIcon}>
                <Ionicons name={icon} size={28} color={tone.fg} />
              </View>
              {categoryLabel && <Text style={[styles.toneCat, { color: tone.fg }]}>{categoryLabel}</Text>}
              <Text style={styles.toneName} numberOfLines={3}>{place.name}</Text>
            </View>
          )}
          <View style={styles.subRow}>
            {avg !== null ? (
              <>
                <Ionicons name="star" size={16} color={colors.warning} />
                <Text style={styles.subStrong}>{avg.toFixed(1)}</Text>
                <Text style={styles.sub}>리뷰 {place.reviews.length}</Text>
              </>
            ) : (
              <Text style={styles.sub}>아직 리뷰 없음</Text>
            )}
            {p.youtuberMeta && <Text style={styles.sub}>· ▶ {p.youtuberMeta.youtuber} 추천</Text>}
          </View>
        </View>

        {/* 탭 — 밑줄·글자색만(D2) */}
        <View style={styles.tabs}>
          {(
            [
              ["info", "정보"],
              ["review", `리뷰${place.reviews.length ? ` ${place.reviews.length}` : ""}`],
            ] as const
          ).map(([key, label]) => (
            <TouchableOpacity key={key} style={[styles.tab, tab === key && styles.tabOn]} onPress={() => setTab(key)} activeOpacity={0.7}>
              <Text style={[styles.tabText, tab === key && styles.tabTextOn]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {tab === "info" ? (
          <View style={styles.pane}>
            {place.address ? (
              <InfoRow icon="location-outline" label="주소" value={place.address} actionIcon="copy-outline" onAction={() => copyAddress(place)} />
            ) : null}
            {hasCoords(place) && (
              <TouchableOpacity activeOpacity={0.9} onPress={() => openDirections(place)} style={styles.miniMap}>
                <MapView
                  style={StyleSheet.absoluteFillObject}
                  // liteMode는 확대 값을 무시하고 도시 전체가 보이며 구글 툴바까지 붙어서(실기기) 일반 지도 + 조작 끄기로
                  toolbarEnabled={false}
                  rotateEnabled={false}
                  pitchEnabled={false}
                  initialRegion={{ latitude: place.latitude!, longitude: place.longitude!, latitudeDelta: 0.005, longitudeDelta: 0.005 }}
                  scrollEnabled={false}
                  zoomEnabled={false}
                  pointerEvents="none"
                >
                  <Marker coordinate={{ latitude: place.latitude!, longitude: place.longitude! }} pinColor={tone.fg} />
                </MapView>
              </TouchableOpacity>
            )}
            {place.description ? <InfoRow icon="information-circle-outline" label="소개" value={place.description} /> : null}
            {p.youtuberMeta?.ratingNote ? <InfoRow icon="logo-youtube" label="유튜버 평가" value={p.youtuberMeta.ratingNote} /> : null}
            {p.youtuberMeta?.sourceVideoUrl ? (
              <InfoRow
                icon="play-circle-outline"
                label="원본 영상"
                value="유튜브에서 보기"
                actionIcon="open-outline"
                onAction={() => Linking.openURL(p.youtuberMeta!.sourceVideoUrl!)}
              />
            ) : null}
          </View>
        ) : (
          <View style={styles.pane}>
            {p.onPressWriteReview && !p.hasMyReview && (
              <TouchableOpacity style={styles.writeBtn} onPress={p.onPressWriteReview} activeOpacity={0.7}>
                <Ionicons name="create-outline" size={18} color={colors.textPrimary} />
                <Text style={styles.writeText}>리뷰 쓰기</Text>
              </TouchableOpacity>
            )}
            {place.reviews.length === 0 ? (
              <Text style={styles.empty}>아직 리뷰가 없어요. 다녀왔다면 첫 리뷰를 남겨주세요.</Text>
            ) : (
              <View style={{ gap: spacing.md }}>
                {place.reviews.map((r) => (
                  <ReviewCard
                    key={r.id}
                    review={r}
                    isMine={!!p.currentUserId && String(r.user_id) === String(p.currentUserId)}
                    onDelete={p.onDeleteReview}
                    onReport={p.onReportReview}
                    onEdit={p.onEditReview}
                  />
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* 하단 고정 버튼 */}
      <View style={styles.bottomBar}>
        {p.onToggleFavorite && (
          <TouchableOpacity style={styles.saveBtn} onPress={p.onToggleFavorite} activeOpacity={0.7} accessibilityLabel={p.favorited ? "저장 해제" : "저장"}>
            <Ionicons name={p.favorited ? "star" : "star-outline"} size={22} color={p.favorited ? colors.warning : colors.textPrimary} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.goBtn} onPress={() => openDirections(place)} activeOpacity={0.8}>
          <Ionicons name="navigate" size={18} color={colors.textWhite} />
          <Text style={styles.goText}>길찾기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function InfoRow({ icon, label, value, actionIcon, onAction }: { icon: IconName; label: string; value: string; actionIcon?: IconName; onAction?: () => void }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={20} color={colors.neutral500} style={{ marginTop: 2 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
      {actionIcon && (
        <TouchableOpacity onPress={onAction} hitSlop={10} style={styles.infoAction}>
          <Ionicons name={actionIcon} size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.surface },
  header: { height: 56, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.sm },
  headerBtn: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },

  cardWrap: { paddingHorizontal: spacing.gutter },
  photoCard: { height: 220, borderRadius: radius.lg, borderCurve: "continuous", overflow: "hidden", justifyContent: "flex-end" },
  photoImg: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%" },
  photoShade: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.3)" },
  photoText: { padding: spacing.lg },
  photoCat: { fontSize: 12, lineHeight: 16, fontWeight: "700", color: colors.textWhite, opacity: 0.9 },
  photoName: { fontSize: 24, lineHeight: 32, fontWeight: "700", letterSpacing: -0.5, color: colors.textWhite },
  toneCard: { borderRadius: radius.lg, borderCurve: "continuous", padding: spacing.xl, gap: spacing.xs },
  toneIcon: { width: 52, height: 52, borderRadius: radius.md, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center", marginBottom: spacing.md },
  toneCat: { fontSize: 12, lineHeight: 16, fontWeight: "700" },
  toneName: { fontSize: 24, lineHeight: 32, fontWeight: "700", letterSpacing: -0.5, color: colors.textPrimary },
  subRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: spacing.md, flexWrap: "wrap" },
  subStrong: { fontSize: 14, lineHeight: 20, fontWeight: "700", color: colors.textPrimary },
  sub: { fontSize: 14, lineHeight: 20, color: colors.textTertiary },

  tabs: { flexDirection: "row", marginTop: spacing.xl, borderBottomWidth: 1, borderBottomColor: colors.divider, paddingHorizontal: spacing.gutter, gap: spacing.xl },
  tab: { height: 48, justifyContent: "center", borderBottomWidth: 2, borderBottomColor: "transparent", marginBottom: -1 },
  tabOn: { borderBottomColor: colors.textPrimary },
  tabText: { fontSize: 16, lineHeight: 24, fontWeight: "600", color: colors.textTertiary },
  tabTextOn: { color: colors.textPrimary, fontWeight: "700" },

  pane: { paddingHorizontal: spacing.gutter, paddingTop: spacing.lg, gap: spacing.lg },
  infoRow: { flexDirection: "row", gap: spacing.md, alignItems: "flex-start" },
  infoLabel: { fontSize: 12, lineHeight: 16, fontWeight: "600", color: colors.textTertiary },
  infoValue: { fontSize: 15, lineHeight: 22, color: colors.textPrimary, marginTop: 2 },
  infoAction: { width: 32, height: 32, alignItems: "center", justifyContent: "center" },
  miniMap: { height: 160, borderRadius: radius.md, borderCurve: "continuous", overflow: "hidden", backgroundColor: colors.neutral100 },

  writeBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.xs, height: 48, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border },
  writeText: { fontSize: 15, lineHeight: 22, fontWeight: "600", color: colors.textPrimary },
  empty: { fontSize: 14, lineHeight: 20, color: colors.textTertiary, paddingVertical: spacing.md },

  bottomBar: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.gutter,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    backgroundColor: colors.surface,
  },
  saveBtn: { width: 52, height: 52, borderRadius: radius.full, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  goBtn: { flex: 1, height: 52, borderRadius: radius.full, backgroundColor: colors.primary, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm },
  goText: { fontSize: 16, lineHeight: 24, fontWeight: "700", color: colors.textWhite },
});
