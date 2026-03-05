import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "@/components/Header/Header";
import { layout, typography, spacing } from "@/styles";
import { RouteProp, useRoute } from "@react-navigation/native";
import { SettingsStackParamList } from "@/navigation/SettingsStackNavigator";

type RouteProps = RouteProp<
  SettingsStackParamList,
  "NoticeDetailScreen"
>;

type NoticeDetail = {
  title: string;
  content: string;
  createdAt: string;
};

export default function NoticeDetailScreen() {
  const { params } = useRoute<RouteProps>();
  const { noticeId } = params;

  const [notice, setNotice] = useState<NoticeDetail | null>(null);

  useEffect(() => {
    // GET /notices/:noticeId
    // setNotice(response.data)
  }, [noticeId]);

  if (!notice) return null;

  return (
    <View style={layout.screen}>
      <Header title="공지사항" backwardButton="simple" />

      <View style={styles.container}>
        <Text style={typography.title}>{notice.title}</Text>
        <Text style={styles.date}>{notice.createdAt}</Text>
        <Text style={typography.body}>{notice.content}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
  },
  date: {
    marginVertical: spacing.sm,
    ...typography.caption,
  },
});