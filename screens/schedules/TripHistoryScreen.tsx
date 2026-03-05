import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Header from "../../components/Header/Header";
import { layout } from "@/styles";
import { colors } from "@/styles/colors";
import { spacing } from "@/styles/spacing";
import { useTrip } from "@/contexts/TripContext";
import AddTripModal from "./components/AddTripModal";

const TripHistoryScreen = () => {
  const [selectedTab, setSelectedTab] = useState<"trip" | "review" | "journal">("trip");
  const [addModalVisible, setAddModalVisible] = useState(false);

  const { trips } = useTrip();

  const TABS = [
    { key: "trip", label: "내 여행" },
    { key: "review", label: "리뷰" },
    { key: "journal", label: "여행기" },
  ] as const;

  return (
    <View style={styles.container}>
      <Header backwardButton="arrow" title="내 여행 기록" />

      <ScrollView contentContainerStyle={styles.content}>
        {/* 탭 */}
        <View style={styles.tabContainer}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabButton, selectedTab === tab.key && styles.activeTab]}
              onPress={() => setSelectedTab(tab.key)}
            >
              <Text style={[styles.tabText, selectedTab === tab.key && styles.activeTabText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 탭 내용 */}
        <View style={styles.contentContainer}>
          {selectedTab === "trip" && (
            <>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setAddModalVisible(true)}
              >
                <Text style={styles.addButtonText}>+ 여행 일정 만들기</Text>
              </TouchableOpacity>

              {trips.length === 0 ? (
                <Text style={styles.placeholderText}>아직 여행이 없어요. 첫 여행을 만들어보세요!</Text>
              ) : (
                <>
                  <Text style={styles.sectionTitle}>내 여행</Text>
                  {trips.map((trip) => (
                    <View key={trip.id} style={styles.tripCard}>
                      <Text style={styles.tripTitle}>{trip.city}</Text>
                      <Text style={styles.tripDate}>
                        {trip.start_date} - {trip.end_date}
                      </Text>
                    </View>
                  ))}
                </>
              )}
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

      <AddTripModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...layout.screen,
  },
  content: {
    ...layout.content,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  tabButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  tabText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: colors.strongbutton,
  },
  activeTabText: {
    color: colors.strongbutton,
    fontWeight: "bold",
  },
  contentContainer: {
    paddingTop: spacing.sm,
  },
  addButton: {
    backgroundColor: colors.strongbutton,
    padding: spacing.sm,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: spacing.sm,
  },
  addButtonText: {
    color: colors.textWhite,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    color: colors.textPrimary,
  },
  tripCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  tripTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  tripDate: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  placeholderText: {
    textAlign: "center",
    color: colors.textSecondary,
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    lineHeight: 22,
  },
});

export default TripHistoryScreen;
