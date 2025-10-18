import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Linking,
  SafeAreaView,
} from "react-native";

const { width } = Dimensions.get("window");

export default function Slides() {
  const slides = [
    {
      id: "1",
      title: "NAVITIME Japan",
      description: "일본 내 길찾기, 교통편 검색에 특화된 최고의 앱",
      image: "https://play-lh.googleusercontent.com/NIzkL7tpgs8QTeRhtHbqlIuFZ9YbPyFWyDQb8JAcQBCYwnzjYOfBfrMC2rW5G4OG-Q=w480-h960-rw",
      link: "https://www.navitime.co.jp/",
    },
    {
      id: "2",
      title: "PayPay",
      description: "일본에서 가장 많이 쓰이는 간편결제 서비스",
      image: "https://play-lh.googleusercontent.com/0I5V52oWbXf0Gd1vC3bSl5IXDylCZTDc4qvdDvdPVxZl8DJx_tGfaHcFDq8v3X85eQ=w480-h960-rw",
      link: "https://paypay.ne.jp/",
    },
    {
      id: "3",
      title: "JR East Pass",
      description: "JR 패스로 일본 전역을 저렴하게 여행하세요!",
      image: "https://japanrailpass.net/img/kv_top_01_sp.jpg",
      link: "https://japanrailpass.net/",
    },
    {
      id: "4",
      title: "Visit Japan Web",
      description: "입국 신고, 세관 절차를 간편하게 온라인으로!",
      image: "https://www.digital.go.jp/assets/contents/node/basic_page/field_ref_resources/8b1f8c49-ecba-49a4-9a4e-d9ce6b727fcf/20230419_mein_02-3x.jpg",
      link: "https://vjw-lp.digital.go.jp/",
    },
  ];

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open link:", err)
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>🌏 일본 여행에 유용한 사이트</Text>
      <FlatList
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => handleOpenLink(item.link)}
          >
            <View style={styles.card}>
              <Image
                source={{ uri: item.image }}
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.overlay}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>바로가기 🔗</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  card: {
    width: width * 0.85,
    height: 250,
    borderRadius: 16,
    overflow: "hidden",
    marginHorizontal: 10,
    backgroundColor: "#eee",
    elevation: 4,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.45)",
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  description: {
    color: "#ddd",
    fontSize: 14,
    marginTop: 4,
    marginBottom: 8,
  },
  button: {
    alignSelf: "flex-start",
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
