import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import * as Speech from 'expo-speech';
import Voice from '@react-native-voice/voice';
import { MaterialIcons } from '@expo/vector-icons';

const VoiceTranslationScreen = () => {
  const [recognizedText, setRecognizedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [fromLang, setFromLang] = useState<'ko' | 'ja'>('ko');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Voice.onSpeechResults = onSpeechResultsHandler;
    Voice.onSpeechEnd = onSpeechEndHandler;
    Voice.onSpeechError = (e) => {
      console.error('Speech error:', e);
      setIsListening(false);
    };
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechResultsHandler = (event: any) => {
    const text = event.value?.[0] ?? '';
    setRecognizedText(text);
    translateText(text);
  };

  const onSpeechEndHandler = () => {
    setIsListening(false);
  };

  const toggleLanguage = () => {
    setFromLang(fromLang === 'ko' ? 'ja' : 'ko');
    setRecognizedText('');
    setTranslatedText('');
  };

  const startListening = async () => {
    try {
      setIsListening(true);
      await Voice.start(fromLang === 'ko' ? 'ko-KR' : 'ja-JP');
    } catch (e) {
      console.error('Start listening error:', e);
      setIsListening(false);
    }
  };

  const translateText = async (text: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('https://libretranslate.de/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          source: fromLang,
          target: fromLang === 'ko' ? 'ja' : 'ko',
          format: 'text',
        }),
      });

      const data = await res.json();
      setTranslatedText(data.translatedText);
      Speech.speak(data.translatedText, { language: fromLang === 'ko' ? 'ja' : 'ko' });
    } catch (error) {
      console.error('Translation error:', error);
      setTranslatedText('번역 실패');
    }
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleLanguage} style={styles.languageSwitch}>
        <Text style={styles.languageText}>
          {fromLang === 'ko' ? '한국어 → 일본어' : '日本語 → 韓国語'}
        </Text>
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <Text style={styles.label}>인식된 텍스트</Text>
        <Text style={styles.content}>{recognizedText || '...'}</Text>
        <Text style={styles.label}>번역 결과</Text>
        <Text style={styles.content}>{translatedText || '...'}</Text>
      </View>

      <TouchableOpacity style={styles.micButton} onPress={startListening} disabled={isListening}>
        {isListening || isLoading ? (
          <ActivityIndicator size="large" color="white" />
        ) : (
          <MaterialIcons name="mic" size={36} color="white" />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: 60,
    alignItems: 'center',
  },
  languageSwitch: {
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  languageText: {
    color: 'white',
    fontSize: 16,
  },
  textContainer: {
    width: '90%',
    padding: 16,
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    marginBottom: 30,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 10,
    marginBottom: 4,
  },
  content: {
    fontSize: 18,
    color: '#1E293B',
  },
  micButton: {
    backgroundColor: '#EF4444',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VoiceTranslationScreen;