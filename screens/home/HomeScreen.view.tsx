import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import Header from "../../components/Header/Header";
import Tomytrip from "./components/Tomytrip";
import Tips from "./components/Tips";
import Slides from "./components/Slides";
import FlightList from "./components/FlightList";
import HotelList from "./components/HotelList";
import FABMenu from "../../components/fab/FAB";
import QuickActions from "./components/QuickActions";
import SectionHeader from "./components/SectionHeader";


interface Props {
  loading: boolean;

  flights: any[];
  hotels: any[];
  destinations: any[];
  tips: any[];
  upcomingTrip: any;

  activeTrip: any
  tripPhase: any

  onPressMyTrip: () => void;
  onPressFlight: () => void;
  onPressHotel: () => void;
  onPressTour: () => void;
  onPressShopping: () => void;
  onPressInsurance: () => void;
  onPressDestination: (id: string) => void;
  onPressFAB: (action: "translate" | "myTickets" | "pay") => void;
}

export default function HomeScreenView(props: Props) {
  
  return (
    <View style={styles.container}>
      <Header title="타비료코" changeStyleOnScroll />

      <ScrollView contentContainerStyle={styles.scrollContent}>

        <Tomytrip />

        <QuickActions
          onPressFlight={props.onPressFlight}
          onPressHotel={props.onPressHotel}
          onPressTour={props.onPressTour}
          onPressShopping={props.onPressShopping}
          onPressInsurance={props.onPressInsurance}
        />

        <SectionHeader title="일본 인기 여행지" />
        <Slides data={props.destinations || undefined} />

        <SectionHeader title="여행 전 꿀팁" />
        <Tips data={props.tips || undefined}/>

        <SectionHeader title="특가 항공권" />
        <FlightList data={props.flights} />

        {/* 6. 숙소 추천 (현재 API 없음 — 빈 화면에서도 오류 없음) */}
        {/* <SectionHeader title="추천 숙소" /> */}
        {/* <HotelList data={props.hotels} /> */}

      </ScrollView>

      {/* FAB */}
      {/* <FABMenu /> */}
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
  scrollContent: {
    paddingVertical: 16,
  },
});
