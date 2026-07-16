import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useTrip } from "@/contexts/TripContext";
import { CITY_META } from "@/constants/cities";
import { colors, spacing, radius } from "@/styles";
import AddTripModal from "./components/AddTripModal";
import type { Trip } from "@/contexts/TripContext";
import Spinner from "@/components/ui/Spinner";

const TripHistoryScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const { trips, tripsState, activeTrip, deleteTrip } = useTrip();

  const handleSelectTrip = (trip: Trip) => {
    navigation.navigate("PastTripScreen", {
      tripId: trip.id,
      city: trip.city,
      start_date: trip.start_date,
      end_date: trip.end_date,
    });
  };

  const handleDeleteTrip = (trip: Trip) => {
    Alert.alert(
      "여행 삭제",
      `${CITY_META[trip.city]?.label.ko ?? trip.city} 여행을 삭제하시겠습니까?\n삭제된 일정은 복구할 수 없습니다.`,
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTrip(trip.id);
            } catch {
              Alert.alert("오류", "삭제 중 오류가 발생했습니다.");
            }
          },
        },
      ]
    );
  };

  const formatDateRange = (trip: Trip) => {
    try {
      const s = new Date(trip.start_date).toLocaleDateString("ko-KR", {
        month: "numeric",
        day: "numeric",
      });
      const e = new Date(trip.end_date).toLocaleDateString("ko-KR", {
        month: "numeric",
        day: "numeric",
      });
      const diff = Math.round(
        (new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      const nights = diff > 0 ? `${diff}박${diff + 1}일` : "당일치기";
      return `${s} - ${e} · ${nights}`;
    } catch {
      return `${trip.start_date} - ${trip.end_date}`;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>지난 여행 보기</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* 새 여행 추가 버튼 */}
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setAddModalVisible(true)}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={18} color={colors.textWhite} />
          <Text style={styles.addBtnText}>새 여행 일정 만들기</Text>
        </TouchableOpacity>

        {/* 여행 목록 */}
        {tripsState.status === "loading" && trips.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Spinner />
          </View>
        ) : trips.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Ionicons name="airplane-outline" size={48} color={colors.neutral300} />
            <Text style={styles.emptyTitle}>아직 여행이 없어요</Text>
            <Text style={styles.emptySubtitle}>첫 여행을 만들어보세요!</Text>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>내 여행</Text>
            {trips.map((trip) => {
              const meta = CITY_META[trip.city];
              const isActive = activeTrip?.id === trip.id;
              return (
                <TouchableOpacity
                  key={trip.id}
                  style={styles.tripCard}
                  onPress={() => handleSelectTrip(trip)}
                  activeOpacity={0.88}
                >
                  <Image
                    source={meta?.image}
                    style={styles.tripCardImage}
                    resizeMode="cover"
                  />
                  <View style={styles.tripCardOverlay} />
                  <View style={styles.tripCardContent}>
                    {isActive && (
                      <View style={styles.activeBadge}>
                        <Text style={styles.activeBadgeText}>현재 여행</Text>
                      </View>
                    )}
                    <Text style={styles.tripCardCity}>
                      {meta?.label.ko ?? trip.city}
                    </Text>
                    <Text style={styles.tripCardDate}>
                      {formatDateRange(trip)}
                    </Text>
                  </View>
                  <View style={styles.tripCardArrow}>
                    <Ionicons name="chevron-forward" size={20} color={colors.textWhite} />
                  </View>
                  {/* 삭제 버튼 */}
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDeleteTrip(trip)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="trash-outline" size={18} color="rgba(255,255,255,0.8)" />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
          </>
        )}
      </ScrollView>

      <AddTripModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  backBtn: {
    width: 38,
    alignItems: "flex-start",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },

  content: {
    padding: spacing.md,
    paddingBottom: 40,
    gap: 16,
  },

  // Add button
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: 14,
  },
  addBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textWhite,
  },

  // Section
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: 4,
  },

  // Trip card
  tripCard: {
    borderRadius: radius.lg,
    overflow: "hidden",
    height: 120,
  },
  tripCardImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  tripCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  tripCardContent: {
    flex: 1,
    padding: spacing.md,
    justifyContent: "flex-end",
  },
  tripCardArrow: {
    position: "absolute",
    right: spacing.md,
    bottom: spacing.md,
  },
  deleteBtn: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    padding: 6,
  },
  activeBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: spacing.xs,
  },
  activeBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textWhite,
  },
  tripCardCity: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textWhite,
    letterSpacing: -0.3,
  },
  tripCardDate: {
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
    marginTop: 3,
    fontWeight: "500",
  },

  // Empty state
  emptyWrap: {
    alignItems: "center",
    paddingVertical: 48,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default TripHistoryScreen;
