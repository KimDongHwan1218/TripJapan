import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import PaymentModal from './payment/PaymentModal';
import TranslationModal from './translation/TranslationModal';
import BookingModal from './booking/BookingModal';

const FAB = () => {
  const [open, setOpen] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showTranslateModal, setShowTranslateModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const toggleMenu = () => {
    const toValue = open ? 0 : 1;
    Animated.spring(animation, {
      toValue,
      useNativeDriver: true,
    }).start();
    setOpen(!open);
  };

  const handlePress = (action: 'payment' | 'translate' | 'booking') => {
    toggleMenu();
    if (action === 'payment') setShowPaymentModal(true);
    if (action === 'translate') setShowTranslateModal(true);
    if (action === 'booking') setShowBookingModal(true);
  };

  const actions = [
    {
      label: '숙소 예약 확인',
      icon: 'bed-outline',
      onPress: () => handlePress('booking'),
    },
    {
      label: '번역하기',
      icon: 'language-outline',
      onPress: () => handlePress('translate'),
    },
    {
      label: '결제하기',
      icon: 'card-outline',
      onPress: () => handlePress('payment'),
    },
  ];

  return (
    <>
      {/* 모달 3개 연결 */}
      <PaymentModal visible={showPaymentModal} onClose={() => setShowPaymentModal(false)} />
      <TranslationModal visible={showTranslateModal} onClose={() => setShowTranslateModal(false)} />
      <BookingModal visible={showBookingModal} onClose={() => setShowBookingModal(false)} />

      {/* FAB 버튼 및 액션 그룹 */}
      <View style={styles.container}>
        {actions.map((action, index) => {
          const translateY = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -(index + 1) * 70],
          });

          const opacity = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          });

          return (
            <Animated.View
              key={action.label}
              style={[styles.actionContainer, { transform: [{ translateY }], opacity }]}
            >
              <TouchableOpacity style={styles.actionButton} onPress={action.onPress}>
                <Ionicons name={action.icon as any} size={24} color="#fff" />
                <Text style={styles.label}>{action.label}</Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        <TouchableOpacity style={styles.fab} onPress={toggleMenu}>
          <Ionicons name={open ? 'close' : 'add'} size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default FAB;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    alignItems: 'flex-end',
    zIndex: 100,
  },
  fab: {
    width: 60,
    height: 60,
    backgroundColor: '#007AFF',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  actionContainer: {
    position: 'absolute',
    right: 0,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 30,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  label: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
  },
});