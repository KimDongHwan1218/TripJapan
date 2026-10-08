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

// 장소 상세 시안 B "지도 중심".
//  - 사진이 없는 장소가 대부분이라 A는 맨 위 300px이 회색 "이미지 준비중"이었음 → 맨 위를 지도로(좌표는 거의 다 있음)
//  - 사진이 있으면 이름 아래 가로 사진 줄로 내려보냄
//  - 길찾기 / 저장 / 공유 3버튼(테두리만, D2) — "여기 어떻게 가지?"가 상세 화면의 첫 질문이라서
//  - 리뷰는 평균 점수 큰 숫자(D7) 요약 → 카드(A의 ReviewCard 재사용)
export default function DetailViewV2(p: Props) {
  const insets = useSafeAreaInsets();
  const { place } = p;
  // 안 열리는 사진(더미 데이터)은 줄에서 빼서 회색 상자가 남지 않게
  const [broken, setBroken] = useState<Record<string, true>>({});

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
  const photos = (place.images.length > 0 ? place.images : place.thumbnail_url ? [place.thumbnail_url] : []).filter((u) => !broken[u]);
  const avg = place.reviews.length > 0 ? place.reviews.reduce((s, r) => s + r.rating, 0) / place.reviews.length : null;

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xxxl }}>
        <View style={styles.top}>
          {hasCoords(place) ? (
            <MapView
              style={StyleSheet.absoluteFillObject}
              initialRegion={{ latitude: place.latitude!, longitude: place.longitude!, latitudeDelta: 0.006, longitudeDelta: 0.006 }}
              scrollEnabled={false}
              zoomEnabled={false}
              rotateEnabled={false}
              pitchEnabled={false}
              toolbarEnabled={false}
              onPress={() => openDirections(place)}
            >
              <Marker coordinate={{ latitude: place.latitude!, longitude: place.longitude! }}>
                <View style={[styles.pin, { backgroundColor: tone.fg }]}>
                  <Ionicons name={icon} size={18} color={colors.textWhite} />
                </View>
              </Marker>
            </MapView>
          ) : (
            <View style={[StyleSheet.absoluteFillObject, styles.noMap, { backgroundColor: tone.bg }]}>
              <Ionicons name={icon} size={48} color={tone.fg} />
            </View>
          )}
          <View style={[styles.floatRow, { top: insets.top + spacing.sm }]}>
            <TouchableOpacity style={styles.floatBtn} onPress={p.onBack} activeOpacity={0.7}>
              <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.metaRow}>
            {place.category ? (
              <View style={[styles.catChip, { backgroundColor: tone.bg }]}>
                <Ionicons name={icon} size={14} color={tone.fg} />
                <Text style={[styles.catText, { color: tone.fg }]}>{CATEGORY_LABEL[place.category] ?? place.category}</Text>
              </View>
            ) : null}
            {avg !== null && (
              <View style={styles.ratingInline}>
                <Ionicons name="star" size={14} color={colors.warning} />
                <Text style={styles.ratingInlineText}>
                  {avg.toFixed(1)} <Text style={styles.muted}>({place.reviews.length})</Text>
                </Text>
              </View>
            )}
          </View>

          {p.youtuberMeta && <Text style={styles.youtuber}>▶ {p.youtuberMeta.youtuber} 추천</Text>}
          <Text style={styles.name}>{place.name}</Text>
          {place.address ? (
            <TouchableOpacity style={styles.addrRow} onPress={() => copyAddress(place)} activeOpacity={0.6}>
              <Text style={styles.addr}>{place.address}</Text>
              <Ionicons name="copy-outline" size={14} color={colors.neutral500} />
            </TouchableOpacity>
          ) : null}

          <View style={styles.actions}>
            <ActionBtn icon="navigate-outline" label="길찾기" onPress={() => openDirections(place)} />
            {p.onToggleFavorite && (
              <ActionBtn
                icon={p.favorited ? "star" : "star-outline"}
                iconColor={p.favorited ? colors.warning : undefined}
                label={p.favorited ? "저장됨" : "저장"}
                onPress={p.onToggleFavorite}
              />
            )}
            <ActionBtn icon="share-outline" label="공유" onPress={() => sharePlace(place)} />
          </View>

          {photos.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photoRow} style={styles.photoStrip}>
              {photos.map((uri, i) => (
                <Image
                  key={`${uri}-${i}`}
                  source={{ uri }}
                  style={styles.photo}
                  resizeMode="cover"
                  onError={() => setBroken((b) => ({ ...b, [uri]: true }))}
                />
              ))}
            </ScrollView>
          )}

          {place.description ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>소개</Text>
              <Text style={styles.desc}>{place.description}</Text>
            </View>
          ) : null}

          {p.youtuberMeta?.ratingNote && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>유튜버 평가</Text>
              <Text style={styles.desc}>{p.youtuberMeta.ratingNote}</Text>
            </View>
          )}
          {p.youtuberMeta?.sourceVideoUrl && (
            <TouchableOpacity style={styles.linkRow} onPress={() => Linking.openURL(p.youtuberMeta!.sourceVideoUrl!)}>
              <Ionicons name="logo-youtube" size={18} color={colors.textPrimary} />
              <Text style={styles.linkText}>유튜브에서 원본 영상 보기</Text>
            </TouchableOpacity>
          )}

          {p.onPressWriteReview && (
            <View style={styles.section}>
              <View style={styles.reviewHead}>
                <Text style={styles.sectionTitle}>리뷰 {place.reviews.length > 0 ? place.reviews.length : ""}</Text>
                {!p.hasMyReview && (
                  <TouchableOpacity style={styles.writeBtn} onPress={p.onPressWriteReview} activeOpacity={0.7}>
                    <Text style={styles.writeText}>리뷰 쓰기</Text>
                  </TouchableOpacity>
                )}
              </View>
              {avg !== null ? (
                <View style={styles.summary}>
                  <Text style={styles.avgNum}>{avg.toFixed(1)}</Text>
                  <View style={{ gap: 4 }}>
                    <View style={{ flexDirection: "row" }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Ionicons key={s} name={s <= Math.round(avg) ? "star" : "star-outline"} size={16} color={s <= Math.round(avg) ? colors.warning : colors.neutral300} />
                      ))}
                    </View>
                    <Text style={styles.muted}>리뷰 {place.reviews.length}개</Text>
                  </View>
                </View>
              ) : (
                <Text style={styles.emptyReview}>아직 리뷰가 없어요. 다녀왔다면 첫 리뷰를 남겨주세요.</Text>
              )}
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
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function ActionBtn({ icon, label, onPress, iconColor }: { icon: IconName; label: string; onPress: () => void; iconColor?: string }) {
  return (
    <TouchableOpacity style={styles.action} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name={icon} size={20} color={iconColor ?? colors.textPrimary} />
      <Text style={styles.actionText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.surface },
  top: { height: 280, backgroundColor: colors.neutral100 },
  noMap: { alignItems: "center", justifyContent: "center" },
  pin: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: colors.surface },
  floatRow: { position: "absolute", left: spacing.lg, right: spacing.lg, flexDirection: "row" },
  floatBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.divider },

  body: { paddingHorizontal: spacing.gutter, paddingTop: spacing.xl },
  metaRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  catChip: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: spacing.sm, height: 26, borderRadius: radius.full },
  catText: { fontSize: 12, lineHeight: 16, fontWeight: "700" },
  ratingInline: { flexDirection: "row", alignItems: "center", gap: 2 },
  ratingInlineText: { fontSize: 14, lineHeight: 20, fontWeight: "700", color: colors.textPrimary },
  muted: { fontSize: 12, lineHeight: 16, fontWeight: "500", color: colors.textTertiary },
  youtuber: { fontSize: 12, lineHeight: 16, fontWeight: "700", color: colors.textSecondary, marginTop: spacing.sm },
  name: { fontSize: 24, lineHeight: 32, fontWeight: "700", letterSpacing: -0.5, color: colors.textPrimary, marginTop: spacing.sm },
  addrRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: spacing.xs },
  addr: { flexShrink: 1, fontSize: 14, lineHeight: 20, color: colors.textSecondary },

  actions: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.xl },
  action: {
    flex: 1,
    height: 64,
    borderRadius: radius.md,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  actionText: { fontSize: 12, lineHeight: 16, fontWeight: "600", color: colors.textPrimary },

  photoStrip: { marginTop: spacing.xl, marginHorizontal: -spacing.gutter },
  photoRow: { paddingHorizontal: spacing.gutter, gap: spacing.sm },
  photo: { width: 120, height: 120, borderRadius: radius.md, backgroundColor: colors.neutral100 },

  section: { marginTop: spacing.xxl },
  sectionTitle: { fontSize: 18, lineHeight: 26, fontWeight: "700", letterSpacing: -0.18, color: colors.textPrimary, marginBottom: spacing.sm },
  desc: { fontSize: 15, lineHeight: 24, color: colors.textSecondary },
  linkRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.lg, minHeight: 44 },
  linkText: { fontSize: 14, lineHeight: 20, fontWeight: "600", color: colors.textPrimary, textDecorationLine: "underline" },

  reviewHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  writeBtn: { height: 36, paddingHorizontal: spacing.md, borderRadius: radius.full, borderWidth: 1, borderColor: colors.border, justifyContent: "center" },
  writeText: { fontSize: 14, lineHeight: 20, fontWeight: "600", color: colors.textPrimary },
  summary: { flexDirection: "row", alignItems: "center", gap: spacing.lg, paddingVertical: spacing.md, marginBottom: spacing.md },
  avgNum: { fontSize: 40, lineHeight: 48, fontWeight: "700", letterSpacing: -0.8, color: colors.textPrimary }, // D7
  emptyReview: { fontSize: 14, lineHeight: 20, color: colors.textTertiary, paddingVertical: spacing.md },
});
