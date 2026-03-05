import React, { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import Header from "../../components/Header/Header";
import Tomytrip from "./components/Tomytrip";
import Tips from "./components/Tips";
import Slides from "./components/Slides";
import QuickActions from "./components/QuickActions";
import SectionHeader from "./components/SectionHeader";
import InfoWidgetGrid from "./components/InfoWidgetGrid";
import TranslationModal from "../../components/fab/translation/TranslationModal";
import { layout } from "@/styles/layout";

interface Props {
  loading: boolean;
  destinations: any[];
  tips: any[];
  activeTrip: any;
  tripPhase: any;

  // 날씨/환율
  city: string;
  temperature: number | null;
  weatherCode: number | null;
  exchangeRate: number | null;

  onPressMyTrip: () => void;
  onPressFlight: () => void;
  onPressHotel: () => void;
  onPressTour: () => void;
  onPressShopping: () => void;
  onPressInsurance: () => void;
  onPressDestination: (id: number) => void;
  onPressFAB: (action: "translate" | "myTickets" | "pay") => void;
}

export default function HomeScreenView(props: Props) {
  const [showTranslation, setShowTranslation] = useState(false);

  return (
    <View style={styles.container}>
      <Header title="홈" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 나의 여행 - 헤더 바로 아래 */}
        <Tomytrip />

        {/* 슬라이드 배너 */}
        <Slides data={props.destinations || undefined} />

        {/* 빠른 액션 */}
        <QuickActions
          onPressFlight={props.onPressFlight}
          onPressHotel={props.onPressHotel}
          onPressTour={props.onPressTour}
          onPressShopping={props.onPressShopping}
          onPressInsurance={props.onPressInsurance}
        />

        {/* 정보 위젯 2×2 */}
        <SectionHeader title="여행 정보" />
        <InfoWidgetGrid
          city={props.city}
          temperature={props.temperature}
          weatherCode={props.weatherCode}
          exchangeRate={props.exchangeRate}
          onPressTranslation={() => setShowTranslation(true)}
        />

        {/* 여행 팁 */}
        <SectionHeader title="여행 전 꿀팁" />
        <Tips data={props.tips || undefined} />
      </ScrollView>

      {/* 번역 모달 */}
      <TranslationModal
        visible={showTranslation}
        onClose={() => setShowTranslation(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...layout.screen,
  },
  scrollContent: {
    ...layout.content,
  },
});
