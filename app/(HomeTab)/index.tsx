// app/(main)/index.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, Dimensions } from 'react-native';
import { Link, router } from 'expo-router';
// import { Image } from 'expo-image';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      {/* 스크롤 가능한 내용 */}
      <ScrollView contentContainerStyle={styles.container}>
        {/* 나의 여행으로 슬라이드 */}
        <Text style={styles.sectionTitle}>나의 여행으로</Text>
        <FlatList
          horizontal
          data={[1, 2, 3, 4, 5]}
          keyExtractor={(item) => item.toString()}
          renderItem={() => 
            <Link style={styles.travelBox} href="/(TravelTab)">
              <View>
                <Text>여행기록</Text>
              </View>
            </Link>}
          showsHorizontalScrollIndicator={false}
        />

      <Text style={styles.sectionTitle}>새로운 여행을 원한다면?</Text>
        <FlatList
          horizontal
          data={[1, 2, 3, 4, 5]}
          keyExtractor={(item) => item.toString()}
          renderItem={() => 
            <View style={styles.travelBox} >
              <Text>인기 관광지 추천</Text>
            </View>}
          showsHorizontalScrollIndicator={false}
        />

        {/* Top 3 항목 */}
        <Text style={styles.sectionTitle}>Top 3 항목</Text>
        <View style={styles.top3Container}>
          {[1, 2, 3].map((item) => (
            <View key={item} style={styles.circleImage} />
          ))}
        </View>
        <View style={styles.top3Container}>
          {[1, 2, 3].map((item) => (
            <View key={item} style={styles.circleImage} />
          ))}
        </View>
        <View style={styles.top3Container}>
          {[1, 2, 3].map((item) => (
            <View key={item} style={styles.circleImage} />
          ))}
        </View>
        <View style={styles.top3Container}>
          {[1, 2, 3].map((item) => (
            <View key={item} style={styles.circleImage} />
          ))}
        </View>
        <View style={styles.top3Container}>
          {[1, 2, 3].map((item) => (
            <View key={item} style={styles.circleImage} />
          ))}
        </View>
        <View style={styles.top3Container}>
          {[1, 2, 3].map((item) => (
            <View key={item} style={styles.circleImage} />
          ))}
        </View>
        <View style={styles.top3Container}>
          {[1, 2, 3].map((item) => (
            <View key={item} style={styles.circleImage} />
          ))}
        </View>
        <View style={styles.top3Container}>
          {[1, 2, 3].map((item) => (
            <View key={item} style={styles.circleImage} />
          ))}
        </View>
        <View style={styles.top3Container}>
          {[1, 2, 3].map((item) => (
            <View key={item} style={styles.circleImage} />
          ))}
        </View>
        <View style={styles.top3Container}>
          {[1, 2, 3].map((item) => (
            <View key={item} style={styles.circleImage} />
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
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