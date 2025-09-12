import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";

const mockComments = [
  { id: "1", user: "Charlie", content: "좋은 글이네요!" },
  { id: "2", user: "Dana", content: "공감합니다 👍" },
];

export default function CommentScreen() {
  const [comments, setComments] = useState(mockComments);
  const [text, setText] = useState("");

  const handleAddComment = () => {
    if (!text.trim()) return;
    setComments((prev) => [
      ...prev,
      { id: Date.now().toString(), user: "나", content: text },
    ]);
    setText("");
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={comments}
        renderItem={({ item }) => (
          <View style={styles.comment}>
            <Text style={styles.user}>{item.user}</Text>
            <Text>{item.content}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="댓글 달기..."
          value={text}
          onChangeText={setText}
        />
        <Button title="등록" onPress={handleAddComment} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  comment: { marginBottom: 10 },
  user: { fontWeight: "bold" },
  inputRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 8, marginRight: 8 },
});
