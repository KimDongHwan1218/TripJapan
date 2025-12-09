import React from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Dimensions, 
  StyleSheet, 
  Linking 
} from 'react-native';

const { width } = Dimensions.get('window');

interface HotelItem {
  name: string;
  stars?: number;
  price: number;
  discount?: number;
  link: string;
}

interface HotelListProps {
  data: HotelItem[];   // 통일된 props
}

export default function HotelList({ data }: HotelListProps) {
  return (
    <View>
      <Text style={styles.title}>🏨 일본 특가 숙소</Text>

      <FlatList
        data={data}
        keyExtractor={(item, idx) => item.name + idx}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.card, { width: width * 0.8, marginRight: 12 }]}>
            
            <Text>
              {item.name} ({item.stars ?? 0}★)
            </Text>

            <Text>{item.price.toLocaleString()} 원 / 1박</Text>

            {item.discount !== undefined && (
              <Text>할인율: {item.discount}%</Text>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={() => Linking.openURL(item.link)}
            >
              <Text style={styles.buttonText}>예약하기</Text>
            </TouchableOpacity>

          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 12,
    marginLeft: 8,
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
    elevation: 3,
  },
  button: {
    marginTop: 12,
    paddingVertical: 10,
    backgroundColor: "#007AFF",
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
