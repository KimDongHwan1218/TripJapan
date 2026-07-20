import React, { useCallback, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HomeStackParamList } from "@/navigation/HomeStackNavigator";
import { layout, colors, spacing, radius } from "@/styles";
import { ENV } from "@/config/env";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";

type Nav = NativeStackNavigationProp<HomeStackParamList>;

export type AlertItem = {
  id: string;
  title: string;
  date: string;
  content: string;
};

export default function TravelAlertDetailScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`${ENV.API_BASE_URL}/travel-alerts/japan`);
      if (!res.ok) throw new Error(`여행경보 조회 실패: ${res.status}`);
      setAlerts(await res.json());
    } catch (err) {
      console.error("[TravelAlertDetailScreen] 여행경보 조회 실패", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <View style={[layout.screen, { paddingTop: insets.top }]}>
      {/* Figma: "여행 경보" 가운데 타이틀 + back */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>여행 경보</Text>
        <View style={{ width: 38 }} />
      </View>

      {error ? (
        <View style={styles.centerWrap}>
          <EmptyState
            icon="alert-circle-outline"
            title="여행경보 정보를 불러오지 못했습니다"
            description="네트워크 상태를 확인하고 다시 시도해주세요."
            actionLabel="다시 시도"
            onAction={load}
          />
        </View>
      ) : loading ? (
        <View style={styles.centerWrap}>
          <Spinner />
        </View>
      ) : (
        <FlatList
          data={alerts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => navigation.navigate("TravelAlertItem", { alert: item })}
              activeOpacity={0.75}
            >
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                {item.date ? <Text style={styles.itemDate}>{item.date}</Text> : null}
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.neutral300} />
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.centerWrap}>
              <Text style={styles.emptyText}>현재 발령 중인 일본 여행경보가 없습니다.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Figma: 헤더 - back + 가운데 타이틀
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    backgroundColor: colors.surface,
  },
  backBtn: { width: 38, alignItems: "flex-start" },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },

  listContent: {
    paddingTop: 20, // Figma: 첫 아이템 y=20
  },

  centerWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textTertiary,
  },

  // Figma: 게시판아이템 360×84
  item: {
    height: 84,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: colors.surface,
  },
  itemContent: {
    flex: 1,
    gap: 6,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
    lineHeight: 22,
  },
  itemDate: {
    fontSize: 13,
    color: colors.textTertiary,
  },

  divider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    marginHorizontal: 20,
  },
});
