import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import Header from "../../components/Header/Header";

export default function DetailScreen() {
  const route = useRoute<RouteProp<{ params: { item: any } }, "params">>();
  const { item } = route.params;

  return (
    <View style={styles.container}>
      <Header backwardButton="arrow" middleContent={item.name} rightButtons={[{ type: "share" }]} />
      <ScrollView style={styles.content}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.location}>{item.location}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: { padding: 16 },
  image: {
    width: "100%",
    height: 250,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    margin: 12,
  },
  location: {
    fontSize: 16,
    color: "#555",
    marginHorizontal: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    margin: 12,
    color: "#333",
  },
});
