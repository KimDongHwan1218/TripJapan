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

export interface Destination {
  id: string;
  title: string;
  description?: string;
  image?: string;
  link?: string;
}

interface Props {
  data?: Destination[]; // 외부에서 주입되는 data (권장)
}

const FALLBACK: Destination[] = [
  {
    id: "1",
    title: "NAVITIME Japan",
    description: "일본 내 길찾기, 교통편 검색에 특화된 최고의 앱",
    image:
      "https://play-lh.googleusercontent.com/NIzkL7tpgs8QTeRhtHbqlIuFZ9YbPyFWyDQb8JAcQBCYwnzjYOfBfrMC2rW5G4OG-Q=w480-h960-rw",
    link: "https://www.navitime.co.jp/",
  },
  {
    id: "2",
    title: "PayPay",
    description: "일본에서 가장 많이 쓰이는 간편결제 서비스",
    image:
      "https://play-lh.googleusercontent.com/0I5V52oWbXf0Gd1vC3bSl5IXDylCZTDc4qvdDvdPVxZl8DJx_tGfaHcFDq8v3X85eQ=w480-h960-rw",
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
    image:
      "https://www.digital.go.jp/assets/contents/node/basic_page/field_ref_resources/8b1f8c49-ecba-49a4-9a4e-d9ce6b727fcf/20230419_mein_02-3x.jpg",
    link: "https://vjw-lp.digital.go.jp/",
  },
];

export default function Slides({ data }: Props) {
  const slides = data && data.length > 0 ? data : FALLBACK;

  const handleOpenLink = (url?: string) => {
    if (!url) return;
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
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.image} />
              ) : (
                <View style={[styles.image, styles.imageFallback]} />
              )}

              <View style={styles.overlay}>
                <Text style={styles.title}>{item.title}</Text>
                {!!item.description && (
                  <Text style={styles.description}>{item.description}</Text>
                )}
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
    // 뷰에서 이미 paddingHorizontal을 주는 경우 간격 조정 필요
    backgroundColor: "#fff",
    paddingVertical: 8,
  },
  header: {
    fontSize: 16,
    fontWeight: "700",
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  card: {
    width: width * 0.85,
    height: 220,
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 8,
    backgroundColor: "#eee",
    elevation: 4,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageFallback: {
    backgroundColor: "#ddd",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.45)",
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  description: {
    color: "#ddd",
    fontSize: 13,
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
    fontWeight: "700",
    fontSize: 13,
  },
});
