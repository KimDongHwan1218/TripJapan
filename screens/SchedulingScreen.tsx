import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

const SCREEN_WIDTH = Dimensions.get('window').width;

// ✅ 타입 정의
type Plan = {
  time: string;
  title: string;
  detail: string;
};

type DatePlan = {
  key: string;        // '2025-07-01'
  display: string;    // '2025년 7월 1일'
  plans: Plan[];
};

// ✅ 테스트용 날짜/일정 데이터 생성
const generateDates = (count = 30): DatePlan[] => {
  const today = new Date();
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i - 15); // -15일 ~ +15일
    const key = format(date, 'yyyy-MM-dd');
    return {
      key,
      display: format(date, 'yyyy년 M월 d일'),
      plans: [
        {
          time: '10:00',
          title: '방문 일정',
          detail: '삿포로 시계탑',
        },
        {
          time: '14:00',
          title: '점심 식사',
          detail: '스프카레 맛집 방문',
        },
      ],
    };
  });
};

export default function SchedulingScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const flatListRef = useRef<FlatList<DatePlan>>(null);
  const dateList: DatePlan[] = generateDates();

  // ✅ 날짜 누르면 해당 페이지로 스크롤
  const onDatePress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    const index = dateList.findIndex((d) => d.key === day.dateString);
    if (index !== -1) {
      flatListRef.current?.scrollToIndex({ index, animated: true });
    }
  };

  return (
    <View style={styles.container}>
      {/* 📅 달력 */}
      <Calendar
        onDayPress={onDatePress}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: '#007AFF' },
        }}
        theme={{
          todayTextColor: '#007AFF',
        }}
      />

      {/* 📅 날짜별 일정 리스트 */}
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

            {item.plans.map((plan: Plan, index: number) => (
              <View key={index} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTime}>{plan.time}</Text>
                  <Text style={styles.cardTitle}>{plan.title}</Text>
                </View>
                <Text style={styles.cardDetail}>{plan.detail}</Text>
              </View>
            ))}

            {/* ➕ 일정 추가 카드 */}
            <TouchableOpacity
              style={[styles.card, styles.addCard]}
              onPress={() => {
                console.log(`"${item.display}"에 일정 추가`);
                // 또는 modal open 등 추후 연결
              }}
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
      />

      {/* ➕ 추가 버튼 */}
      <TouchableOpacity style={styles.fab} onPress={() => {}}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  dayPage: {
    width: SCREEN_WIDTH,
    padding: 16,
  },
  dateText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTime: {
    fontWeight: 'bold',
    marginRight: 12,
    fontSize: 16,
  },
  cardTitle: {
    fontSize: 16,
  },
  cardDetail: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: '#007AFF',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 100,
  },
  addCard: {
  backgroundColor: '#e0f0ff',
  justifyContent: 'center',
  alignItems: 'center',
  height: 80,
  borderStyle: 'dashed',
  borderWidth: 2,
  borderColor: '#007AFF',
},

addCardText: {
  fontSize: 16,
  color: '#007AFF',
  fontWeight: 'bold',
},
});
