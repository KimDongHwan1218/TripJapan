import React from 'react';
import { View, FlatList, TouchableOpacity, Dimensions, StyleSheet, Linking } from "react-native";
import Text from "@/components/ui/Text";
import { colors, radius } from "@/styles";

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
    fontWeight: "700",
    marginVertical: 12,
    marginLeft: 8,
  },
  card: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: radius.md, borderCurve: "continuous",
    elevation: 3,
  },
  route: {
    fontSize: 16,
    fontWeight: "600",
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.info,
    marginVertical: 4,
  },
  date: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  gate: {
    fontSize: 12,
    color: colors.textTertiary,
    marginBottom: 8,
  },
  button: {
    marginTop: 8,
    paddingVertical: 12,
    backgroundColor: colors.info,
    borderRadius: radius.sm, borderCurve: "continuous",
    alignItems: "center",
  },
  buttonText: {
    color: colors.textWhite,
    fontWeight: "700",
  },
});
