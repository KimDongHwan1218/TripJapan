import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function PostCreateScreen() {
  const [text, setText] = useState("");
  const navigation = useNavigation();

  const handleSubmit = () => {
    console.log("새 게시물:", text);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="무슨 생각을 하고 계신가요?"
        style={styles.input}
        multiline
        value={text}
        onChangeText={setText}
      />
      <Button title="게시하기" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8, marginBottom: 20, minHeight: 100 },
});