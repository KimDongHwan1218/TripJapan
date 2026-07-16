import React, { forwardRef, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { colors } from "@/styles";
import type { Schedule } from "@/contexts/TripContext";

type Props = {
  schedules: Schedule[];
  routePoints?: { latitude: number; longitude: number }[];
  travelMode?: "walking" | "transit";
};

const MINIMAL_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#f0eeeb" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#7c7c7c" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f0eeeb" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#e0ddd8" }] },
  { featureType: "road.arterial", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "road.local", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#b8d4e8" }] },
  { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#dde8d0" }] },
];

const ScheduleMap = forwardRef<MapView, Props>(({ schedules, routePoints, travelMode }, ref) => {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setUserLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
    })();
  }, []);

  const valid = schedules.filter((s) => s.latitude !== null && s.longitude !== null);

  const initialRegion = valid[0]
    ? { latitude: valid[0].latitude!, longitude: valid[0].longitude!, latitudeDelta: 0.05, longitudeDelta: 0.05 }
    : userLocation
    ? { latitude: userLocation.latitude, longitude: userLocation.longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 }
    : { latitude: 35.6812, longitude: 139.7671, latitudeDelta: 0.1, longitudeDelta: 0.1 };

  return (
    <MapView
      ref={ref}
      style={{ height: 220 }}
      initialRegion={initialRegion}
      customMapStyle={MINIMAL_MAP_STYLE}
      showsUserLocation
      showsMyLocationButton
      showsCompass
    >
      {routePoints && routePoints.length > 1 && (
        <Polyline
          coordinates={routePoints}
          strokeColor={colors.primary}
          strokeWidth={3}
          lineDashPattern={travelMode === "transit" ? [8, 4] : undefined}
        />
      )}

      {valid.map((s, idx) => (
        <Marker
          key={s.id}
          coordinate={{ latitude: s.latitude!, longitude: s.longitude! }}
          title={s.activity}
        >
          <View style={styles.numDot}>
            <Text style={styles.numDotText}>{idx + 1}</Text>
          </View>
        </Marker>
      ))}
    </MapView>
  );
});

export default ScheduleMap;

const styles = StyleSheet.create({
  numDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  numDotText: { fontSize: 11, fontWeight: "800", color: "#fff" },
});
