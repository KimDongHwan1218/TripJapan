import React, { forwardRef } from "react";
import MapView, { Marker } from "react-native-maps";
import type { Schedule } from "@/contexts/TripContext";

type Props = {
  schedules: Schedule[];
};



const ScheduleMap = forwardRef<MapView, Props>(
  ({ schedules }, ref) => {
    return (
      <MapView ref={ref} style={{ flex: 1 }}>
        {schedules.map((s) => (
          <Marker
            key={s.id}
            coordinate={{
              latitude: s.latitude!,
              longitude: s.longitude!,
            }}
            title={s.activity}
          />
        ))}
      </MapView>
    );
  }
);

export default ScheduleMap;