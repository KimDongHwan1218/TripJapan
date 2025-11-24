import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScheduleCard from "./ScheduleCard";
import type { DatePlan } from "../screens/schedules/SchedulingScreen";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function ScheduleList({ dateList, flatListRef, navigation }: any) {
  return (
    <FlatList
      ref={flatListRef}
      data={dateList}
      horizontal
      pagingEnabled
      keyExtractor={(item) => item.key}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <View style={styles.dayPage}>
          <Text style={styles.dateText}>{item.display}</Text>

          {item.plans.map((plan :any, index :any) => (
            <ScheduleCard
              key={index}
              plan={plan}
              date={item.key}
              onPress={() =>
                navigation.navigate("ScheduleDetailScreen", {
                  plan,
                  date: item.key,
                })
              }
            />
          ))}

          <TouchableOpacity
            style={[styles.card, styles.addCard]}
            onPress={() =>
              navigation.navigate("ScheduleDetailScreen", { date: item.key })
            }
          >
            <Text style={styles.addCardText}>+ 일정 추가</Text>
          </TouchableOpacity>
        </View>
      )}
      initialScrollIndex={15}
      getItemLayout={(_, index) => ({
        length: SCREEN_WIDTH,
        offset: SCREEN_WIDTH * index,
        index,
      })}
      contentContainerStyle={styles.listBackground}
    />
  );
}

const styles = StyleSheet.create({
  dayPage: { width: SCREEN_WIDTH, padding: 16 },
  dateText: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  addCard: {
    backgroundColor: "#e0f0ff",
    justifyContent: "center",
    alignItems: "center",
    height: 80,
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  addCardText: { fontSize: 16, color: "#007AFF", fontWeight: "bold" },
  listBackground: { backgroundColor: "#fff" },
});
