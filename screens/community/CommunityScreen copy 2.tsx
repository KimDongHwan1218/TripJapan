import React, { useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";

const { width } = Dimensions.get("window");

export default function CommunityScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;

  const tabOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const tabTranslate = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [0, -20],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* 상단 타이틀 */}
        <View style={styles.header}>
          <Text style={styles.logo}>커뮤니티</Text>
        </View>

        {/* 게시판 바 */}
        <Animated.View
          style={[
            styles.boardBar,
            {
              opacity: tabOpacity,
              transform: [{ translateY: tabTranslate }],
            },
          ]}
        >
          {["전체", "자유", "정보", "여행후기", "질문"].map((item, idx) => (
            <TouchableOpacity key={idx} style={styles.boardItem}>
              <Text style={idx === 0 ? styles.boardActive : styles.boardText}>
                {item}
              </Text>
              {idx === 0 && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* 광고 배너 */}
        <View style={styles.adContainer}>
          <Text style={styles.adText}>✈️ 일본 항공권 특가 49,900원~</Text>
        </View>

        {/* 실시간 인기글 */}
        <Section title="🔥 실시간 인기글" />

        {/* 최신글 */}
        <Section title="🆕 최신글" />
      </Animated.ScrollView>
    </View>
  );
}

function Section({ title }: { title: string }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>

      {Array.from({ length: 5 }).map((_, i) => (
        <TouchableOpacity key={i} style={styles.postCard}>
          <Text style={styles.postTitle}>
            도쿄 여행 꿀팁 공유합니다 {i + 1}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.meta}>조회 128</Text>
            <Text style={styles.meta}>댓글 12</Text>
            <Text style={styles.meta}>2시간 전</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },

  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  logo: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111",
  },

  /* ===== 게시판 바 ===== */

  boardBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: width,
    backgroundColor: "#f3f4f6",
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderColor: "#e5e7eb",
  },

  boardItem: {
    alignItems: "center",
  },

  boardText: {
    fontSize: 15,
    color: "#6b7280",
  },

  boardActive: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },

  activeIndicator: {
    marginTop: 6,
    width: 20,
    height: 2,
    backgroundColor: "#111",
  },

  /* ===== 광고 ===== */

  adContainer: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: "#111",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },

  adText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },

  /* ===== 섹션 ===== */

  section: {
    marginTop: 30,
    paddingHorizontal: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    color: "#111",
  },

  postCard: {
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderColor: "#e5e7eb",
  },

  postTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111",
  },

  metaRow: {
    flexDirection: "row",
    marginTop: 8,
  },

  meta: {
    fontSize: 12,
    color: "#9ca3af",
    marginRight: 12,
  },
});
