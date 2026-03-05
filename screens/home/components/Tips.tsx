import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
} from "react-native";

export interface TipItem {
  id: string;
  question: string;
  answer: string;
}

interface Props {
  data?: TipItem[];
}

const FALLBACK: TipItem[] = [
  {
    id: "1",
    question: "여행 준비물",
    answer:
      "여권, 현금(엔화), 유심 또는 eSIM, 교통카드(Suica/PASMO), 충전기, 멀티어댑터 등을 챙기세요.",
  },
  {
    id: "2",
    question: "교통 이용",
    answer:
      "도시 내 이동은 Suica/PASMO 카드가 편리합니다. NAVITIME 앱으로 노선을 미리 확인하세요.",
  },
  {
    id: "3",
    question: "결제 수단",
    answer:
      "PayPay, 현금, 신용카드 모두 사용 가능하지만 외국 카드가 안 되는 매장도 있습니다.",
  },
];

export default function Tips({ data }: Props) {
  const list = data && data.length > 0 ? data : FALLBACK;
  const [selectedId, setSelectedId] = useState(list[0]?.id);
  const selectedAnswer =
    list.find((i) => i.id === selectedId)?.answer ??
    "질문을 선택해보세요.";

  return (
    <View style={styles.container}>
      {/* 답변 카드 */}
      <View style={styles.answerCard}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.answerText}>{selectedAnswer}</Text>
        </ScrollView>
      </View>

      {/* 질문 리스트 */}
      <FlatList
        data={list}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.questionList}
        renderItem={({ item }) => {
          const active = item.id === selectedId;
          return (
            <TouchableOpacity
              onPress={() => setSelectedId(item.id)}
              style={[
                styles.questionPill,
                active && styles.questionPillActive,
              ]}
            >
              <Text
                style={[
                  styles.questionText,
                  active && styles.questionTextActive,
                ]}
              >
                {item.question}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },

  // 답변 카드
  answerCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  answerText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#333",
  },

  // 질문 리스트
  questionList: {
    paddingVertical: 4,
  },
  questionPill: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#DDD",
    backgroundColor: "#FFF",
  },
  questionPillActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  questionText: {
    fontSize: 14,
    color: "#333",
  },
  questionTextActive: {
    color: "#FFF",
    fontWeight: "600",
  },
});
