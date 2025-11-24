import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

type Lang = 'ko' | 'ja';

const SERVER_URL = 'http://192.168.35.53:3000'; // 서버 PC IP

export default function TextTranslationScreen() {
  const [sourceLang, setSourceLang] = useState<Lang>('ko');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleLanguage = () => {
    setSourceLang(prev => (prev === 'ko' ? 'ja' : 'ko'));
    setInputText('');
    setTranslatedText('');
  };

  const translateText = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    setTranslatedText('');
    try {
      const response = await fetch(`${SERVER_URL}/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: inputText,
          source: sourceLang,
          target: sourceLang === 'ko' ? 'ja' : 'ko',
          format: 'text',
        }),
      });

      if (!response.ok) {
        setTranslatedText('⚠️ 번역 API 오류가 발생했습니다.');
        setLoading(false);
        return;
      }

      const data = await response.json();
      if (data.translatedText) {
        setTranslatedText(data.translatedText);
      } else {
        setTranslatedText('⚠️ 번역 결과가 없습니다.');
      }

    } catch (error) {
      setTranslatedText('⚠️ 번역 요청 중 오류가 발생했습니다.');
      console.error('번역 요청 에러:', error);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleLanguage} style={styles.langButton}>
        <Text style={styles.langText}>
          {sourceLang === 'ko' ? '한국어 → 일본어' : '日本語 → 韓国語'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>번역할 텍스트 입력</Text>
      <TextInput
        style={styles.input}
        multiline
        placeholder={sourceLang === 'ko' ? '한국어 입력...' : '日本語を入力...'}
        value={inputText}
        onChangeText={setInputText}
      />

      <TouchableOpacity onPress={translateText} style={styles.translateButton} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.translateButtonText}>번역하기</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>번역 결과</Text>
      <Text style={styles.output}>{translatedText || '번역 결과가 여기에 표시됩니다.'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  langButton: { backgroundColor: '#d0e8ff', padding: 10, borderRadius: 8, marginBottom: 10 },
  langText: { fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  label: { marginTop: 10, marginBottom: 6, fontSize: 16, color: '#333' },
  input: {
    minHeight: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  translateButton: {
    backgroundColor: '#007AFF',
    marginTop: 15,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  translateButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  output: {
    marginTop: 15,
    minHeight: 80,
    backgroundColor: '#e6f0ff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
});