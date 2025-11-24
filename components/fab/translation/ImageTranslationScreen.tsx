import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

type Lang = 'ko' | 'ja';

const SERVER_URL = 'http://192.168.35.53:3000'; // 서버 PC IP

export default function ImageTranslationScreen() {
  const [sourceLang, setSourceLang] = useState<Lang>('ja'); // 기본: 일본어 → 한국어
  const [translatedText, setTranslatedText] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleLanguage = () => {
    setSourceLang(prev => (prev === 'ja' ? 'ko' : 'ja'));
    setTranslatedText('');
    setOriginalText('');
    setResultImage(null);
  };

  const pickImageAndTranslate = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('권한 필요', '이미지를 선택하려면 갤러리 접근 권한이 필요합니다.');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (pickerResult.canceled) return;

    const uri = pickerResult.assets[0].uri;
    const fileName = uri.split('/').pop() || 'photo.jpg';
    const type = fileName.endsWith('.png') ? 'image/png' : 'image/jpeg';

    const formData = new FormData();
    formData.append('image', {
      uri,
      name: fileName,
      type,
    } as any);
    formData.append('source', sourceLang);
    formData.append('target', sourceLang === 'ja' ? 'ko' : 'ja');

    setLoading(true);
    setTranslatedText('');
    setOriginalText('');
    setResultImage(null);

    try {
      const response = await fetch(`${SERVER_URL}/image-translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: formData,
      });

      if (!response.ok) {
        setTranslatedText('⚠️ 이미지 번역 API 오류가 발생했습니다.');
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log(data.imageUrl)
      if (data.translatedText) {
        setOriginalText(data.originalText || '');
        setTranslatedText(data.translatedText);
        setResultImage(data.imageUrl);
      } else {
        setTranslatedText('⚠️ 번역 결과가 없습니다.');
      }

    } catch (error) {
      setTranslatedText('⚠️ 이미지 번역 요청 중 오류가 발생했습니다.');
      console.error('이미지 번역 요청 에러:', error);
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleLanguage} style={styles.langButton}>
        <Text style={styles.langText}>
          {sourceLang === 'ja' ? '日本語 → 한국어' : '한국어 → 日本語'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={pickImageAndTranslate} style={styles.translateButton} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.translateButtonText}>이미지 선택 후 번역</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>추출된 원문</Text>
      <Text style={styles.output}>{originalText || '이미지에서 텍스트를 추출하면 여기에 표시됩니다.'}</Text>

      <Text style={styles.label}>번역 결과</Text>
      <Text style={styles.output}>{translatedText || '번역 결과가 여기에 표시됩니다.'}</Text>

      {resultImage && (
        <>
          <Text style={styles.label}>번역된 이미지</Text>
          <Image source={{ uri: resultImage }} style={styles.resultImage} resizeMode="contain" />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  langButton: { backgroundColor: '#d0e8ff', padding: 10, borderRadius: 8, marginBottom: 10 },
  langText: { fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  label: { marginTop: 10, marginBottom: 6, fontSize: 16, color: '#333' },
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
    marginTop: 8,
    minHeight: 60,
    backgroundColor: '#e6f0ff',
    padding: 10,
    borderRadius: 8,
    fontSize: 15,
  },
  resultImage: {
    marginTop: 15,
    width: '100%',
    height: 250,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
});
