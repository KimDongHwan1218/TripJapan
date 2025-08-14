import React from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';

interface Props {
  onSelect: (method: 'card' | 'paypay' | 'transit') => void;
}

export default function PaymentMethodScreen({ onSelect }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>결제 수단을 선택하세요</Text>
      <Button title="💳 신용카드" onPress={() => onSelect('card')} />
      <Button title="📱 PayPay" onPress={() => onSelect('paypay')} />
      <Button title="🚉 교통카드" onPress={() => onSelect('transit')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
});