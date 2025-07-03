import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import axios from 'axios';

// 타입 선언
type Plan = {
  plan_id: number;
  date: string;
  time: string;
  place: string;
  note: string;
};

type TripData = {
  trip_id: number;
  start_date: string;
  end_date: string;
  days: Plan[];
};

type MarkedDates = {
  [date: string]: {
    startingDay?: boolean;
    endingDay?: boolean;
    color: string;
    textColor: string;
  };
};

export default function K_Calendar(): JSX.Element {
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedPlans, setSelectedPlans] = useState<Plan[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const planRes = await axios.get('http://192.168.35.179:3000/trips/1/items');
        const tripRes = await axios.get('http://192.168.35.179:3000/trips/1');

        const tripData: TripData = {
          trip_id: tripRes.data.id,
          start_date: tripRes.data.start_date,
          end_date: tripRes.data.end_date,
          days: planRes.data // Plan[]
        };

        setTripData(tripData);
        generateMarkedDates(tripRes.data.start_date, tripRes.data.end_date);
      } catch (err) {
        console.error(err);
      }
    };

    const generateMarkedDates = (start: string, end: string) => {
    const marks: MarkedDates = {};
    const startDate = new Date(start);
    const endDate = new Date(end);
    const dateArray: string[] = [];

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const iso = d.toISOString().split('T')[0];
      dateArray.push(iso);
    }

    dateArray.forEach((date, index) => {
      marks[date] = {
        startingDay: index === 0,
        endingDay: index === dateArray.length - 1,
        color: '#FFC0CB',
        textColor: 'white'
      };
    });
    setMarkedDates(marks);
  };

    fetchTrip();
  }, []);

  const handleDayPress = (day: DateData) => {
    const dateStr = day.dateString;
    const plans = tripData?.days.filter(p => p.date === dateStr) || [];

    setSelectedDate(dateStr);
    setSelectedPlans(plans);
    setModalVisible(true);
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
