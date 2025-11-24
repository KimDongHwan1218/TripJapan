import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import Header from "../../components/Header/Header";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ScheduleStackParamList } from "../../navigation/ScheduleStackNavigator";

type NavigationProp = NativeStackNavigationProp<
  ScheduleStackParamList,
  "TripHistoryScreen"
>;

const TripHistoryScreen = () => {
  const [selectedTab, setSelectedTab] = useState<
    "trip" | "review" | "journal"
  >("trip");

  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <Header backwardButton="arrow" middleContent="내 여행 기록" />

      <ScrollView style={styles.container}>
        {/* 상단 프로필 */}
        <View style={styles.profileContainer}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8JUVCJUExJTlDJUVCJTkzJTlDJTIwJUVEJThBJUI4JUVCJUE2JUJEfGVufDB8fDB8fHww&fm=jpg&q=60&w=3000",
            }}
            style={styles.profileImage}
          />
        </View>

        {/* 탭 내비게이션 */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, selectedTab === "trip" && styles.activeTab]}
            onPress={() => setSelectedTab("trip")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "trip" && styles.activeTabText,
              ]}
            >
              내 여행
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, selectedTab === "review" && styles.activeTab]}
            onPress={() => setSelectedTab("review")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "review" && styles.activeTabText,
              ]}
            >
              리뷰
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === "journal" && styles.activeTab,
            ]}
            onPress={() => setSelectedTab("journal")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "journal" && styles.activeTabText,
              ]}
            >
              여행기
            </Text>
          </TouchableOpacity>
        </View>

        {/* 탭 내용 */}
        <View style={styles.contentContainer}>
          {selectedTab === "trip" && (
            <>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate("AddTripScreen")}
              >
                <Text style={styles.addButtonText}>+ 여행 일정 만들기</Text>
              </TouchableOpacity>

              <Text style={styles.sectionTitle}>지난 여행</Text>

              {/* 여행 리스트 (임시) */}
              <View style={styles.tripCard}>
                <Text style={styles.tripTitle}>홋카이도 3박 4일 여행</Text>
                <Text style={styles.tripDate}>2025.03.10 - 2025.03.13</Text>
              </View>

              <View style={styles.tripCard}>
                <Text style={styles.tripTitle}>오사카 벚꽃 여행</Text>
                <Text style={styles.tripDate}>2024.04.01 - 2024.04.05</Text>
              </View>
            </>
          )}

          {selectedTab === "review" && (
            <Text style={styles.placeholderText}>리뷰칸</Text>
          )}

          {selectedTab === "journal" && (
            <Text style={styles.placeholderText}>
              일기 비슷한 걸 쓸 수도 있고, 앱 자체 기능에서 스탬프를 모으거나 사진을 모아두는 역할을 할거야.
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  profileContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: "33%",
    paddingVertical: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },
  tabButton: {
    paddingVertical: 10,
  },
  tabText: {
    fontSize: 16,
    color: "#888",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: "#007AFF",
  },
  activeTabText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  addButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 8,
  },
  tripCard: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  tripTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  tripDate: {
    fontSize: 14,
    color: "#666",
  },
  placeholderText: {
    textAlign: "center",
    color: "#666",
    marginTop: 30,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
});

export default TripHistoryScreen;
