import React, { useMemo, useRef, useState } from "react";
import { Alert } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MapView from "react-native-maps";
import { ScheduleStackParamList } from "@/navigation/ScheduleStackNavigator";
import { useTrip } from "@/contexts/TripContext";
import { CITY_META } from "@/constants/cities";
import { usePlaceSearch, reverseGeocode, type Place } from "./hooks/usePlaceSearch";
import TripEditScreenView from "./TripEditScreen.view";
import type { Schedule, TripDay } from "@/contexts/TripContext";

type RouteProps = RouteProp<ScheduleStackParamList, "TripEditScreen">;
type NavProp = NativeStackNavigationProp<ScheduleStackParamList>;

type DaySchedule = {
  day: TripDay;
  schedules: Schedule[];
};

export default function TripEditScreenContainer() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavProp>();
  const { tripDayId } = route.params;

  const { activeTrip, tripDays, schedules, addSchedule, deleteSchedule } = useTrip();

  // 이 화면은 메인 화면에서 넘겨받은 하루(tripDayId)만 편집한다
  const currentDayIndex = useMemo(() => {
    const idx = tripDays.findIndex((d) => d.id === tripDayId);
    return idx >= 0 ? idx : 0;
  }, [tripDays, tripDayId]);

  const mapRef = useRef<MapView>(null);

  // 장소 검색
  const [query, setQuery] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [addingPlace, setAddingPlace] = useState(false);
  const { results: searchResults, search: searchPlaces, clear: clearResults } = usePlaceSearch();

  const handleSearch = () => {
    if (query.length >= 2) searchPlaces(query);
  };

  // dayId별 로컬 순서 (드래그 순서 유지용) — key: dayId, value: 정렬된 scheduleId 배열
  const [localOrders, setLocalOrders] = useState<Record<number, number[]>>({});

  // 모든 day 섹션 데이터 (로컬 순서 적용)
  const schedulesByDay: DaySchedule[] = useMemo(() => {
    return tripDays.map((day) => {
      const raw = schedules.filter((s) => s.trip_day_id === day.id);
      const order = localOrders[day.id];
      if (!order) return { day, schedules: raw };

      // 저장된 순서대로 정렬, 순서에 없는 새 항목은 뒤에 추가
      const ordered = [
        ...order.map((id) => raw.find((s) => s.id === id)).filter(Boolean) as Schedule[],
        ...raw.filter((s) => !order.includes(s.id)),
      ];
      return { day, schedules: ordered };
    });
  }, [tripDays, schedules, localOrders]);

  const currentDay = schedulesByDay[currentDayIndex];

  // 지도 기본 region (도시 기준)
  const mapRegion = useMemo(() => {
    if (!activeTrip) return null;
    const meta = CITY_META[activeTrip.city];
    if (!meta) return null;
    return {
      latitude: meta.center.lat,
      longitude: meta.center.lng,
      latitudeDelta: meta.region.latDelta,
      longitudeDelta: meta.region.lngDelta,
    };
  }, [activeTrip]);

  const handleChangeQuery = (text: string) => {
    setQuery(text);
    setSelectedPlace(null);
    if (text.length >= 2) {
      searchPlaces(text);
    } else {
      clearResults();
    }
  };

  const handleSelectPlace = (place: Place) => {
    setSelectedPlace(place);
    setQuery(place.name);
    clearResults();
    // 지도를 선택된 장소로 이동
    mapRef.current?.animateToRegion(
      {
        latitude: place.latitude,
        longitude: place.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      400
    );
  };

  const handleAddPlace = async () => {
    if (!selectedPlace || !currentDay) return;
    setAddingPlace(true);
    try {
      await addSchedule(currentDay.day.id, {
        activity: selectedPlace.name,
        notes: null,
        place_name: selectedPlace.name,
        latitude: selectedPlace.latitude,
        longitude: selectedPlace.longitude,
      });
      setSelectedPlace(null);
      setQuery("");
      clearResults();
    } catch {
      Alert.alert("오류", "일정 추가에 실패했습니다.");
    } finally {
      setAddingPlace(false);
    }
  };

  const handleDelete = async (scheduleId: number) => {
    try {
      await deleteSchedule(scheduleId);
    } catch {
      Alert.alert("오류", "일정 삭제에 실패했습니다.");
    }
  };

  const handleReorder = (newOrder: Schedule[]) => {
    const dayId = schedulesByDay[currentDayIndex]?.day.id;
    if (!dayId) return;
    setLocalOrders((prev) => ({ ...prev, [dayId]: newOrder.map((s) => s.id) }));
  };

  // 지도를 길게 눌러 그 위치를 바로 일정으로 추가할 수 있게 함
  const handleMapLongPress = (coordinate: { latitude: number; longitude: number }) => {
    setQuery("");
    clearResults();
    setSelectedPlace({
      id: `tap-${coordinate.latitude}-${coordinate.longitude}`,
      name: "선택한 위치",
      address: "",
      thumbnail_url: null,
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    });
    mapRef.current?.animateToRegion(
      { ...coordinate, latitudeDelta: 0.01, longitudeDelta: 0.01 },
      400
    );
    reverseGeocode(coordinate.latitude, coordinate.longitude).then((geo) => {
      if (!geo) return;
      setSelectedPlace((prev) =>
        prev && prev.latitude === coordinate.latitude && prev.longitude === coordinate.longitude
          ? { ...prev, name: geo.name, address: geo.address }
          : prev
      );
    });
  };

  return (
    <TripEditScreenView
      schedulesByDay={schedulesByDay}
      currentDayIndex={currentDayIndex}
      query={query}
      onChangeQuery={handleChangeQuery}
      onSearch={handleSearch}
      searchResults={searchResults}
      selectedPlace={selectedPlace}
      onSelectPlace={handleSelectPlace}
      onClearSearch={() => {
        setSelectedPlace(null);
        setQuery("");
        clearResults();
      }}
      onAddPlace={handleAddPlace}
      addingPlace={addingPlace}
      mapRef={mapRef}
      mapRegion={mapRegion}
      onMapLongPress={handleMapLongPress}
      onReorder={handleReorder}
      onDelete={handleDelete}
      onDone={() => navigation.goBack()}
    />
  );
}
