// app/(main)/index.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, Dimensions } from 'react-native';
// import { Image } from 'expo-image';

const { width } = Dimensions.get('window');

export default function BookingScreen() {
  return (
    <View style={{ flex: 1 }}>
      {/* 스크롤 가능한 내용 */}
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>항공권 | 숙소</Text>
        <View style={styles.calander}>
          <Text>달력</Text>
        </View>
        <View style={styles.select}>
          <Text>출발</Text>
        </View>
        <View style={styles.select}>
          <Text>도착</Text>
        </View>
        <View style={styles.select}>
          <Text>기타</Text>
        </View>
        <Text style={styles.sectionTitle}>인기 여행지</Text>
        <FlatList
          horizontal
          data={[1, 2, 3, 4, 5]}
          keyExtractor={(item) => item.toString()}
          renderItem={() => <View style={styles.travelBox} />}
          showsHorizontalScrollIndicator={false}
        />
        <Text style={styles.sectionTitle}>이전 항공권 예매 내역</Text>
        <FlatList
          horizontal
          data={[1, 2, 3, 4, 5]}
          keyExtractor={(item) => item.toString()}
          renderItem={() => <View style={styles.travelBox} />}
          showsHorizontalScrollIndicator={false}
        />

      <Text style={styles.sectionTitle}>이전 숙소 예약 기록</Text>
        <FlatList
          horizontal
          data={[1, 2, 3, 4, 5]}
          keyExtractor={(item) => item.toString()}
          renderItem={() => <View style={styles.travelBox} />}
          showsHorizontalScrollIndicator={false}
        />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  calander: {
    width: width *0.8,
    height: 200,
    backgroundColor: '#ccc',
    borderRadius: 5,
    margin: 5
  },
  select: {
    width: width *0.8,
    height: 40,
    backgroundColor: '#ccc',
    borderRadius: 5,
    margin: 5
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  travelBox: {
    width: width * 0.6,
    height: 120,
    backgroundColor: '#ccc',
    borderRadius: 16,
    marginRight: 12,
  },
  top3Container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  circleImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ccc',
  },
});