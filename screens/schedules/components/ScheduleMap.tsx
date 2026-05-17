import React, { forwardRef, useEffect, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import type { Schedule } from "@/contexts/TripContext";

type Props = {
  schedules: Schedule[];
};

const ScheduleMap = forwardRef<MapView, Props>(({ schedules }, ref) => {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setUserLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);

  const validSchedules = schedules.filter(
    (s) => s.latitude !== null && s.longitude !== null
  );

  // 지도 초기 중심: 첫 일정 위치 또는 현재 위치 또는 도쿄
  const initialRegion = validSchedules[0]
    ? {
        latitude: validSchedules[0].latitude!,
        longitude: validSchedules[0].longitude!,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : userLocation
    ? {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : {
        latitude: 35.6812,
        longitude: 139.7671,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };

  return (
    <MapView
      ref={ref}
      style={{ height: 220 }}
      initialRegion={initialRegion}
      showsUserLocation
      showsMyLocationButton
      showsCompass
    >
      {validSchedules.map((s, idx) => (
        <Marker
          key={s.id}
          coordinate={{
            latitude: s.latitude!,
            longitude: s.longitude!,
          }}
          title={`${idx + 1}. ${s.activity}`}
          description={s.place_name ?? undefined}
        />
      ))}
    </MapView>
  );
});

export default ScheduleMap;
