import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BookingCardList from './BookingCardList';

interface BookingModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function BookingModal({ visible, onClose }: BookingModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>숙소 예약 목록</Text>
          <BookingCardList />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000088' },
  modalContainer: { width: '90%', backgroundColor: 'white', padding: 20, borderRadius: 12 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  backButton: { position: 'absolute', top: 10, left: 10, zIndex: 1 },
});
