import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius } from "@/styles";
import { SearchStackParamList } from "@/navigation/SearchStackNavigator";
import { useAnimeTitles } from "./hooks/useAnimeTitles";
import Skeleton from "@/components/ui/Skeleton";

type Nav = NativeStackNavigationProp<SearchStackParamList, "AnimePilgrimageList">;

export default function AnimePilgrimageListScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { titles, loading } = useAnimeTitles(false);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top, height: 52 + insets.top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>애니성지</Text>
        <View style={{ width: 22 }} />
      </View>

      {loading && titles.length === 0 ? (
        <View style={styles.grid}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <View key={i} style={styles.card}>
              <Skeleton width="100%" height={140} radius={radius.md} />
              <Skeleton width="70%" height={14} style={{ marginTop: 8 }} />
            </View>
          ))}
        </View>
      ) : titles.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="film-outline" size={40} color={colors.neutral300} />
          <Text style={styles.emptyText}>등록된 애니 성지가 없어요</Text>
        </View>
      ) : (
        <FlatList
          data={titles}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={{ gap: 12 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("AnimePilgrimageDetail", { titleId: item.id, titleName: item.title })}
              activeOpacity={0.85}
            >
              {item.cover_image_url ? (
                <Image source={{ uri: item.cover_image_url }} style={styles.cover} resizeMode="cover" />
              ) : (
                <View style={[styles.cover, styles.coverPlaceholder]}>
                  <Ionicons name="film-outline" size={28} color={colors.neutral300} />
                </View>
              )}
              <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.cardSpotCount}>성지 {item.spot_count}곳</Text>
            </TouchableOpacity>
          )}
        />
      )}
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
  backBtn: { padding: 2 },
  title: { fontSize: 16, fontWeight: "800", color: colors.textPrimary },

  grid: { padding: spacing.md, gap: 12 },
  card: { flex: 1, marginBottom: 4 },
  cover: { width: "100%", height: 140, borderRadius: radius.md, backgroundColor: colors.neutral100 },
  coverPlaceholder: { justifyContent: "center", alignItems: "center" },
  cardTitle: { fontSize: 13, fontWeight: "700", color: colors.textPrimary, marginTop: 8 },
  cardSpotCount: { fontSize: 11, color: colors.textTertiary, marginTop: 2 },

  empty: { flex: 1, justifyContent: "center", alignItems: "center", gap: 10, marginTop: 80 },
  emptyText: { fontSize: 15, fontWeight: "600", color: colors.textSecondary },
});
