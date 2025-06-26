import { Calendar, LocaleConfig, DateData } from 'react-native-calendars';
import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

LocaleConfig.locales.fr = {
  monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'],
  dayNamesShort: ['일','월','화','수','목','금','토'],
  today: "Aujourd'hui",
};

LocaleConfig.defaultLocale = 'fr';

type Plan = {
  plan_id: number;
  time: string;
  place: string;
  note: string;
};

type DayPlan = {
  date: string; // 'YYYY-MM-DD'
  plans: Plan[];
};

type TripData = {
  trip_id: number;
  start_date: string;
  end_date: string;
  days: DayPlan[];
};

type MarkedDates = {
  [date: string]: {
    startingDay?: boolean;
    endingDay?: boolean;
    color: string;
    textColor: string;
  };
};

const Temp_Data = {
  "trip_id": 1,
  "start_date": "2025-07-01",
  "end_date": "2025-07-04",
  "days": [
    {
      "date": "2025-07-01",
      "plans": [
        {
          "plan_id": 101,
          "time": "10:00",
          "place": "삿포로 시계탑",
          "note": "사진 찍기"
        },
        {
          "plan_id": 102,
          "time": "13:00",
          "place": "라멘 요코쵸",
          "note": "점심식사"
        }
      ]
    },
    {
      "date": "2025-07-02",
      "plans": [
        {
          "plan_id": 201,
          "time": "09:00",
          "place": "오타루 운하",
          "note": ""
        }
      ]
    },
    {
      "date": "2025-07-03",
      "plans": []
    },
    {
      "date": "2025-07-04",
      "plans": [
        {
          "plan_id": 401,
          "time": "12:00",
          "place": "공항",
          "note": "귀국"
        }
      ]
    }
  ]
}

export default function K_Calendar(): JSX.Element {
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedPlans, setSelectedPlans] = useState<Plan[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    const generateMarkedDates = () => {
      const days = Temp_Data.days.map(d => d.date);
      const marks: MarkedDates = {};

      days.forEach((date, index) => {
        const isFirst = index === 0;
        const isLast = index === days.length - 1;

        marks[date] = {
          startingDay: isFirst,
          endingDay: isLast,
          color: '#FFC0CB',
          textColor: 'white'
        };
      });

      setMarkedDates(marks);
    };

    generateMarkedDates();
  }, []);

  const handleDayPress = (day: DateData) => {
    const dateStr = day.dateString;
    const matched = Temp_Data.days.find(d => d.date === dateStr);

    if (matched) {
      setSelectedDate(dateStr);
      setSelectedPlans(matched.plans);
      setModalVisible(true);
    } else {
      setSelectedPlans([]);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Calendar
        markingType="period"
        markedDates={markedDates}
        onDayPress={handleDayPress}
      />

      <Modal
        animationType="slide"
        visible={modalVisible}
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.memoPad}>
            <Text style={styles.dateText}>{selectedDate}</Text>

            {selectedPlans.length === 0 ? (
              <Text style={styles.emptyText}>계획이 없습니다</Text>
            ) : (
              <FlatList
                data={selectedPlans}
                keyExtractor={(item) => item.plan_id.toString()}
                renderItem={({ item }) => (
                  <Text style={styles.planText}>
                    🕒 {item.time} - {item.place}{item.note ? ` (${item.note})` : ''}
                  </Text>
                )}
              />
            )}

            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={{ color: 'white' }}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 100,
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  memoPad: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '60%'
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  planText: {
    fontSize: 16,
    marginVertical: 4
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#999'
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#FF69B4',
    padding: 10,
    borderRadius: 6,
    alignSelf: 'center'
  }
});