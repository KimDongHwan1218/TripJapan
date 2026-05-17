import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import Header from "@/components/Header/Header";
import { layout, colors, spacing, typography, radius } from "@/styles";
import type { TravelInfoItem, TravelCategory } from "./hooks/useTravelInfo";

const CATEGORY_LABELS: Record<string, string> = {
  전체: "전체",
  cafe: "카페",
  restaurant: "음식점",
  shop: "쇼핑",
  goods: "굿즈",
  event_place: "이벤트",
};

type Props = {
  categories: TravelCategory[];
  selectedCategory: TravelCategory;
  items: TravelInfoItem[];
  loading: boolean;
  error: string | null;
  onSelectCategory: (cat: TravelCategory) => void;
  onPressItem: (id: number) => void;
  onGoBack: () => void;
  onRefresh: () => void;
};

export default function TravelInfoView({
  categories,
  selectedCategory,
  items,
  loading,
  error,
  onSelectCategory,
  onPressItem,
  onGoBack,
  onRefresh,
}: Props) {
  return (
    <View style={styles.container}>
      <Header backwardButton="simple" title="여행 정보" />

      {/* 카테고리 탭 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabs}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.tab, cat === selectedCategory && styles.activeTab]}
            onPress={() => onSelectCategory(cat)}
          >
            <Text style={[styles.tabText, cat === selectedCategory && styles.activeTabText]}>
              {CATEGORY_LABELS[cat] ?? cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading && items.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={onRefresh}>
            <Text style={styles.retryText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onRefresh} tintColor={colors.primary} />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>해당 카테고리에 정보가 없습니다.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => onPressItem(item.id)}>
              <Image
                source={{ uri: item.thumbnail_url }}
                style={styles.thumbnail}
                resizeMode="cover"
              />
              <View style={styles.cardBody}>
                {item.category ? (
                  <Text style={styles.categoryBadge}>
                    {CATEGORY_LABELS[item.category] ?? item.category}
                  </Text>
                ) : null}
                <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.cardAddress} numberOfLines={1}>{item.address}</Text>
                {item.description ? (
                  <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
                ) : null}
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...layout.screen },

  tabs: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  tab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.neutral100,
  },
  activeTab: { backgroundColor: colors.primary },
  tabText: { fontSize: 13, fontWeight: "600", color: colors.textTertiary },
  activeTabText: { color: colors.textWhite },

  list: { padding: spacing.lg, gap: spacing.md },

  center: { flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 80, gap: spacing.md },
  emptyText: { ...typography.body, color: colors.textTertiary },
  errorText: { ...typography.body, color: colors.danger },
  retryBtn: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, backgroundColor: colors.primary, borderRadius: radius.sm },
  retryText: { color: colors.textWhite, fontWeight: "600" },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: "hidden",
    flexDirection: "row",
  },
  thumbnail: { width: 100, height: 100 },
  cardBody: { flex: 1, padding: spacing.md, justifyContent: "center", gap: 4 },
  categoryBadge: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 2,
  },
  cardTitle: { fontSize: 15, fontWeight: "700", color: colors.textPrimary },
  cardAddress: { ...typography.caption, color: colors.textTertiary },
  cardDesc: { ...typography.body, color: colors.textSecondary, marginTop: 2 },
});
