import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { WebView } from 'react-native-webview';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withTiming,
  clamp,
} from 'react-native-reanimated';


const SCREEN_WIDTH = Dimensions.get('window').width;

type Plan = {
  time: string;
  title: string;
  detail: string;
};

type DatePlan = {
  key: string;
  display: string;
  plans: Plan[];
};

const generateDates = (count = 30): DatePlan[] => {
  const today = new Date();
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i - 15);
    const key = format(date, 'yyyy-MM-dd');
    return {
      key,
      display: format(date, 'yyyy년 M월 d일'),
      plans: [
        { time: '10:00', title: '방문 일정', detail: '삿포로 시계탑' },
        { time: '14:00', title: '점심 식사', detail: '스프카레 맛집 방문' },
      ],
    };
  });
};

export default function SchedulingScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [viewMode, setViewMode] = useState<'calendar' | 'map'>('calendar');
  const flatListRef = useRef<FlatList<DatePlan>>(null);
  const dateList: DatePlan[] = generateDates();

  // 상단 영역 높이 관리
  const topHeight = useSharedValue(150);
  const MIN_HEIGHT = 150;
  const MAX_HEIGHT = 500;

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startHeight = topHeight.value;
    },
    onActive: (event, ctx) => {
      topHeight.value = clamp(ctx.startHeight + event.translationY, MIN_HEIGHT, MAX_HEIGHT);
    },
    onEnd: () => {
      // snap 처리: 절반 기준으로 최소/최대 높이로 이동
      if (topHeight.value > (MIN_HEIGHT + MAX_HEIGHT) / 2) {
        topHeight.value = withTiming(MAX_HEIGHT, { duration: 200 });
      } else {
        topHeight.value = withTiming(MIN_HEIGHT, { duration: 200 });
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    height: topHeight.value,
  }));

  const onDatePress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    const index = dateList.findIndex((d) => d.key === day.dateString);
    if (index !== -1) {
      flatListRef.current?.scrollToIndex({ index, animated: true });
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* 상단 뷰 (달력 or 지도) + PanGestureHandler */}
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[animatedStyle]}>
          {viewMode === 'calendar' ? (
            <Calendar
              onDayPress={onDatePress}
              markedDates={{
                [selectedDate]: { selected: true, selectedColor: '#007AFF' },
              }}
              theme={{ todayTextColor: '#007AFF' }}
            />
          ) : (
            <WebView
              style={{ flex: 1 }}
              source={{
                uri: 'https://www.google.com/maps/',
                // uri: 'https://www.google.com/maps/embed/v1/view?key=YOUR_API_KEY&center=43.0618,141.3545&zoom=12',
              }}
            />
          )}
        </Animated.View>
      </PanGestureHandler>

      {/* 🔄 달력 / 지도 전환 버튼 */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'calendar' && styles.toggleActive]}
          onPress={() => setViewMode('calendar')}
        >
          <Text style={styles.toggleText}>달력 보기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'map' && styles.toggleActive]}
          onPress={() => setViewMode('map')}
        >
          <Text style={styles.toggleText}>지도 보기</Text>
        </TouchableOpacity>
      </View>

      {/* 일정표 (항상 표시) */}
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
            {item.plans.map((plan, index) => (
              <View key={index} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTime}>{plan.time}</Text>
                  <Text style={styles.cardTitle}>{plan.title}</Text>
                </View>
                <Text style={styles.cardDetail}>{plan.detail}</Text>
              </View>
            ))}
            <TouchableOpacity
              style={[styles.card, styles.addCard]}
              onPress={() => console.log(`"${item.display}"에 일정 추가`)}
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
        contentContainerStyle={styles.listBackground} // 🔹 배경 적용
      />

      {/* ➕ 일정 추가 버튼 */}
      <TouchableOpacity style={styles.fab} onPress={() => {}}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  toggleActive: { backgroundColor: '#007AFF' },
  toggleText: { color: '#fff', fontWeight: 'bold' },
  dayPage: { width: SCREEN_WIDTH, padding: 16 },
  dateText: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  cardTime: { fontWeight: 'bold', marginRight: 12, fontSize: 16 },
  cardTitle: { fontSize: 16 },
  cardDetail: { fontSize: 14, color: '#555', marginTop: 4 },
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
  addCardText: { fontSize: 16, color: '#007AFF', fontWeight: 'bold' },
    listBackground: {
    backgroundColor: '#fff', // 불투명 흰색
  },
});
