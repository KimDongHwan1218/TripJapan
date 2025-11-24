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
            <Text style={styles.route}>
              {item.origin} → {item.destination}
            </Text>
            <Text style={styles.price}>
              {item.value?.toLocaleString() || '-'}원
            </Text>
            <Text style={styles.date}>
              출발: {item.depart_date || '-'} / 귀국: {item.return_date || '-'}
            </Text>
            <Text style={styles.gate}>예약처: {item.gate}</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                // TravelPayouts API에서 link가 없을 경우 기본 사이트로 연결
                const url = item.link || 'https://www.aviasales.com';
                Linking.openURL(url);
              }}
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
  route: {
    fontSize: 16,
    fontWeight: "600",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
    marginVertical: 4,
  },
  date: {
    fontSize: 14,
    color: "#555",
  },
  gate: {
    fontSize: 13,
    color: "#777",
    marginBottom: 8,
  },
  button: {
    marginTop: 8,
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
