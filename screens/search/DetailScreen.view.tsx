import { View, Text, StyleSheet, ScrollView, Linking } from "react-native";
import Header from "@/components/Header/Header";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import Button from "@/components/ui/Button";
import { layout, colors, spacing, radius } from "@/styles";
import { PlaceDetail, YoutuberMeta } from "./hooks/usePlaceDetail";

type Props = {
  place: PlaceDetail | null;
  youtuberMeta?: YoutuberMeta | null;
  loading: boolean;
  error: boolean;
  onRetry: () => void;
};

export default function DetailView({ place, youtuberMeta, loading, error, onRetry }: Props) {
  if (error) {
    return (
      <View style={styles.center}>
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
      <View style={styles.center}>
        <Spinner />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header backwardButton="round" title={place.name} rightButtons={[{ type: "share" }]} />

      <ScrollView contentContainerStyle={styles.content}>
        <ImageWithFallback source={{ uri: place.thumbnail_url }} style={styles.image} />

        <View style={styles.section}>
          {youtuberMeta && (
            <View style={styles.youtuberBadge}>
              <Text style={styles.youtuberBadgeText}>▶ {youtuberMeta.youtuber} 추천</Text>
            </View>
          )}
          <Text style={styles.name}>{place.name}</Text>
          <Text style={styles.address}>{place.address}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>소개</Text>
          <Text style={styles.description}>{place.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>리뷰</Text>
          {youtuberMeta?.ratingNote ? (
            <Text style={styles.ratingNote}>{youtuberMeta.ratingNote}</Text>
          ) : (
            <Text style={{ color: colors.textTertiary, marginTop: 8 }}>아직 리뷰가 없습니다.</Text>
          )}
        </View>

        {youtuberMeta?.sourceVideoUrl && (
          <View style={styles.section}>
            <Button
              label="유튜브에서 원본 영상 보기"
              variant="outline"
              onPress={() => Linking.openURL(youtuberMeta.sourceVideoUrl!)}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...layout.screen },
  content: { ...layout.content },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  image: { width: "100%", height: 260 },
  section: { paddingHorizontal: spacing.md, paddingVertical: 14 },
  name: { fontSize: 22, fontWeight: "700", color: colors.textPrimary },
  address: { marginTop: 6, fontSize: 14, color: colors.textSecondary },
  sectionTitle: { fontSize: 17, fontWeight: "600", marginBottom: 6, color: colors.textPrimary },
  description: { fontSize: 15, lineHeight: 22, color: colors.textSecondary },
  youtuberBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.primarySoft,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    marginBottom: 6,
  },
  youtuberBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
  },
  ratingNote: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.primary,
    fontStyle: "italic",
    marginTop: 8,
  },
});
