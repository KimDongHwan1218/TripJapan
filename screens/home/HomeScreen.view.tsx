import React, { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { colors } from "@/styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import HeroBanner from "./components/HeroBanner";
import TomyTrip from "./components/Tomytrip";
import QuickActions from "./components/QuickActions";
import InfoWidgetGrid from "./components/InfoWidgetGrid";
import SectionHeader from "./components/SectionHeader";
import TaviPick from "./components/TaviPick";
import SpecialBanner from "./components/SpecialBanner";
import TaviTalkPreview from "./components/TaviTalkPreview";
import Slides from "./components/Slides";
import TranslationModal from "../../components/fab/translation/TranslationModal";

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
  onPressWeather: () => void;
  onPressExchange: () => void;
}

export default function HomeScreenView(props: Props) {
  const insets = useSafeAreaInsets();
  const [showTranslation, setShowTranslation] = useState(false);

  const handleTranslation = () => setShowTranslation(true);

  // 히어로 이미지: destinations 첫 번째 항목 or 기본값
  const heroImage = props.destinations?.[0]?.image ?? undefined;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 1. 히어로 배너 */}
        <HeroBanner image={heroImage} />

        {/* 2. 내 여행 카드 */}
        <TomyTrip
          activeTrip={props.activeTrip}
          tripPhase={props.tripPhase}
          onPress={props.onPressMyTrip}
        />

        {/* 3. 여행 정보 퀵 아이콘 */}
        <QuickActions
          temperature={props.temperature}
          weatherCode={props.weatherCode}
          exchangeRate={props.exchangeRate}
          onPressTranslation={handleTranslation}
          onPressFlight={props.onPressFlight}
        />

        {/* 4. 여행 정보 버튼 */}
        <SectionHeader title="여행 정보" />
        <InfoWidgetGrid
          city={props.city}
          temperature={props.temperature}
          weatherCode={props.weatherCode}
          exchangeRate={props.exchangeRate}
          onPressTranslation={handleTranslation}
          onPressWeather={props.onPressWeather}
          onPressExchange={props.onPressExchange}
        />

        {/* 5. 타비 PICK! — 여행 상품 (MOCK) ← 피그마 기준 여행정보 다음 */}
        <TaviPick
          onPressHotel={props.onPressHotel}
          onPressTour={props.onPressTour}
          onPressShopping={props.onPressShopping}
        />

        {/* 6. 특가 배너 (MOCK) */}
        <SpecialBanner />

        {/* 7. 실시간 타비톡 프리뷰 (MOCK) */}
        <TaviTalkPreview onPressTaviTalk={props.onPressTaviTalk} />

        {/* 8. 추천 카드 */}
        <SectionHeader title="지금 뜨는 여행지" />
        <Slides data={props.destinations || undefined} />

        <View style={{ height: 32 }} />
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
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});
