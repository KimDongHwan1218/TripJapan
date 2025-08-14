import React, { useState } from 'react';
import { Modal, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PaymentMethodScreen from './PaymentMethodScreen';
import CreditCardScreen from './CreditCardScreen';
import PayPayScreen from './PayPayScreen';
import TransitCardScreen from './TransitCardScreen';

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function PaymentModal({ visible, onClose }: PaymentModalProps) {
  const [step, setStep] = useState<'select' | 'card' | 'paypay' | 'transit'>('select');

  const handleBack = () => {
    if (step === 'select') onClose();
    else setStep('select');
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>

          {step === 'select' && <PaymentMethodScreen onSelect={setStep} />}
          {step === 'card' && <CreditCardScreen />}
          {step === 'paypay' && <PayPayScreen />}
          {step === 'transit' && <TransitCardScreen />}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000088' },
  modalContainer: { width: '85%', backgroundColor: 'white', padding: 20, borderRadius: 12 },
  backButton: { position: 'absolute', top: 10, left: 10, zIndex: 1 },
});
