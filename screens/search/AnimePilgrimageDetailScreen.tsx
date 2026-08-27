import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing, radius } from "@/styles";
import { ENV } from "@/config/env";
import type { SearchStackParamList } from "@/navigation/SearchStackNavigator";

const API_BASE = ENV.API_BASE_URL;

type Grade = "A" | "B" | "C" | "D";

// 지도 준비 전/데이터 없음 상태의 fallback — 일본 전역이 보이는 정도
const JAPAN_FALLBACK_REGION = { latitude: 36.5, longitude: 138.0, latitudeDelta: 12, longitudeDelta: 12 };

type Spot = {
  id: number;
  spot_id: string | null;
  name: string;
  name_ja: string | null;
  theme_tags: string | null;
  detail_tags: string | null;
  latitude: number;
  longitude: number;
  description: string | null;
  scene_reference: string | null;
  source_url: string | null;
  cross_check_url: string | null;
  verification_grade: Grade | null;
  coordinate_status: string | null;
  photo_rights_status: string | null;
};

type RouteProps = RouteProp<SearchStackParamList, "AnimePilgrimageDetail">;
type NavProp = NativeStackNavigationProp<SearchStackParamList>;

export default function AnimePilgrimageDetailScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavProp>();
  const insets = useSafeAreaInsets();
  const { titleId, titleName } = route.params;

  const mapRef = useRef<MapView>(null);
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/anime-pilgrimage/titles/${titleId}/spots`)
      .then((res) => res.json())
      .then((data) => setSpots(data.spots ?? []))
      .catch(() => setSpots([]))
      .finally(() => setLoading(false));
  }, [titleId]);

  // 지도가 initialRegion(일본 fallback)으로 뜬 뒤, 실제 성지 좌표 범위로 카메라를 맞춤.
  // onMapReady 전에 fitToCoordinates를 호출하면 네이티브 지도가 이를 무시해서
  // 세계지도 기본 위치(적도 부근)에 그대로 머무는 문제가 있었음 — mapReady를 기다려야 함.
  // animated로 카메라를 움직이면 애니메이션이 끝나기 전 마커가 먼저 배치돼 터치가
  // 씹히는 경우가 있어(특히 성지가 넓게 퍼진 작품) animated:false로 즉시 이동시킴.
  useEffect(() => {
    if (!mapReady || spots.length === 0 || !mapRef.current) return;
    mapRef.current.fitToCoordinates(
      spots.map((s) => ({ latitude: s.latitude, longitude: s.longitude })),
      { edgePadding: { top: 40, right: 40, bottom: 40, left: 40 }, animated: false }
    );
  }, [mapReady, spots]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{titleName}</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* 상단: 지도 */}
      <View style={styles.mapArea}>
        {loading ? (
          <View style={styles.mapLoading}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : (
          <MapView
            ref={mapRef}
            style={{ flex: 1 }}
            initialRegion={JAPAN_FALLBACK_REGION}
            onMapReady={() => setMapReady(true)}
            onPress={() => setSelectedSpot(null)}
          >
            {spots.map((spot) => {
              const isSelected = selectedSpot?.id === spot.id;
              return (
                <Marker
                  key={spot.id}
                  coordinate={{ latitude: spot.latitude, longitude: spot.longitude }}
                  anchor={{ x: 0.5, y: 0.5 }}
                  onPress={(e) => {
                    e.stopPropagation();
                    setSelectedSpot(spot);
                  }}
                >
                  <View style={[styles.pin, isSelected && styles.pinSelected]} />
                </Marker>
              );
            })}
          </MapView>
        )}
      </View>

      {/* 하단: 설명 패널 */}
      <View style={styles.detailArea}>
        {!selectedSpot ? (
          <View style={styles.emptyDetail}>
            <Ionicons name="location-outline" size={28} color={colors.neutral300} />
            <Text style={styles.emptyDetailText}>
              {loading ? "성지 정보를 불러오는 중..." : `핀을 눌러 성지 정보를 확인하세요 (${spots.length}곳)`}
            </Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.detailContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.detailName} numberOfLines={2}>{selectedSpot.name}</Text>
            {selectedSpot.name_ja ? (
              <Text style={styles.detailNameJa}>{selectedSpot.name_ja}</Text>
            ) : null}

            {selectedSpot.scene_reference ? (
              <View style={styles.sceneBadge}>
                <Ionicons name="film-outline" size={12} color={colors.primary} />
                <Text style={styles.sceneBadgeText}>{selectedSpot.scene_reference}</Text>
              </View>
            ) : null}

            {selectedSpot.description ? (
              <Text style={styles.detailDesc}>{selectedSpot.description}</Text>
            ) : null}

            {selectedSpot.detail_tags ? (
              <View style={styles.tagRow}>
                {selectedSpot.detail_tags
                  .split("/")
                  .map((t) => t.trim())
                  .filter(Boolean)
                  .map((tag, i) => (
                    <View key={i} style={styles.tagChip}>
                      <Text style={styles.tagChipText}>{tag}</Text>
                    </View>
                  ))}
              </View>
            ) : null}

            <View style={styles.sourceRow}>
              {selectedSpot.source_url ? (
                <TouchableOpacity onPress={() => Linking.openURL(selectedSpot.source_url!)}>
                  <Text style={styles.sourceLink}>출처 보기 ↗</Text>
                </TouchableOpacity>
              ) : null}
              {selectedSpot.cross_check_url ? (
                <TouchableOpacity onPress={() => Linking.openURL(selectedSpot.cross_check_url!)}>
                  <Text style={styles.sourceLink}>교차검증 자료 ↗</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </ScrollView>
        )}
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
  headerTitle: { flex: 1, textAlign: "center", fontSize: 16, fontWeight: "700", color: colors.textPrimary },

  mapArea: { flex: 1, position: "relative" },
  mapLoading: { flex: 1, justifyContent: "center", alignItems: "center" },
  pin: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: colors.primary,
  },
  pinSelected: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 3,
  },

  detailArea: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
    backgroundColor: colors.surface,
  },
  emptyDetail: { flex: 1, justifyContent: "center", alignItems: "center", gap: 8, padding: spacing.lg },
  emptyDetailText: { fontSize: 13, color: colors.textTertiary, textAlign: "center" },

  detailContent: { padding: spacing.lg, gap: 10 },
  detailName: { fontSize: 17, fontWeight: "700", color: colors.textPrimary },
  detailNameJa: { fontSize: 13, color: colors.textTertiary, marginTop: -6 },

  sceneBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  sceneBadgeText: { fontSize: 12, fontWeight: "600", color: colors.primary },

  detailDesc: { fontSize: 14, lineHeight: 21, color: colors.textSecondary },

  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  tagChip: {
    backgroundColor: colors.neutral100,
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagChipText: { fontSize: 11, color: colors.textTertiary },

  sourceRow: { flexDirection: "row", gap: 16, marginTop: 4 },
  sourceLink: { fontSize: 12, fontWeight: "600", color: colors.primary },
});
