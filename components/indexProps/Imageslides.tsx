import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Dimensions, Linking, TouchableOpacity, Text } from 'react-native';
import Swiper from 'react-native-web-swiper';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_Width = Dimensions.get('window').width;

// Article 데이터 타입 정의
interface Article {
  href: string;
  imgSrc: string;
  date: string;
}

const Imageslides: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [key, setKey] = useState(0); 

  const handleImagePress = (url: string) => {
    // 해당 링크로 이동
    Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
  };

  // 데이터를 슬라이드 단위로 나누는 함수
  const chunkArticles = (arr: Article[], size: number) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`http://192.168.35.131:3000/api/articles?siteName=ㅇ&siteUrl=0&siteTopdiv=o&linkHtml=o&mgHtml=oo`);
        const data = await response.json();
        setArticles(data.articles); // API에서 가져온 데이터 설정
        setLoading(false);
        setKey((prevKey)=>prevKey+1);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);

  // 슬라이드 단위로 데이터 분리 (한 슬라이드에 3개씩 배치)
  const slides = chunkArticles(articles, 2);
 
  return (
    <View style={styles.container}>
      {loading ? (
        <View>
          <Text>onLoading</Text>
        </View>
      ) : (
      <Swiper
        // loop
        // timeout={10}
        containerStyle={{ width: '100%', height: SCREEN_HEIGHT / 2.5 }}
        controlsProps={{
          prevPos: false,
          nextPos: false,
        }}
      >
        {slides.map((slide, slideIndex) => (
          <View key={slideIndex} style={styles.slide}>
            {slide.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleImagePress(item.href)}  // 이미지 클릭 시 링크로 이동
                activeOpacity={0.7}
                >
                  <Image source={{ uri: item.imgSrc }} style={{height: SCREEN_HEIGHT / 6, width: SCREEN_Width / 1.3}} />
              </TouchableOpacity>
              
            ))}
          </View>
          
        ))}
      </Swiper>)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  swiperContainer: {
    width: '100%',
    height: SCREEN_HEIGHT / 2,
    paddingVertical: 10, // 슬라이드 사이에 여백 추가
  },
  slide: {
    flex: 1,

    justifyContent: 'space-around',
    alignItems: 'center',
    // paddingHorizontal: 10, // 좌우 여백 추가
    // marginBottom: 10, // 슬라이드 간격 추가
    backgroundColor: '#f9f9f9', // 슬라이드 배경 색
    borderRadius: 10, // 슬라이드 모서리를 둥글게
  },
  image: {
    width: '90%',
    height: SCREEN_HEIGHT / 6, // 슬라이드 높이의 1/3
    resizeMode: 'cover',
    borderRadius: 10,
  },
});

export default Imageslides;
