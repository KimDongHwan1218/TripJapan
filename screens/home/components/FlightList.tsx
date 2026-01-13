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

interface FlightItem {
  origin: string;
  destination: string;
  value?: number;
  depart_date?: string;
  return_date?: string;
  gate?: string;
  link?: string;
}

interface FlightListProps {
  data: FlightItem[];   // 통일된 props 이름
}

export default function FlightList({ data }: FlightListProps) {
  return (
    <View>
      <FlatList
        data={data}
        keyExtractor={(item, idx) => item.origin + item.destination + idx}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.card, { width: width * 0.8, marginRight: 12 }]}>
            
            <Text style={styles.route}>
              {item.origin} → {item.destination}
            </Text>

            <Text style={styles.price}>
              {item.value?.toLocaleString() ?? "-"}원
            </Text>

            <Text style={styles.date}>
              출발: {item.depart_date || '-'} / 귀국: {item.return_date || '-'}
            </Text>

            <Text style={styles.gate}>
              예약처: {item.gate ?? "-"}
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => Linking.openURL(item.link ?? 'https://www.aviasales.com')}
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
  route: {
    fontSize: 16,
    fontWeight: "600",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
    marginVertical: 4,
  },
  date: {
    fontSize: 14,
    color: "#555",
  },
  gate: {
    fontSize: 13,
    color: "#777",
    marginBottom: 8,
  },
  button: {
    marginTop: 8,
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
