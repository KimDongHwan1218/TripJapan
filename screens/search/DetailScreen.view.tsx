import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, shadows } from "@/styles";
import { PlaceDetail, Review, YoutuberMeta } from "./hooks/usePlaceDetail";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";

type Props = {
  place: PlaceDetail | null;
  youtuberMeta?: YoutuberMeta | null;
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  favorited: boolean;
  onBack: () => void;
  onToggleFavorite?: () => void;
  onPressWriteReview?: () => void;
};

export default function DetailView({
  place, youtuberMeta, loading, error, onRetry, favorited, onBack, onToggleFavorite, onPressWriteReview,
}: Props) {
  if (error) {
    return (
      <View style={styles.loadingScreen}>
        <EmptyState
          icon="alert-circle-outline"
          title="장소 정보를 불러오지 못했습니다"
          description="네트워크 상태를 확인하고 다시 시도해주세요."
          actionLabel="다시 시도"
          onAction={onRetry}
        />
      </View>
    );
  }

  if (loading || !place) {
    return (
      <View style={styles.loadingScreen}>
        <Spinner />
      </View>
    );
  }

  const avgRating = place.reviews.length > 0
    ? place.reviews.reduce((s, r) => s + r.rating, 0) / place.reviews.length
    : null;

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 히어로 이미지 */}
        <View style={styles.heroWrap}>
          {place.thumbnail_url ? (
            <Image source={{ uri: place.thumbnail_url }} style={styles.hero} resizeMode="cover" />
          ) : (
            <View style={[styles.hero, styles.heroPlaceholder]}>
              <Ionicons name="image-outline" size={40} color={colors.neutral300} />
              <Text style={styles.heroPlaceholderText}>이미지 준비중입니다</Text>
            </View>
          )}
          {/* 플로팅 버튼들 */}
          <View style={styles.heroButtons}>
            <TouchableOpacity style={styles.floatBtn} onPress={onBack} activeOpacity={0.85}>
              <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
            {onToggleFavorite && (
              <TouchableOpacity style={styles.floatBtn} onPress={onToggleFavorite} activeOpacity={0.85}>
                <Ionicons
                  name={favorited ? "star" : "star-outline"}
                  size={20}
                  color={favorited ? colors.warning : colors.textPrimary}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 메인 콘텐츠 — 이미지 위에 겹쳐 올라오는 카드 */}
        <View style={styles.content}>

          {/* 카테고리 뱃지 + 별점 */}
          <View style={styles.metaRow}>
            {place.category ? (
              <Text style={styles.categoryBadgeText}>{CATEGORY_LABEL[place.category] ?? place.category}</Text>
            ) : null}
            {avgRating !== null && (
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={13} color={colors.warning} />
                <Text style={styles.ratingText}>{avgRating.toFixed(1)}</Text>
                <Text style={styles.ratingCount}>({place.reviews.length})</Text>
              </View>
            )}
          </View>

          {youtuberMeta && (
            <Text style={styles.youtuberBadgeText}>▶ {youtuberMeta.youtuber} 추천</Text>
          )}

          {/* 장소명 + 주소 */}
          <Text style={styles.name}>{place.name}</Text>
          <View style={styles.addressRow}>
            <Ionicons name="location-outline" size={14} color={colors.textTertiary} />
            <Text style={styles.address}>{place.address}</Text>
          </View>

          {/* 소개 */}
          {place.description ? (
            <View style={styles.descCard}>
              <Text style={styles.sectionLabel}>소개</Text>
              <Text style={styles.descText}>{place.description}</Text>
            </View>
          ) : null}

          {youtuberMeta?.ratingNote && (
            <View style={styles.descCard}>
              <Text style={styles.sectionLabel}>유튜버 평가</Text>
              <Text style={styles.youtuberRatingText}>{youtuberMeta.ratingNote}</Text>
            </View>
          )}

          {youtuberMeta?.sourceVideoUrl && (
            <Button
              label="유튜브에서 원본 영상 보기"
              variant="outline"
              style={styles.videoButton}
              onPress={() => Linking.openURL(youtuberMeta.sourceVideoUrl!)}
            />
          )}

          {/* 리뷰 섹션 — 유튜버 추천 장소는 자체 리뷰 대상이 아니므로 숨김 */}
          {onPressWriteReview && (
            <View style={styles.reviewSection}>
              <View style={styles.reviewSectionHeader}>
                <Text style={styles.sectionLabel}>
                  리뷰{place.reviews.length > 0 ? ` (${place.reviews.length})` : ""}
                </Text>
                <TouchableOpacity onPress={onPressWriteReview} style={styles.writeBtn} activeOpacity={0.75}>
                  <Ionicons name="pencil-outline" size={13} color={colors.primary} />
                  <Text style={styles.writeBtnText}>리뷰 작성</Text>
                </TouchableOpacity>
              </View>

              {place.reviews.length === 0 ? (
                <View style={styles.emptyReview}>
                  <Ionicons name="chatbubble-outline" size={32} color={colors.neutral300} />
                  <Text style={styles.emptyReviewText}>첫 번째 리뷰를 남겨보세요</Text>
                </View>
              ) : (
                <View style={styles.reviewList}>
                  {place.reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
                </View>
              )}
            </View>
          )}

        </View>
      </ScrollView>
    </View>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewCardTop}>
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((s) => (
            <Ionicons
              key={s}
              name={s <= review.rating ? "star" : "star-outline"}
              size={12}
              color={s <= review.rating ? colors.warning : colors.neutral300}
            />
          ))}
        </View>
        <Text style={styles.reviewDate}>
          {new Date(review.created_at).toLocaleDateString("ko-KR", { year: "numeric", month: "short", day: "numeric" })}
        </Text>
      </View>
      {review.title ? <Text style={styles.reviewTitle}>{review.title}</Text> : null}
      <Text style={styles.reviewContent}>{review.content}</Text>
      {review.image_url ? (
        <Image source={{ uri: review.image_url }} style={styles.reviewImage} resizeMode="cover" />
      ) : null}
    </View>
  );
}

const CATEGORY_LABEL: Record<string, string> = {
  event_place: "관광명소",
  restaurant: "맛집",
  cafe: "카페",
  shop: "쇼핑",
  goods: "굿즈",
};

const HERO_H = 300;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  loadingScreen: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background },

  // 히어로
  heroWrap: { height: HERO_H, position: "relative" },
  hero: { width: "100%", height: HERO_H },
  heroPlaceholder: {
    backgroundColor: colors.neutral100,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  heroPlaceholderText: { fontSize: 13, color: colors.neutral500 },
  heroButtons: {
    position: "absolute",
    top: 52,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  floatBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.92)",
    justifyContent: "center",
    alignItems: "center",
    ...shadows.sm,
  },

  // 메인 콘텐츠 카드
  content: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingTop: 24,
    paddingHorizontal: spacing.md,
    paddingBottom: 40,
  },

  // 메타 (뱃지 + 별점)
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  ratingText: { fontSize: 13, fontWeight: "700", color: colors.textPrimary },
  ratingCount: { fontSize: 12, color: colors.textTertiary },

  youtuberBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 10,
  },
  youtuberRatingText: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.primary,
    fontStyle: "italic",
  },
  videoButton: {
    marginBottom: 24,
  },

  // 이름 + 주소
  name: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  addressRow: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 4 },
  address: { fontSize: 13, color: colors.textTertiary, flex: 1 },

  // 소개
  descCard: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textTertiary,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  descText: { fontSize: 14, lineHeight: 22, color: colors.textSecondary },

  // 리뷰
  reviewSection: { gap: 12 },
  reviewSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  writeBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  writeBtnText: { fontSize: 13, color: colors.primary, fontWeight: "600" },
  emptyReview: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 8,
  },
  emptyReviewText: { fontSize: 14, color: colors.textTertiary },
  reviewList: {},
  reviewCard: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    gap: 6,
  },
  reviewCardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stars: { flexDirection: "row", gap: 2 },
  reviewDate: { fontSize: 11, color: colors.textTertiary },
  reviewTitle: { fontSize: 14, fontWeight: "700", color: colors.textPrimary },
  reviewContent: { fontSize: 14, color: colors.textSecondary, lineHeight: 21 },
  reviewImage: {
    width: "100%",
    height: 180,
    borderRadius: radius.md,
    marginTop: 4,
  },
});
