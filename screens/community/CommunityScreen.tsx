import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CommunityStackParamList } from "../../navigation/CommunityStackNavigator";

type CommunityNavProp = NativeStackNavigationProp<
  CommunityStackParamList,
  "CommunityScreen"
>;

const mockPosts = [
  {
    id: "1",
    user: "Alice",
    avatar: "https://i.pravatar.cc/150?img=1",
    content: "오늘 교토에서 찍은 사진이에요 📸",
    likes: 12,
  },
  {
    id: "2",
    user: "Bob",
    avatar: "https://i.pravatar.cc/150?img=2",
    content: "맛집 공유합니다 🍜",
    likes: 30,
  },
];

export default function CommunityScreen() {
  const navigation = useNavigation<CommunityNavProp>();

  const renderItem = ({ item }: { item: typeof mockPosts[0] }) => (
    <View style={styles.postCard}>
      {/* 프로필 */}
      <TouchableOpacity
        style={styles.profileRow}
        onPress={() => {
          // 👉 여기선 프로필 보기/차단/신고 메뉴 뜨도록 추후 구현
          console.log("프로필 클릭:", item.user);
        }}
      >
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <Text style={styles.username}>{item.user}</Text>
      </TouchableOpacity>

      {/* 본문 */}
      <Text style={styles.content}>{item.content}</Text>

      {/* 액션 버튼들 */}
      <View style={styles.actions}>
        <TouchableOpacity>
          <Ionicons name="heart-outline" size={20} color="red" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("CommentScreen")}
        >
          <Ionicons name="chatbubble-outline" size={20} color="gray" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={mockPosts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      {/* 글쓰기 버튼 */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("PostCreateScreen")}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  postCard: {
    backgroundColor: "white",
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 2,
  },
  profileRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  avatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  username: { fontWeight: "bold", fontSize: 14 },
  content: { fontSize: 14, marginVertical: 8 },
  actions: { flexDirection: "row", gap: 12 },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#ff4081",
    borderRadius: 30,
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});
