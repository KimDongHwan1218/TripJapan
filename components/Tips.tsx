import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from "react-native";

const { width } = Dimensions.get("window");

export default function Tips() {
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string>("질문을 선택해보세요 😊");

  // 질문-답변 데이터
  const faqs = [
    {
      id: "1",
      question: "일본 여행 시 꼭 챙겨야 할 것은?",
      answer:
        "여권, 현금(엔화), 유심 또는 eSIM, 교통카드(Suica/PASMO), 충전기, 멀티어댑터 등을 챙기세요.",
    },
    {
      id: "2",
      question: "일본 내 교통수단 추천은?",
      answer:
        "도시 내 이동은 JR패스나 Suica/PASMO 카드가 편리합니다. NAVITIME 앱으로 노선을 미리 확인하세요.",
    },
    {
      id: "3",
      question: "편의점 결제는 어떻게 하나요?",
      answer:
        "PayPay나 현금, 신용카드 모두 가능합니다. 단, 일부 점포는 외국 카드가 안될 수 있습니다.",
    },
    {
      id: "4",
      question: "인터넷 없이 길찾기 가능한가요?",
      answer:
        "Google Maps의 오프라인 저장 기능을 이용하거나, MAPS.ME 같은 오프라인 지도 앱을 사용하세요.",
    },
    {
      id: "5",
      question: "음식점에서 팁을 줘야 하나요?",
      answer:
        "일본은 팁 문화가 없습니다. 계산서에 표시된 금액 그대로 지불하시면 됩니다.",
    },
  ];

  const handlePress = (item: any) => {
    setSelectedQuestion(item.id);
    setAnswer(item.answer);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단: 답변 영역 */}
      <View style={styles.answerBox}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.answerText}>{answer}</Text>
        </ScrollView>
      </View>

      {/* 하단: 질문 버튼 영역 */}
      <View style={styles.questionContainer}>
        <FlatList
          data={faqs}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.questionButton,
                selectedQuestion === item.id && styles.selectedButton,
              ]}
              onPress={() => handlePress(item)}
            >
              <Text
                style={[
                  styles.questionText,
                  selectedQuestion === item.id && styles.selectedText,
                ]}
              >
                {item.question}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  answerBox: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    justifyContent: "center",
  },
  answerText: {
    fontSize: 18,
    color: "#333",
    lineHeight: 26,
  },
  questionContainer: {
    height: 90,
  },
  questionButton: {
    backgroundColor: "#E9ECEF",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginRight: 10,
  },
  questionText: {
    color: "#333",
    fontSize: 15,
  },
  selectedButton: {
    backgroundColor: "#007AFF",
  },
  selectedText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
