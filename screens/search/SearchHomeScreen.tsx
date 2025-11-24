import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import japandata from "./japandata.json";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SearchStackParamList } from "../../navigation/SearchStackNavigator";
import Header from "../../components/Header/Header";

type SearchScreenNavigationProp = NativeStackNavigationProp<
  SearchStackParamList,
  "SearchHomeScreen"
>;

export default function SearchHomeScreen() {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const route = useRoute();
  const query = (route.params as { query?: string })?.query?.trim() || "";

  const categories = ["명소", "숙박", "식당"];
  const [selectedCategory, setSelectedCategory] = useState("명소");
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    loadCategoryData(selectedCategory, query);
  }, [selectedCategory, query]);

  const loadCategoryData = (category: string, keyword?: string) => {
    let items: any[] = [];
    switch (category) {
      case "명소":
        items = japandata.places;
        break;
      case "숙박":
        items = japandata.hotels;
        break;
      case "식당":
        items = japandata.restaurants;
        break;
      default:
        items = [];
    }

    if (keyword) {
      const lower = keyword.toLowerCase();
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(lower) ||
          i.location.toLowerCase().includes(lower) ||
          (i.description && i.description.toLowerCase().includes(lower))
      );
    }
    setData(items);
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("DetailScreen", { item })}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.location}>{item.location}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView stickyHeaderIndices={[0]}>
      <Header
        middleContent="검색"
        rightButtons={[{ type: "search", domain: "전체" }]}
      />

      {/* Sticky SubHeaderTabs */}
      <View style={styles.subHeader}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.tab, selectedCategory === cat && styles.activeTab]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text
              style={[
                styles.tabText,
                selectedCategory === cat && styles.activeTabText,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Category Data */}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        ListEmptyComponent={
          <View style={{ padding: 20, alignItems: "center" }}>
            <Text>검색 결과가 없습니다.</Text>
          </View>
        }
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  subHeader: {
    flexDirection: "row",
    backgroundColor: "#fff",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 10,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: "#007AFF",
  },
  tabText: {
    color: "#555",
    fontSize: 16,
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "600",
  },
  card: {
    flexDirection: "row",
    margin: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
  },
  image: {
    width: 100,
    height: 100,
  },
  textContainer: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  location: {
    color: "#666",
    marginTop: 4,
  },
});
