// app/(main)/index.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, Dimensions, TouchableOpacity, Image, Linking } from 'react-native';
import FABMenu from '../../components/FAB';

const { width } = Dimensions.get('window');
const API_URL = 'http://192.168.35.83:3000'

export default function HomeScreen() {
  const [flights, setFlights] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const flightsRes = await fetch(`${API_URL}/flights`);
        const flightsData = await flightsRes.json();

        const hotelsRes = await fetch(`${API_URL}/hotels`);
        const hotelsData = await hotelsRes.json();

        setFlights(flightsData);
        setHotels(hotelsData);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading deals...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 항공권 리스트 */}
      <Text style={styles.title}>✈️ 일본행 특가 항공권</Text>
      <FlatList
        data={flights}
        keyExtractor={(_, idx) => `flight-${idx}`}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{item.airline} - ${item.price}</Text>
            <Text>
              출발: {item.departure} / 귀국: {item.return}
            </Text>
            <Text>할인율: {item.discount || 0}%</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => Linking.openURL(item.link)}
            >
              <Text style={styles.buttonText}>예약하기</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* 호텔 리스트 */}
      <Text style={styles.title}>🏨 일본 특가 숙소</Text>
      <FlatList
        data={hotels}
        keyExtractor={(_, idx) => `hotel-${idx}`}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{item.name} ({item.stars}★)</Text>
            <Text>{item.price} 원 / 1박</Text>
            <Text>할인율: {item.discount || 0}%</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => Linking.openURL(item.link)}
            >
              <Text style={styles.buttonText}>예약하기</Text>
            </TouchableOpacity>
          </View>
        )}
        
      />
      <FABMenu/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    elevation: 2,
  },
  button: {
    marginTop: 8,
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
