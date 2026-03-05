import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import * as Speech from 'expo-speech';
import { MaterialIcons } from '@expo/vector-icons';

const VoiceTranslationScreen = () => {

  return (
    <View style={styles.container}>

        <Text style={styles.label}>번역 결과</Text>

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