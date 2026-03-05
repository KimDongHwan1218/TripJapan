import React from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';

interface Props {
  onSelect: (method: 'text' | 'image' | 'voice') => void;
}

export default function TranslationMethodSelectScreen({ onSelect }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>번역 방식을 선택하세요</Text>
      <Button title="✍️ 텍스트 번역" onPress={() => onSelect('text')} />
      <Button title="📷 이미지 번역" onPress={() => onSelect('image')} />
      <Button title="🎤 음성 번역" onPress={() => onSelect('voice')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
});