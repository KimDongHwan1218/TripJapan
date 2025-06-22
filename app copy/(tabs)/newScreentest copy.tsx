import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, Modal, TextInput, StyleSheet, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';



const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const scheduleWidth = screenWidth * 2;
const hourWidth = scheduleWidth / 24

const hours = Array.from({ length: 13 }, (_, i) => i * 2); // 0~24시 (2시간 간격)

// ✅ ScheduleItem 인터페이스 정의
interface ScheduleItem {
  date: string;      // 일정 날짜 (YYYY-MM-DD)
  event: string;     // 일정 이름
  startTime: string; // 시작 시간 (예: "12.5" → 12시 30분)
  endTime: string;   // 끝나는 시간 (예: "14.0" → 14시 00분)
}

const ScheduleScreen = () => {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [modalVisible, setModalVisible] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<ScheduleItem>({ date: '', event: '', startTime: '', endTime: '' });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    loadSchedules();
  }, []);

  // 📌 일정 불러오기
  const loadSchedules = async () => {
    try {
      const storedSchedules = await AsyncStorage.getItem('schedules');
      if (storedSchedules) setSchedules(JSON.parse(storedSchedules));
    } catch (error) {
      console.error('Error loading schedules:', error);
    }
  };

  // 📌 일정 저장
  const saveSchedules = async (newSchedules: ScheduleItem[]) => {
    try {
      await AsyncStorage.setItem('schedules', JSON.stringify(newSchedules));
      setSchedules(newSchedules);
    } catch (error) {
      console.error('Error saving schedules:', error);
    }
  };

  // 📌 일정 추가/수정
  const handleSaveSchedule = () => {
    if (!currentEvent.event || !currentEvent.startTime || !currentEvent.endTime) return;

    let newSchedules = [...schedules];

    if (editingIndex !== null) {
      newSchedules[editingIndex] = currentEvent;
    } else {
      newSchedules.push({ ...currentEvent, date: selectedDate });
    }

    saveSchedules(newSchedules);
    setModalVisible(false);
    setEditingIndex(null);
  };

  // 📌 일정 삭제
  const handleDeleteSchedule = () => {
    let newSchedules = schedules.filter((_, index) => index !== editingIndex);
    saveSchedules(newSchedules);
    setModalVisible(false);
    setEditingIndex(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>타비료코</Text>
      </View>
      <View style={styles.dateTabContainer}>
        <FlatList
          data={getWeekDates()}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.dateButton, selectedDate === item && styles.selectedDate]}
              onPress={() => setSelectedDate(item)}
            >
              <Text style={styles.dateText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.timeBar}>
          {hours.map((hour) => (
            <Text key={hour} style={styles.timeLabel}>{`${hour}시`}</Text>
          ))}
        </View>

        <View style={styles.borderBar}>
          {hours.map((hour) => (
            <View key={hour} style={styles.borderLine}/>
          ))}
        </View>

        <View style={styles.scheduleContainer}>
          {schedules
            .filter((event) => event.date === selectedDate)
            .map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.scheduleItem,{left: (parseFloat(item.startTime))*hourWidth+10, width: hourWidth*(parseFloat(item.endTime) - parseFloat(item.startTime))}]}
                onPress={() => {
                  setCurrentEvent(item);
                  setEditingIndex(index);
                  setModalVisible(true);
                }}
              >
                <Text style={styles.eventText}>{item.event}</Text>
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setCurrentEvent({ date: selectedDate, event: '', startTime: '', endTime: '' });
          setModalVisible(true);
        }}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>일정 {editingIndex !== null ? '수정' : '추가'}</Text>

            <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => {
              setModalVisible(false);
            }}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>

            <TextInput placeholder="일정 이름" style={styles.input} value={currentEvent.event} onChangeText={(text) => setCurrentEvent({ ...currentEvent, event: text })} />
            <TextInput placeholder="시작 시간 (예: 12.5)" style={styles.input} keyboardType="numeric" value={currentEvent.startTime} onChangeText={(text) => setCurrentEvent({ ...currentEvent, startTime: text })} />
            <TextInput placeholder="끝 시간 (예: 14.0)" style={styles.input} keyboardType="numeric" value={currentEvent.endTime} onChangeText={(text) => setCurrentEvent({ ...currentEvent, endTime: text })} />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={handleSaveSchedule} style={[styles.Button, {backgroundColor: '#FF608E'}]}><Text style={styles.ButtonText}>저장</Text></TouchableOpacity>
              {editingIndex !== null && <TouchableOpacity onPress={handleDeleteSchedule} style={[styles.Button, {backgroundColor: '#f5f5f5'}]}><Text style={styles.ButtonText}>삭제</Text></TouchableOpacity>}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// 📌 오늘 날짜를 YYYY-MM-DD 형식으로 반환
const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

// 📌 일주일 날짜 리스트 반환
const getWeekDates = (): string[] => {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date.toISOString().split('T')[0];
  });
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF608E',
  },
  logo: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
  },
  dateTabContainer: {
    marginTop: 20,
    marginBottom: 10,
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
    backgroundColor: '#FF608E',
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
    textAlign: 'left',
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
    position: 'absolute',
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
    backgroundColor: '#FF608E',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventText: {
    color: '#fff',
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    backgroundColor: '#FF608E',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabText: { 
    fontSize: 30,
    color: 'white'
  },
  modalContainer: { 
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: { 
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    padding: 10,
    // zIndex:1
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#555',
  },
  input: { 
    borderBottomWidth: 1,
    marginVertical: 10,
    padding: 8
  },
  Button: { 
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center'
  },
  ButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
});

export default ScheduleScreen;
