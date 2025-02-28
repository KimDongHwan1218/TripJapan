import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, SafeAreaView } from 'react-native';
import WebView from 'react-native-webview';
import * as Location from 'expo-location';

const Mapwebview: React.FC = () => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
    };

    fetchLocation();
  }, []);

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (latitude === null || longitude === null) {
    return (
      <View style={styles.container}>
        <Text>Loading location...</Text>
      </View>
    );
  }

  const mapUrl = `https://www.google.com/maps/@${latitude},${longitude},16z`;
  console.log(mapUrl)

  return (
      <WebView 
        source={{ uri: mapUrl }} 
        style={styles.webview} 
      />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1, // 위쪽 절반을 차지
    height: '75%', // 높이를 명시적으로 설정
  },
  bottomContainer: {
    flex: 1, // 아래쪽 절반
    height: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
});

export default Mapwebview;