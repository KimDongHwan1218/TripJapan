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

export interface TipItem {
  id: string;
  question: string;
  answer: string;
}

interface Props {
  data?: TipItem[]; // 외부에서 주입되는 tips
}

const FALLBACK: TipItem[] = [
  {
    id: "1",
    question: "은?",
    answer:
      "여권, 현금(엔화), 유심 또는 eSIM, 교통카드(Suica/PASMO), 충전기, 멀티어댑터 등을 챙기세요.",
  },
  {
    id: "2",
    question: "은?",
    answer:
      "도시 내 이동은 JR패스나 Suica/PASMO 카드가 편리합니다. NAVITIME 앱으로 노선을 미리 확인하세요.",
  },
  {
    id: "3",
    question: "요?",
    answer:
      "PayPay나 현금, 신용카드 모두 가능합니다. 단, 일부 점포는 외국 카드가 안될 수 있습니다.",
  },
  {
    id: "4",
    question: "요?",
    answer:
      "Google Maps의 오프라인 저장 기능을 이용하거나, MAPS.ME 같은 오프라인 지도 앱을 사용하세요.",
  },
  {
    id: "5",
    question: "음식점에서 팁을 줘야 하나요?",
    answer: "일본은 팁 문화가 없습니다. 계산서에 표시된 금액 그대로 지불하시면 됩니다.",
  },
];

export default function Tips({ data }: Props) {
  const list = data && data.length > 0 ? data : FALLBACK;
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string>(
    list.length > 0 ? list[0].answer : "질문을 선택해보세요 😊"
  );

  const handlePress = (item: TipItem) => {
    setSelectedQuestion(item.id);
    setAnswer(item.answer);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.answerBox}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.answerText}>{answer}</Text>
        </ScrollView>
      </View>

      <View style={styles.questionContainer}>
        <FlatList
          data={list}
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
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  answerBox: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    minHeight: 100,
    justifyContent: "center",
  },
  answerText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
  },
  questionContainer: {
    height: 86,
  },
  questionButton: {
    backgroundColor: "#E9ECEF",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 18,
    marginRight: 10,
  },
  questionText: {
    color: "#333",
    fontSize: 14,
  },
  selectedButton: {
    backgroundColor: "#007AFF",
  },
  selectedText: {
    color: "#fff",
    fontWeight: "700",
  },
});
