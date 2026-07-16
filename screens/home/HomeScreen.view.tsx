import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { colors } from "@/styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import HeroBanner from "./components/HeroBanner";
import TomyTrip from "./components/Tomytrip";
import QuickActions from "./components/QuickActions";
import TaviPick from "./components/TaviPick";
import SpecialBanner from "./components/SpecialBanner";
import TaviTalkPreview from "./components/TaviTalkPreview";
import Slides from "./components/Slides";
interface Props {
  loading: boolean;
  destinations: any[];
  activeTrip: any;
  tripPhase: any;

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
  onPressTaviTalk: () => void;
  onPressTranslation: () => void;
  onPressWeather: () => void;
  onPressExchange: () => void;
  onPressTravelAlert: () => void;
  onPressTaviTalkShortcut: () => void;
}

export default function HomeScreenView(props: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 1. 히어로 배너 — 자동 전환되는 일본 여행지 사진 슬라이드 */}
        <HeroBanner />

        {/* 2. 내 여행 카드 */}
        <TomyTrip
          activeTrip={props.activeTrip}
          tripPhase={props.tripPhase}
          onPress={props.onPressMyTrip}
        />

        {/* 3. 퀵 액션 — Figma: y=490, TomyTrip 끝(y=470)에서 20px 아래 */}
        <View style={{ height: 20 }} />
        <QuickActions
          temperature={props.temperature}
          weatherCode={props.weatherCode}
          exchangeRate={props.exchangeRate}
          onPressTranslation={props.onPressTranslation}
          onPressWeather={props.onPressWeather}
          onPressExchange={props.onPressExchange}
          onPressTravelAlert={props.onPressTravelAlert}
          onPressTaviTalk={props.onPressTaviTalkShortcut}
        />

        {/* 4. 타비 PICK — Figma: y=603, QuickActions 끝(y=573)에서 30px 아래 */}
        <View style={{ height: 30 }} />
        <TaviPick
          onPressHotel={props.onPressHotel}
          onPressTour={props.onPressTour}
          onPressShopping={props.onPressShopping}
        />

        {/* 5. 특가 배너 — 20px 간격 */}
        <View style={{ height: 20 }} />
        <SpecialBanner />

        {/* 6. 타비톡 프리뷰 — 20px 간격 */}
        <View style={{ height: 20 }} />
        <TaviTalkPreview onPressTaviTalk={props.onPressTaviTalk} />

        {/* 7. 지금 뜨는 여행지 슬라이드 — 20px 간격 */}
        <View style={{ height: 20 }} />
        <Slides data={props.destinations || undefined} />

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});
