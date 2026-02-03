import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const BOARDS = [
  { key: "리뷰", desc: "여행 후기 / 숙소 / 맛집" },
  { key: "질문", desc: "일정 / 교통 / 결제" },
  { key: "자유", desc: "잡담 / 정보" },
];

export default function BoardSection({ onPress }: { onPress: (c: string) => void }) {
  return (
    <View style={styles.container}>
      {BOARDS.map((b) => (
        <TouchableOpacity key={b.key} style={styles.card} onPress={() => onPress(b.key)}>
          <Text style={styles.title}>{b.key} 게시판</Text>
          <Text style={styles.desc}>{b.desc}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    backgroundColor: "#f5f6f8",
    borderRadius: 14,
    padding: 14,
    marginRight: 10,
  },
  title: { fontWeight: "700", fontSize: 15 },
  desc: { marginTop: 4, color: "#666", fontSize: 12 },
});
