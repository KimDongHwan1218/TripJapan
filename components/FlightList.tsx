import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Dimensions, StyleSheet, Linking } from 'react-native';

const { width } = Dimensions.get('window');

interface FlightListProps {
  flights: any[];
}

export default function FlightList({ flights }: FlightListProps) {
  return (
    <View>
      <Text style={styles.title}>✈️ 일본행 특가 항공권</Text>
      <FlatList
        data={flights}
        keyExtractor={(_, idx) => `flight-${idx}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.card, { width: width * 0.8, marginRight: 12 }]}>
            <Text>{item.airline || '항공사 미정'} - {item.price.toLocaleString()}원</Text>
            <Text>
              출발: {item.departure ? item.departure.split('T')[0] : '-'} / 
              귀국: {item.return ? item.return.split('T')[0] : '-'}
            </Text>
            {item.discount !== undefined && (
              <Text>할인율: {item.discount}%</Text>
            )}
            <TouchableOpacity
              style={styles.button}
              onPress={() => Linking.openURL(item.link)}
            >
              <Text style={styles.buttonText}>예약하기</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 12,
    marginLeft: 8,
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
    elevation: 3,
  },
  button: {
    marginTop: 12,
    paddingVertical: 10,
    backgroundColor: "#007AFF",
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
