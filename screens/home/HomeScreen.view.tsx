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
  communityPreview: any[];
  upcomingTrip: any;

  onPressMyTrip: () => void;
  onPressFlight: () => void;
  onPressHotel: () => void;
  onPressTour: () => void;
  onPressDestination: (id: string) => void;
  onPressFAB: (action: "translate" | "myTickets" | "pay") => void;
}

export default function HomeScreenView(props: Props) {
  
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

      <ScrollView contentContainerStyle={styles.scrollContent}>

        <Tomytrip />

        <QuickActions
          onPressFlight={props.onPressFlight}
          onPressHotel={props.onPressHotel}
          onPressTour={props.onPressTour}
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
