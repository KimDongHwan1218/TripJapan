import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Header from "@/components/Header/Header";
import { SearchStackParamList } from "@/navigation/SearchStackNavigator";
import BadgeRow from "./components/BadgeRow";
import { ENV } from "@/config/env";

const API_BASE = ENV.API_BASE_URL;

type NavigationProp = NativeStackNavigationProp<
  SearchStackParamList,
  "SearchHomeScreen"
>;

type BadgeType =
  | "HOT"
  | "NEAR_MY_TRIP"
  | "TRENDING"
  | "LOCAL_PICK"
  | "HIGH_BOOKING"
  | "HIGH_REVIEW";

type Place = {
  id: number;
  name: string;
  address: string;
  category: string | null;
  thumbnail_url: string;
  badges?: BadgeType[];
};
export default function SearchHomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const query = (route.params as { query?: string })?.query?.trim() || "";

  const categories = ["cafe", "shop", "restaurant", "goods","event_place"];
  const [selectedCategory, setSelectedCategory] = useState("cafe");
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPlaces = useCallback(async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();
      params.append("category", selectedCategory);
      if (query) params.append("keyword", query);

      const res = await fetch(`${API_BASE}/places?${params.toString()}`);
      const data = await res.json();

      setPlaces(data);
    } catch (err) {
      console.error("places fetch 실패", err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, query]);

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  const renderItem = ({ item }: { item: Place }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("DetailScreen", { placeId: item.id })
      }
    >
      <Image source={{ uri: item.thumbnail_url }} style={styles.image} />
      <View style={styles.textBox}>
        <Text style={styles.name}>{item.name}</Text>
        <BadgeRow badges={item.badges} />
        <Text style={styles.address} numberOfLines={1}>
          {item.address}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="검색" rightButtons={[{ type: "search", domain: "전체" }]} changeStyleOnScroll  />

      {/* Category Tabs */}
      <View style={styles.tabs}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.tab, cat === selectedCategory && styles.activeTab]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text
              style={[
                styles.tabText,
                cat === selectedCategory && styles.activeTabText,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={places}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text>검색 결과가 없습니다.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
  },

  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 10,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: "#007AFF",
  },
  tabText: {
    fontSize: 15,
    color: "#666",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "600",
  },

  card: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: 96,
    height: 96,
  },
  textBox: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  address: {
    marginTop: 4,
    fontSize: 13,
    color: "#777",
  },
  empty: {
    alignItems: "center",
    marginTop: 60,
  },
});
