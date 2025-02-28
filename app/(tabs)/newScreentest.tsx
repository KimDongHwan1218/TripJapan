import React, { useState } from 'react';
import { View, Text, FlatList, ScrollView, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const scheduleWidth = screenWidth * 2;
const hourWidth = scheduleWidth / 24

const dates = [
  { id: '1', date: '2025-03-01' },
  { id: '2', date: '2025-03-02' },
  { id: '3', date: '2025-03-03' },
  { id: '4', date: '2025-03-04' },
];

interface ScheduleItem {
  event: string;
  startTime: number;
  endTime: number;
}

const schedules: { [key: string]: ScheduleItem[] } = {
  "2025-03-01": [
    { event: "회의", startTime: 0, endTime: 10.5 },
    { event: "점심", startTime: 12, endTime: 13 },
    { event: "개발 작업", startTime: 14, endTime: 16.5 },
  ],
  "2025-03-02": [
    { event: "출근", startTime: 8, endTime: 9 },
    { event: "미팅", startTime: 11, endTime: 12.5 },
    { event: "프로젝트 회의", startTime: 15, endTime: 16 },
  ],
};



const hours = Array.from({ length: 13 }, (_, i) => i * 2);

export default function ScheduleScreen()  {
  const [selectedDate, setSelectedDate] = useState<string>('2025-03-01');
  const scheduleList = schedules[selectedDate] || [];

  return (
    <View style={styles.container}>

      <View style={styles.dateTabContainer}>
        <FlatList
          data={dates}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.dateButton, selectedDate === item.date && styles.selectedDate]}
              onPress={() => setSelectedDate(item.date)}
            >
              <Text style={styles.dateText}>{item.date}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        <View>
          <View style={styles.timeBar}>
            {hours.map((hour) => (         
              <Text key={hour} style={styles.timeLabel}>{hour}시</Text>
            ))}
          </View>

          <View style={styles.borderBar}>
            {hours.map((hour) => (
              <View key={hour} style={styles.borderLine}/>
            ))}
          </View>

          <View style={styles.scheduleContainer}>
            {scheduleList.map((item, index) => (
              <View
                key={index}
                style={[styles.scheduleItem, { left: (item.startTime)*hourWidth+10, width: hourWidth*(item.endTime - item.startTime) }]}
              >
                <Text style={styles.eventText}>{item.event}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#fff',
  },
  dateTabContainer: {
    height: screenHeight * 0.10,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  dateButton: {
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#f5f5f5',
  },
  selectedDate: {
    backgroundColor: '#007bff',
  },
  dateText: {
    color: '#333',
  },
  timeBar: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  timeLabel: {
    width: hourWidth*2,
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
  },
  borderBar: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical:hourWidth,
    height: 200,
    position:'absolute'
  },
  borderLine: {
    borderLeftColor: '#ddd',
    borderLeftWidth: 1,
    width: hourWidth*2,
  },
  scheduleScroll: {
    flex: 1,
    paddingHorizontal:10,
    // paddingVertical: 10,
  },
  scrollView: {
    flexDirection: 'row',
    position: 'relative',
  },
  scheduleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: screenWidth * 2,
    paddingHorizontal: 10,
    height: 150,
  },
  scheduleItem: {
    position: 'absolute',
    // width: 100,
    height: 100,
    // paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventText: {
    color: '#fff',
    fontSize: 14,
  },
});