import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { colors } from "@/styles";
import type { Schedule } from "@/contexts/TripContext";

type Props = {
  schedules: Schedule[];
  routePoints?: { latitude: number; longitude: number }[];
};

const MINIMAL_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#f0eeeb" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#7c7c7c" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f0eeeb" }] },
  // POI(음식점/관광지 등)는 구글맵 기본 동작대로 노출 — 줌 레벨에 따라 주요 장소부터 자동으로 보임.
  // 다만 위의 전역 labels.icon 규칙이 아이콘을 꺼버리므로 POI만 다시 켜줌.
  { featureType: "poi", elementType: "labels.icon", stylers: [{ visibility: "on" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#e0ddd8" }] },
  { featureType: "road.arterial", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "road.local", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#b8d4e8" }] },
  { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#dde8d0" }] },
];

const ScheduleMap = forwardRef<MapView, Props>(({ schedules, routePoints }, ref) => {
  const mapRef = useRef<MapView>(null);
  useImperativeHandle(ref, () => mapRef.current as MapView);
  const [mapReady, setMapReady] = useState(false);
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

  // 그날 일정 장소가 전부 보이도록 카메라를 맞춤. 예전엔 initialRegion이 마운트 때 한 번만 적용돼서
  // 일정이 늦게 로딩되거나 Day를 넘기면 도시 중심에 머물러 마커가 화면 밖에 있는 경우가 많았음.
  // onMapReady 전에 카메라를 움직이면 네이티브 지도가 무시하므로 mapReady 이후에만 실행
  const coordsKey = valid.map((s) => `${s.latitude},${s.longitude}`).join("|");
  useEffect(() => {
    if (!mapReady || !mapRef.current || valid.length === 0) return;
    if (valid.length === 1) {
      mapRef.current.animateToRegion(
        { latitude: valid[0].latitude!, longitude: valid[0].longitude!, latitudeDelta: 0.02, longitudeDelta: 0.02 },
        300
      );
      return;
    }
    mapRef.current.fitToCoordinates(
      valid.map((s) => ({ latitude: s.latitude!, longitude: s.longitude! })),
      { edgePadding: { top: 40, right: 40, bottom: 40, left: 40 }, animated: true }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapReady, coordsKey]);

  const initialRegion = valid[0]
    ? { latitude: valid[0].latitude!, longitude: valid[0].longitude!, latitudeDelta: 0.05, longitudeDelta: 0.05 }
    : userLocation
    ? { latitude: userLocation.latitude, longitude: userLocation.longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 }
    : { latitude: 35.6812, longitude: 139.7671, latitudeDelta: 0.1, longitudeDelta: 0.1 };

  return (
    <MapView
      ref={mapRef}
      onMapReady={() => setMapReady(true)}
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
        />
      )}

      {valid.map((s, idx) => (
        <Marker
          key={s.id}
          coordinate={{ latitude: s.latitude!, longitude: s.longitude! }}
          title={s.activity}
          anchor={{ x: 0.5, y: 0.5 }}
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
