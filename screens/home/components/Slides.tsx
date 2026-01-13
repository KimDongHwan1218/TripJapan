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
  data?: Destination[];
}

// fallback 데이터
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
];

export default function Slides({ data }: Props) {
  const slides = data && data.length > 0 ? data : FALLBACK;

  const CARD_WIDTH = Math.round(width * 0.85);
  const CARD_GAP = 12;

  const handleOpenLink = (url?: string) => {
    if (!url) return;
    Linking.openURL(url).catch(console.error);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={slides}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 8 }}
        snapToInterval={CARD_WIDTH + CARD_GAP}
        decelerationRate="fast"
        renderItem={({ item }) => (
          <View style={{ width: CARD_WIDTH + CARD_GAP }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => handleOpenLink(item.link)}
              style={{ width: CARD_WIDTH }}
            >
              <View style={styles.card}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.image}
                  resizeMode="cover"
                />

                <View style={styles.overlay}>
                  <Text style={styles.title}>{item.title}</Text>
                  {!!item.description && (
                    <Text style={styles.description}>{item.description}</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingBottom: 8,
  },
  header: {
    fontSize: 16,
    fontWeight: "700",
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  card: {
    width: "100%",
    height: 220,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#EEE",
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
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  description: {
    fontSize: 13,
    color: "#ddd",
    marginTop: 4,
  },
});
