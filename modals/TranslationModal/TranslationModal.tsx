import React, { useState } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import MethodSelectScreen from './MethodSelectScreen';
import TextTranslationScreen from './TextTranslationScreen';
import ImageTranslationScreen from './ImageTranslationScreen';
import VoiceTranslationScreen from './VoiceTranslationScreen';

interface TranslationModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function TranslationModal({ visible, onClose }: TranslationModalProps) {
  const [step, setStep] = useState<'select' | 'text' | 'image' | 'voice'>('select');

  const handleBack = () => {
    if (step === 'select') onClose();
    else setStep('select');
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0} // 필요시 조절
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>

          {step === 'select' && <MethodSelectScreen onSelect={setStep} />}
          {step === 'text' && <TextTranslationScreen />}
          {step === 'image' && <ImageTranslationScreen />}
          {step === 'voice' && <VoiceTranslationScreen />}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
overlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    height: 500,
    maxHeight: '80%', // 화면 내 최대 높이 제한 반드시 필요
    backgroundColor: 'white',
    borderRadius: 12,
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexShrink: 1, // 높이 제한에 걸리면 줄어들게
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
  },
});