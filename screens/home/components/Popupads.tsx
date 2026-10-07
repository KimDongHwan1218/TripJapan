import React, { useEffect, useState } from "react";
import { Modal, View, Image, TouchableOpacity, StyleSheet, Dimensions, Linking } from "react-native";
import Text from "@/components/ui/Text";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors, radius } from "@/styles";

const { width } = Dimensions.get("window");

// 🔹 광고 데이터 예시
const ADS = [
  {
    id: 1,
    image: require("../assets/images/ad1.png"),
    link: "https://www.japan.travel/",
    title: "일본 여행 필수 사이트!",
  },
  {
    id: 2,
    image: require("../assets/images/ad2.png"),
    link: "https://www.navitime.co.jp/",
    title: "NAVITIME으로 교통 조회",
  },
  {
    id: 3,
    image: require("../assets/images/ad3.png"),
    link: "https://paypay.ne.jp/",
    title: "PayPay로 간편 결제!",
  },
  {
    id: 4,
    image: require("../assets/images/ad4.png"),
    link: "https://www.hotpepper.jp/",
    title: "맛집 예약은 HotPepper",
  },
];

const TODAY_SKIP_KEY = "popup_skip_date";

export default function Popupads() {
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    checkSkipStatus();
  }, []);

  // 🔹 오늘 하루 보지 않기 여부 확인
  const checkSkipStatus = async () => {
    const today = new Date().toDateString();
    const skipDate = await AsyncStorage.getItem(TODAY_SKIP_KEY);
    if (skipDate !== today) {
      setVisible(true);
    }
  };

  // 🔹 오늘 하루 보지 않기 클릭
  const handleSkipToday = async () => {
    const today = new Date().toDateString();
    await AsyncStorage.setItem(TODAY_SKIP_KEY, today);
    setVisible(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ADS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? ADS.length - 1 : prev - 1
    );
  };

  const handleOpenLink = () => {
    Linking.openURL(ADS[currentIndex].link);
  };

  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* 🔹 광고 이미지 */}
          <TouchableOpacity onPress={handleOpenLink} activeOpacity={0.7}>
            <Image source={ADS[currentIndex].image} style={styles.image} />
          </TouchableOpacity>

          {/* 🔹 제목 */}
          <Text style={styles.title}>{ADS[currentIndex].title}</Text>

          {/* 🔹 페이지 인디케이터 */}
          <Text style={styles.pageText}>
            {currentIndex + 1} / {ADS.length}
          </Text>

          {/* 🔹 좌우 버튼 */}
          <View style={styles.navButtons}>
            <TouchableOpacity onPress={handlePrev} style={styles.arrowButton}>
              <Text style={styles.arrowText}>{"<"}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNext} style={styles.arrowButton}>
              <Text style={styles.arrowText}>{">"}</Text>
            </TouchableOpacity>
          </View>

          {/* 🔹 하단 버튼 */}
          <View style={styles.bottomButtons}>
            <TouchableOpacity onPress={handleSkipToday}>
              <Text style={styles.skipText}>오늘 하루 보지 않기</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Text style={styles.closeText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    width: width * 0.85,
    backgroundColor: colors.surface,
    borderRadius: radius.md, borderCurve: "continuous",
    overflow: "hidden",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: radius.md, borderCurve: "continuous",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
  },
  pageText: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 4,
  },
  navButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "40%",
    marginVertical: 12,
  },
  arrowButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.md, borderCurve: "continuous",
    backgroundColor: colors.neutral100,
  },
  arrowText: {
    fontSize: 20,
    color: colors.textPrimary,
  },
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 8,
  },
  skipText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  closeText: {
    fontSize: 14,
    color: "#ff4d4f",
    fontWeight: "500",
  },
});
