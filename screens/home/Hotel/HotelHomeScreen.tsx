import React from "react";
import { ScrollView, Button } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HotelStackParamList } from "@/navigation/HotelStackNavigator";

type Props = NativeStackScreenProps<
  HotelStackParamList,
  "HotelHome"
>;

export default function HotelHomeScreen({ navigation }: Props) {
  return (
    <ScrollView>
      {/* TODO: CheapestHotelWidget */}
      {/* TODO: PopularRouteWidget */}

      <Button
        title="숙소 검색하기"
        onPress={() =>
          navigation.navigate("HotelWebView", {
            url: "https://your-travelpayouts-link",
          })
        }
      />
    </ScrollView>
  );
}
