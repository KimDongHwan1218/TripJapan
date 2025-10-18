import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import FABMenu from '../../components/FAB';
import Tomytrip from '../../components/Tomytrip';
import JapanMap from '../../components/JapanMap';
import Tips from '../../components/Tips';
import Slides from '../../components/Slides';
import Popupads from '../../components/Popupads';
import FlightList from '../../components/FlightList';
import HotelList from '../../components/HotelList';

const API_URL = 'http://192.168.35.232:3000';
// const API_URL = 'https://tavi-server.onrender.com';

export default function HomeScreen() {
  const [flights, setFlights] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [flightsRes, hotelsRes] = await Promise.all([
          fetch(`${API_URL}/flights`),
          fetch(`${API_URL}/hotels`)
        ]);

        const flightsData = await flightsRes.json();
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

  // if (loading) {
  //   return (
  //     <View style={styles.center}>
  //       <Text>Loading deals...</Text>
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      {/* <Popupads /> */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <JapanMap />
        <Tomytrip />
        <Tips />
        <Slides />
        <FlightList flights={flights} />
        <HotelList hotels={hotels} />
      </ScrollView>
      <FABMenu />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
});
