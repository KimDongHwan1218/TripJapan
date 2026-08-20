import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing, radius } from "@/styles";
import { useTrip, type Trip } from "@/contexts/TripContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { getTripPhase } from "@/domain/tripPhase";
import { CITY_META } from "@/constants/cities";
import { ENV } from "@/config/env";
import Spinner from "@/components/ui/Spinner";
import type { CommunityStackParamList } from "@/navigation/CommunityStackNavigator";

const API_BASE = ENV.API_BASE_URL;
const TRIP_REVIEW_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

type VisitedPlace = {
  id: number;
  name: string;
  address: string;
  category: string | null;
  thumbnail_url: string | null;
  reviewed: boolean;
};

type NavProp = NativeStackNavigationProp<CommunityStackParamList>;

// 타비톡 "여행후기" — 프리폼 글쓰기 대신 내 여행을 골라서 그 여행에서 남긴 장소 리뷰를
// 모아 하나의 여행후기 포스트로 발행하는 흐름 (장소 리뷰와 통일감을 갖기 위함)
export default function TripReviewComposeScreen() {
  const navigation = useNavigation<NavProp>();
  const insets = useSafeAreaInsets();
  const { trips } = useTrip();
  const { user, accessToken } = useAuth();
  const { showToast } = useToast();

  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [visitedPlaces, setVisitedPlaces] = useState<VisitedPlace[]>([]);
  const [placesLoading, setPlacesLoading] = useState(false);
  const [isItineraryPublic, setIsItineraryPublic] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const eligibleTrips = useMemo(() => {
    return trips.filter((t) => {
      const phase = getTripPhase(t);
      return (
        phase.status === "POST" &&
        Date.now() - new Date(t.end_date).getTime() < TRIP_REVIEW_WINDOW_MS
      );
    });
  }, [trips]);

  const loadVisitedPlaces = async (trip: Trip) => {
    if (!accessToken) return;
    setPlacesLoading(true);
    try {
      const res = await fetch(`${API_BASE}/trips/${trip.id}/visited-places`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = res.ok ? await res.json() : [];
      setVisitedPlaces(Array.isArray(data) ? data : []);
    } catch {
      setVisitedPlaces([]);
    } finally {
      setPlacesLoading(false);
    }
  };

  // 리뷰쓰기 화면에서 돌아왔을 때 작성완료 상태 갱신
  useFocusEffect(() => {
    if (selectedTrip) loadVisitedPlaces(selectedTrip);
  });

  const handleSelectTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    loadVisitedPlaces(trip);
  };

  const reviewedCount = visitedPlaces.filter((p) => p.reviewed).length;
  const canSubmit = selectedTrip && reviewedCount > 0 && !submitting;

  const handleSubmit = async () => {
    if (!selectedTrip || !user) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/community/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: Number(user.id),
          category: "review",
          title: null,
          content: "",
          image_urls: [],
          trip_id: selectedTrip.id,
          is_itinerary_public: isItineraryPublic,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message ?? "여행후기 게시에 실패했습니다.");
      }
      showToast("여행후기가 등록됐습니다.", "success");
      navigation.navigate("CommunityScreen", { fromCreate: true });
    } catch (err: any) {
      showToast(err.message ?? "여행후기 게시에 실패했습니다.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>여행후기 작성</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>내 여행 선택</Text>
        {eligibleTrips.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="airplane-outline" size={28} color={colors.neutral300} />
            <Text style={styles.emptyText}>
              여행후기는 여행 종료 후 7일 이내에만{"\n"}작성할 수 있어요
            </Text>
          </View>
        ) : (
          <View style={styles.tripList}>
            {eligibleTrips.map((trip) => {
              const selected = selectedTrip?.id === trip.id;
              return (
                <TouchableOpacity
                  key={trip.id}
                  style={[styles.tripChip, selected && styles.tripChipSelected]}
                  onPress={() => handleSelectTrip(trip)}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.tripChipText, selected && styles.tripChipTextSelected]}>
                    {CITY_META[trip.city]?.label.ko ?? trip.city}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {selectedTrip && (
          <>
            <Text style={styles.sectionLabel}>방문한 장소 리뷰</Text>
            {placesLoading ? (
              <Spinner />
            ) : visitedPlaces.length === 0 ? (
              <Text style={styles.emptyText}>일정에 등록된 장소가 없어요</Text>
            ) : (
              <View style={styles.placeList}>
                {visitedPlaces.map((place) => (
                  <View key={place.id} style={styles.placeCard}>
                    {place.thumbnail_url ? (
                      <Image source={{ uri: place.thumbnail_url }} style={styles.placeThumb} />
                    ) : (
                      <View style={[styles.placeThumb, styles.placeThumbPlaceholder]}>
                        <Ionicons name="location-outline" size={18} color={colors.neutral300} />
                      </View>
                    )}
                    <Text style={styles.placeName} numberOfLines={1}>{place.name}</Text>
                    {place.reviewed ? (
                      <View style={styles.placeDoneBadge}>
                        <Ionicons name="checkmark" size={12} color={colors.primary} />
                        <Text style={styles.placeDoneText}>완료</Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.placeWriteBtn}
                        onPress={() =>
                          navigation.navigate("ReviewWrite", { placeId: place.id, placeName: place.name })
                        }
                        activeOpacity={0.85}
                      >
                        <Text style={styles.placeWriteBtnText}>리뷰쓰기</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            )}

            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setIsItineraryPublic((v) => !v)}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, isItineraryPublic && styles.checkboxChecked]}>
                {isItineraryPublic && <Ionicons name="checkmark" size={14} color={colors.textWhite} />}
              </View>
              <Text style={styles.checkboxLabel}>여행 일정 공개하기</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity
          style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit}
          activeOpacity={0.85}
        >
          {submitting ? (
            <ActivityIndicator color={colors.textWhite} />
          ) : (
            <Text style={styles.submitBtnText}>
              {reviewedCount > 0 ? `여행후기 게시하기 (${reviewedCount})` : "리뷰를 먼저 작성해주세요"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    height: 52,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 16, fontWeight: "700", color: colors.textPrimary },

  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24, gap: 12 },
  sectionLabel: { fontSize: 14, fontWeight: "700", color: colors.textPrimary, marginTop: 8 },

  emptyBox: { alignItems: "center", paddingVertical: 24, gap: 8 },
  emptyText: { fontSize: 13, color: colors.textTertiary, textAlign: "center", lineHeight: 19 },

  tripList: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tripChip: {
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  tripChipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  tripChipText: { fontSize: 13, fontWeight: "600", color: colors.textSecondary },
  tripChipTextSelected: { color: colors.textWhite },

  placeList: { gap: 8 },
  placeCard: {
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingVertical: 8, paddingHorizontal: 10,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.borderSubtle,
  },
  placeThumb: { width: 36, height: 36, borderRadius: radius.sm },
  placeThumbPlaceholder: { backgroundColor: colors.neutral100, justifyContent: "center", alignItems: "center" },
  placeName: { flex: 1, fontSize: 13, fontWeight: "600", color: colors.textPrimary },
  placeDoneBadge: { flexDirection: "row", alignItems: "center", gap: 2 },
  placeDoneText: { fontSize: 11, fontWeight: "600", color: colors.primary },
  placeWriteBtn: { backgroundColor: colors.primary, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 6 },
  placeWriteBtnText: { fontSize: 11, fontWeight: "700", color: colors.textWhite },

  checkboxRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12 },
  checkbox: {
    width: 20, height: 20, borderRadius: 5,
    borderWidth: 1.5, borderColor: colors.border,
    justifyContent: "center", alignItems: "center",
  },
  checkboxChecked: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkboxLabel: { fontSize: 13, color: colors.textSecondary, fontWeight: "500" },

  footer: {
    paddingHorizontal: 26, paddingTop: 16, paddingBottom: 16,
    borderTopWidth: 1, borderTopColor: colors.borderSubtle,
    backgroundColor: colors.surface,
  },
  submitBtn: {
    backgroundColor: colors.primary, borderRadius: radius.pill,
    height: 50, alignItems: "center", justifyContent: "center",
  },
  submitBtnDisabled: { backgroundColor: colors.neutral300 },
  submitBtnText: { color: colors.textWhite, fontSize: 15, fontWeight: "700" },
});
