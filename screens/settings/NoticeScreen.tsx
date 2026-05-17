import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header/Header";
import { layout, typography, spacing, colors, radius } from "@/styles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SettingsStackParamList } from "@/navigation/SettingsStackNavigator";
import { ENV } from "@/config/env";

type NavigationProp = NativeStackNavigationProp<SettingsStackParamList, "NoticeScreen">;

type Notice = {
  id: string;
  title: string;
  createdAt: string;
  isNew?: boolean;
};

const MOCK_NOTICES: Notice[] = [
  { id: "1", title: "타비 서비스 이용약관 개정 안내", createdAt: "2026-04-01", isNew: true },
  { id: "2", title: "개인정보 처리방침 변경 안내", createdAt: "2026-03-15" },
  { id: "3", title: "타비 앱 v1.2 업데이트 안내", createdAt: "2026-03-01" },
  { id: "4", title: "일본 여행 정보 서비스 오픈 안내", createdAt: "2026-02-10" },
  { id: "5", title: "커뮤니티 이용 정책 안내", createdAt: "2026-01-20" },
];

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export default function NoticeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchNotices() {
    try {
      const res = await fetch(`${ENV.API_BASE_URL}/notices`);
      if (res.ok) {
        const data = await res.json();
        setNotices(Array.isArray(data) && data.length > 0 ? data : MOCK_NOTICES);
      } else {
        setNotices(MOCK_NOTICES);
      }
    } catch {
      // 서버 공지 API 미구현 시 mock 데이터 사용
      setNotices(MOCK_NOTICES);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchNotices();
  }, []);

  function handleRefresh() {
    setRefreshing(true);
    fetchNotices();
  }

  return (
    <View style={styles.container}>
      <Header title="공지사항" backwardButton="simple" />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={notices}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
          contentContainerStyle={notices.length === 0 ? styles.emptyContainer : undefined}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="megaphone-outline" size={48} color={colors.neutral300} />
              <Text style={styles.emptyTitle}>등록된 공지사항이 없습니다</Text>
              <Text style={styles.emptyDesc}>새로운 소식이 생기면 알려드릴게요</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              activeOpacity={0.75}
              onPress={() =>
                navigation.navigate("NoticeDetailScreen", { noticeId: item.id })
              }
            >
              <View style={styles.itemContent}>
                <View style={styles.itemTitleRow}>
                  {item.isNew && (
                    <View style={styles.newBadge}>
                      <Text style={styles.newBadgeText}>NEW</Text>
                    </View>
                  )}
                  <Text style={styles.itemTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                </View>
                <Text style={styles.itemDate}>{formatDate(item.createdAt)}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.neutral300} />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...layout.screen },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyContainer: { flex: 1 },

  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
  },
  itemContent: { flex: 1, gap: 6 },
  itemTitleRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  itemTitle: { ...typography.body, color: colors.textPrimary, flex: 1 },
  itemDate: { ...typography.caption, color: colors.textTertiary },

  newBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  newBadgeText: { fontSize: 10, fontWeight: "700", color: colors.textWhite },

  divider: { height: 1, backgroundColor: colors.borderSubtle },

  empty: { flex: 1, justifyContent: "center", alignItems: "center", gap: spacing.sm },
  emptyTitle: { fontSize: 15, fontWeight: "600", color: colors.textSecondary, marginTop: spacing.sm },
  emptyDesc: { ...typography.caption, color: colors.textTertiary },
});
