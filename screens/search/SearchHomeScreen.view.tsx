import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from "react-native";
import Header from "@/components/Header/Header";
import BadgeRow from "./components/BadgeRow";
import { layout } from "@/styles";
import { colors } from "@/styles/colors";
import { Place } from "./hooks/usePlaces";

type Props = {
  categories: string[];
  selectedCategory: string;
  places: Place[];
  loading: boolean;
  onSelectCategory: (cat: string) => void;
  onPressPlace: (placeId: number) => void;
};

export default function SearchHomeView({
  categories,
  selectedCategory,
  places,
  loading,
  onSelectCategory,
  onPressPlace,
}: Props) {
  return (
    <View style={styles.container}>
      <Header title="검색" />

      <View style={styles.tabs}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.tab, cat === selectedCategory && styles.activeTab]}
            onPress={() => onSelectCategory(cat)}
          >
            <Text style={[styles.tabText, cat === selectedCategory && styles.activeTabText]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={places}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => onPressPlace(item.id)}>
              <Image source={{ uri: item.thumbnail_url }} style={styles.image} />
              <View style={styles.textBox}>
                <Text style={styles.name}>{item.name}</Text>
                <BadgeRow badges={item.badges} />
                <Text style={styles.address} numberOfLines={1}>{item.address}</Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.content}
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
  container: { ...layout.screen },
  content: { ...layout.content },

  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 10,
  },
  tab: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  activeTab: { backgroundColor: colors.strongbutton },
  tabText: { fontSize: 15, color: colors.textSecondary },
  activeTabText: { color: colors.textWhite, fontWeight: "600" },

  card: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: "hidden",
  },
  image: { width: 96, height: 96 },
  textBox: { flex: 1, padding: 12, justifyContent: "center" },
  name: { fontSize: 16, fontWeight: "600" },
  address: { marginTop: 4, fontSize: 13, color: colors.textSecondary },
  empty: { alignItems: "center", marginTop: 60 },
});
