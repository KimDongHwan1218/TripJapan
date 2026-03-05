import React from "react";
import { ScrollView, Button } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TourStackParamList } from "@/navigation/TourStackNavigator";

type Props = NativeStackScreenProps<
  TourStackParamList,
  "TourHome"
>;

export default function TourHomeScreen({ navigation }: Props) {
  return (
    <ScrollView>
      {/* TODO: CheapestTourWidget */}
      {/* TODO: PopularRouteWidget */}

      <Button
        title="숙소 검색하기"
        onPress={() =>
          navigation.navigate("TourWebView", {
            url: "https://your-travelpayouts-link",
          })
        }
      />
    </ScrollView>
  );
}
