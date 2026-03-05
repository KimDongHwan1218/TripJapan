import { ScrollView, StyleSheet } from "react-native";
import FlightSearchWidget from "./components/FlightSearchWidget";
import FlightHotDeals from "./components/FlightHotDeals";

export default function FlightHomeScreen() {
  return (
    <ScrollView>
      <FlightSearchWidget />
      <FlightHotDeals />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F9FAFB"
  }
});