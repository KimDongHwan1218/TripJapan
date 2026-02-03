import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking } from "react-native";
import Header from "@/components/Header/Header";
import { layout, typography, spacing, colors } from "@/styles";

export default function SupportScreen() {
  return (
    <View style={layout.screen}>
      <Header title="고객센터" backwardButton="simple" />

      <View style={styles.container}>
        <Text style={typography.body}>
          문의 사항이 있으시면 아래로 연락해주세요.
        </Text>

        <TouchableOpacity
          style={styles.item}
          onPress={() => Linking.openURL("mailto:support@yourapp.com")}
        >
          <Text style={styles.label}>이메일</Text>
          <Text style={styles.value}>support@yourapp.com</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => Linking.openURL("tel:01012345678")}
        >
          <Text style={styles.label}>전화</Text>
          <Text style={styles.value}>010-1234-5678</Text>
        </TouchableOpacity>

        <View style={styles.item}>
          <Text style={styles.label}>운영시간</Text>
          <Text style={styles.value}>평일 10:00 ~ 18:00</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
  },
  item: {
    marginTop: spacing.lg,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  value: {
    ...typography.body,
    marginTop: spacing.xs,
  },
});