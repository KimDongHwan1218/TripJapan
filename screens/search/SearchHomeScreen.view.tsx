import React, { useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing, radius } from "@/styles";
import { Place } from "./hooks/usePlaces";
import BadgeRow from "./components/BadgeRow";

export type Category = {
  key: string;
  label: string;
};

type Props = {
  // 카테고리
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (key: string) => void;

  // 검색
  query: string;
  searchInput: string;
  onChangeSearchInput: (text: string) => void;
  onSubmitSearch: () => void;
  onClearSearch: () => void;

  // 장소 목록
  places: Place[];
  loading: boolean;
  onPressPlace: (place: Place) => void;

  // 카테고리별 카운트 (검색 결과 화면용)
  categoryCounts?: Record<string, number>;
};

// 카테고리별 섹션 타이틀/부제
const SECTION_META: Record<string, { title: string; sub: string }> = {
  popular: {
    title: "타비 실시간 인기 검색",
    sub: "지금 이 순간, 가장 많이 검색하는 키워드만 모았어요!",
  },
  event_place: {
    title: "관광정보 실시간 인기 검색",
    sub: "일본 관광! 가장 핫한 키워드",
  },
  restaurant: {
    title: "맛집 실시간 인기 검색",
    sub: "지금 가장 핫한 일본 맛집",
  },
  cafe: {
    title: "카페 실시간 인기 검색",
    sub: "일본 감성 카페 인기 키워드",
  },
  goods: {
    title: "굿즈/쇼핑 실시간 인기 검색",
    sub: "쇼핑 덕후들이 지금 찾는 키워드",
  },
  shop: {
    title: "쇼핑 실시간 인기 검색",
    sub: "지금 가장 인기 있는 쇼핑 스팟",
  },
};

export default function SearchHomeView({
  categories,
  selectedCategory,
  onSelectCategory,
  query,
  searchInput,
  onChangeSearchInput,
  onSubmitSearch,
  onClearSearch,
  places,
  loading,
  onPressPlace,
  categoryCounts,
}: Props) {
  const insets = useSafeAreaInsets();
  const isSearchMode = query.length > 0;
  const meta = SECTION_META[selectedCategory] ?? {
    title: "실시간 인기 검색",
    sub: "지금 가장 많이 찾는 키워드",
  };

  // 검색 결과 화면 렌더
  if (isSearchMode) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* 검색결과 헤더 */}
        <View style={styles.searchResultHeader}>
          <TouchableOpacity onPress={onClearSearch} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.searchResultTitle}>{query}</Text>
        </View>

        {/* 카테고리 카운트 칩 */}
        {categoryCounts && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            {categories.map((cat) => {
              const count = categoryCounts[cat.key] ?? 0;
              const isActive = selectedCategory === cat.key;
              return (
                <TouchableOpacity
                  key={cat.key}
                  style={[styles.chip, isActive && styles.chipActive]}
                  onPress={() => onSelectCategory(cat.key)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                    {cat.label} {count > 0 ? count : ""}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={places}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <PlaceListItem item={item} onPress={() => onPressPlace(item)} />}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={<EmptyState />}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    );
  }

  // 메인 검색 화면
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* 빨간 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.searchBar} onPress={() => {}}>
          <TextInput
            style={styles.searchInput}
            placeholder="도쿄가 궁금하신가요?"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={searchInput}
            onChangeText={onChangeSearchInput}
            onSubmitEditing={onSubmitSearch}
            returnKeyType="search"
          />
          <TouchableOpacity onPress={onSubmitSearch} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="search" size={20} color="#fff" />
          </TouchableOpacity>
        </TouchableOpacity>

        {/* 카테고리 탭 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabRow}
        >
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.key;
            return (
              <TouchableOpacity
                key={cat.key}
                style={styles.tab}
                onPress={() => onSelectCategory(cat.key)}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {cat.label}
                </Text>
                {isActive && <View style={styles.tabUnderline} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 콘텐츠 */}
      <FlatList
        data={places}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PlaceListItem item={item} onPress={() => onPressPlace(item)} />}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{meta.title}</Text>
            <Text style={styles.sectionSub}>{meta.sub}</Text>
          </View>
        }
        ListFooterComponent={
          places.length > 0 ? (
            <TouchableOpacity style={styles.moreBtn} activeOpacity={0.7}>
              <Text style={styles.moreBtnText}>
                {SECTION_META[selectedCategory]?.title.split(" ")[0] ?? "전체"} 모두보기 {">"}
              </Text>
            </TouchableOpacity>
          ) : null
        }
        ListEmptyComponent={loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
        ) : (
          <EmptyState />
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

function PlaceListItem({ item, onPress }: { item: Place; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.listItem} onPress={onPress} activeOpacity={0.8}>
      <Image
        source={{ uri: item.thumbnail_url }}
        style={styles.thumbnail}
        resizeMode="cover"
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.itemCategory}>{item.category ?? ""}</Text>
        <BadgeRow badges={item.badges} />
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.neutral300} />
    </TouchableOpacity>
  );
}

function EmptyState() {
  return (
    <View style={styles.empty}>
      <Ionicons name="search-outline" size={40} color={colors.neutral300} />
      <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  // 빨간 헤더
  header: {
    backgroundColor: colors.primary,
    paddingBottom: 0,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: spacing.md,
    marginTop: 12,
    marginBottom: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 10 : 6,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#fff",
    padding: 0,
  },

  // 카테고리 탭
  tabRow: {
    paddingHorizontal: spacing.md,
    gap: 4,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  tabText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.65)",
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#fff",
    fontWeight: "700",
  },
  tabUnderline: {
    position: "absolute",
    bottom: 0,
    left: 12,
    right: 12,
    height: 2.5,
    backgroundColor: "#fff",
    borderRadius: 2,
  },

  // 섹션 헤더
  sectionHeader: {
    paddingHorizontal: spacing.md,
    paddingTop: 20,
    paddingBottom: 12,
    gap: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  sectionSub: {
    fontSize: 12,
    color: colors.neutral500,
  },

  // 리스트 아이템
  listContent: { paddingBottom: 24 },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  itemInfo: { flex: 1, gap: 4 },
  itemName: { fontSize: 15, fontWeight: "600", color: colors.textPrimary },
  itemCategory: { fontSize: 12, color: colors.neutral500 },

  // 모두보기
  moreBtn: {
    alignItems: "center",
    paddingVertical: 18,
  },
  moreBtnText: {
    fontSize: 13,
    color: colors.neutral500,
    fontWeight: "500",
  },

  // 검색 결과 헤더
  searchResultHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    height: 52,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    gap: 12,
  },
  backBtn: { padding: 4 },
  searchResultTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.textPrimary,
  },

  // 카운트 칩
  chipRow: {
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#fff",
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: { fontSize: 13, color: colors.textSecondary, fontWeight: "500" },
  chipTextActive: { color: "#fff", fontWeight: "700" },

  // 빈 상태
  empty: { alignItems: "center", marginTop: 60, gap: 12 },
  emptyText: { fontSize: 14, color: colors.neutral500 },
});
