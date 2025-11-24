import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import FABMenu from '../../components/fab/FAB';
import Tomytrip from './conponents/Tomytrip';
import JapanMap from './conponents/JapanMap';
import Tips from './conponents/Tips';
import Slides from './conponents/Slides';
import Popupads from './conponents/Popupads';
import FlightList from './conponents/FlightList';
import HotelList from './conponents/HotelList';
import Header from '../../components/Header/Header';

const API_URL = 'http://192.168.35.167:3000';
// const API_URL = 'https://tavi-server.onrender.com';

export default function HomeScreen() {
  const [flights, setFlights] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [flightsRes] = await Promise.all([
        // const [flightsRes, hotelsRes] = await Promise.all([
          fetch(`${API_URL}/flights`),
          // fetch(`${API_URL}/bookings`)
        ]);

        const flightsData = await flightsRes.json();
        // const hotelsData = await hotelsRes.json();

        setFlights(flightsData);
        // setHotels(hotelsData);
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
      <Header
        backwardButton="round"
        middleContent="도쿄 숙소 찾기"
        rightButtons={[
          { type: "search", domain: "숙소" },
          { type: "map", searchQuery: "도쿄 호텔" },
          { type: "share", pageInfo: { title: "도쿄 숙소", url: "..." } },
        ]}
        changeStyleOnScroll
      />
      {/* <Popupads /> */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* <JapanMap /> */}
        <Tomytrip />
        <Tips />
        <Slides />
        <FlightList flights={flights} />
        {/* <HotelList hotels={hotels} /> */}
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
