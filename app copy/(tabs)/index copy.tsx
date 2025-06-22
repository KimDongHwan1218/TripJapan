import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Linking } from 'react-native';
import Swiper from 'react-native-web-swiper';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const chatbotquestions = [
  { question: "1111?", answer: "111111111" },
  { question: "222222?", answer: "2222" },
  { question: "333?", answer: "33333333" },
  { question: "444444", answer: "444444444" },
  { question: "55555", answer: "55555555555" },
  { question: "6?", answer: "666" }
];
 
const imageSlidesdata = [
  {imgSrc: 'https://img1.esimg.jp/resize/180x120/blog/wp-content/uploads/2025/01/1200_800-1-300x200.png?ts=20250227060510', description: '모구나비- 편의점 신상', url: 'https://mognavi.jp/'},
  {imgSrc: 'https://www3.nhk.or.jp/weather-data/v1/nhkworld/site/multilang/img/quake/20250223130814.png', description: '지진경보', url: 'https://www3.nhk.or.jp/nhkworld/ko/news/weather-disaster/earthquake/'},
  {imgSrc: 'https://kr.aeonmall.global/img/store/11_Tokoname.png', description: '이온몰 쿠폰사이트', url: 'https://kr.aeonmall.global/coupon-list/'},
  {imgSrc: 'https://collabo-cafe.com/wp-content/uploads/4dffd6776e8c42f7d550beaccde1b678-978-486x290.jpg', description: '씹덕', url: 'https://collabo-cafe.com/'}
];

export default function HomeScreen() {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');

  const handleQuestionClick = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleImagePress = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>타비료코</Text>
      </View>

      <View style={styles.chatbotContainer}>
        <View style={styles.responseContainer}>
          <Text style={styles.responseText}>{selectedAnswer || '질문을 선택하세요.'}</Text>
        </View>

        <ScrollView horizontal style={styles.questionsContainer}>
          {chatbotquestions.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.questionBox}
              onPress={() => handleQuestionClick(item.answer)}
            >
              <Text style={styles.questionText}>{item.question}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.imageSlideContainer}>
        <Swiper
          loop
          timeout={5}
          containerStyle={styles.swiperContainer}
          controlsProps={{ prevPos: false, nextPos: false }}
        >
          {imageSlidesdata.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => handleImagePress(item.url)} style={styles.imageSlide}>
              <Image source={{ uri: item.imgSrc }} style={styles.image} />
              <Text style={styles.imageDescription}>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </Swiper>
      </View>
    </View>
  );
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
  chatbotContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  responseContainer: {
    width: SCREEN_WIDTH - 40,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  responseText: {
    fontSize: 18,
    color: '#333',
  },
  questionsContainer: {
    marginBottom: 20,
  },
  questionBox: {
    backgroundColor: '#FF608E',
    padding: 15,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  questionText: {
    color: '#fff',
    fontSize: 16,
  },
  imageSlideContainer: {
    marginTop: 30,
    height: 300,
  },
  swiperContainer: {
    width: '100%',
    height: '100%',
  },
  imageSlide: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 300,
    height: 200,
    resizeMode: 'cover',
  },
  imageDescription: {
    marginTop: 10,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
});
