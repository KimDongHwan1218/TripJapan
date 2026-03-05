import { View, StyleSheet } from "react-native";

export default function FlightListSkeleton() {
  return (
    <>
      {[1,2,3,4,5].map(i => (
        <View key={i} style={styles.skeleton}/>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    height: 110,
    backgroundColor: "#E5E7EB",
    margin: 12,
    borderRadius: 16
  }
});
