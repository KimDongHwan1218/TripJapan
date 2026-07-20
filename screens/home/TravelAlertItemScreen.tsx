import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HomeStackParamList } from "@/navigation/HomeStackNavigator";
import { layout, colors, spacing } from "@/styles";

type RouteProps = RouteProp<HomeStackParamList, "TravelAlertItem">;

export default function TravelAlertItemScreen() {
  const navigation = useNavigation();
  const { params } = useRoute<RouteProps>();
  const alert = params.alert;
  const insets = useSafeAreaInsets();

  return (
    <View style={[layout.screen, { paddingTop: insets.top }]}>
      {/* Figma: "여행 경보" 가운데 타이틀 + back */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>여행 경보</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Figma: 제목 + 날짜 상단 */}
        <Text style={styles.title}>{alert.title}</Text>
        {alert.date ? <Text style={styles.date}>{alert.date}</Text> : null}
        <View style={styles.divider} />
        {/* Figma: 본문 */}
        <Text style={styles.body}>{alert.content}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    backgroundColor: colors.surface,
  },
  backBtn: { width: 38, alignItems: "flex-start" },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },

  content: {
    padding: 20,
    paddingBottom: 48,
  },

  // Figma: 제목 굵게
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    lineHeight: 26,
    marginBottom: 8,
  },
  date: {
    fontSize: 13,
    color: colors.textTertiary,
    marginBottom: 0,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    marginVertical: 20,
  },
  // Figma: 본문 본문체
  body: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 26,
  },
});
