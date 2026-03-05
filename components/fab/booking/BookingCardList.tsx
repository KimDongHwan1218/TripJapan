import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const dummyBookings = [
  { id: '1', title: '삿포로 료칸', date: '2025-07-02' },
  { id: '2', title: '오타루 호텔', date: '2025-07-03' },
  { id: '3', title: '신치토세 공항 호텔', date: '2025-07-04' },
];

export default function BookingCardList() {
  return (
    <FlatList
      data={dummyBookings}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text>{item.date}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { gap: 10 },
  card: {
    width: 200,
    backgroundColor: '#eee',
    borderRadius: 12,
    padding: 16,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});