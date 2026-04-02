import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "@/navigation/HomeStackNavigator";
import { useTravelInfo, TRAVEL_CATEGORIES, TravelCategory } from "./hooks/useTravelInfo";
import TravelInfoView from "./TravelInfoScreen.view";

type NavProp = NativeStackNavigationProp<HomeStackParamList>;

const CATEGORIES: TravelCategory[] = ["전체", ...TRAVEL_CATEGORIES];

export default function TravelInfoScreenContainer() {
  const navigation = useNavigation<NavProp>();
  const [selectedCategory, setSelectedCategory] = useState<TravelCategory>("전체");
  const { items, loading, error, refresh } = useTravelInfo(selectedCategory);

  return (
    <TravelInfoView
      categories={CATEGORIES}
      selectedCategory={selectedCategory}
      items={items}
      loading={loading}
      error={error}
      onSelectCategory={setSelectedCategory}
      onPressItem={(id) => navigation.navigate("TravelInfoDetail", { placeId: id })}
      onGoBack={() => navigation.goBack()}
      onRefresh={refresh}
    />
  );
}
