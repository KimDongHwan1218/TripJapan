import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import Header from "@/components/Header/Header";
import { layout, typography, spacing, colors } from "@/styles";
import { RouteProp, useRoute } from "@react-navigation/native";
import { SettingsStackParamList } from "@/navigation/SettingsStackNavigator";
import { ENV } from "@/config/env";

type RouteProps = RouteProp<SettingsStackParamList, "NoticeDetailScreen">;

export default function NoticeDetailScreen() {
  const { params } = useRoute<RouteProps>();
  const { notice } = params;

  const [content, setContent] = useState(notice.content ?? "");
  const [loading, setLoading] = useState(!notice.content);

  useEffect(() => {
    if (notice.content) return;
    (async () => {
      try {
        const res = await fetch(`${ENV.API_BASE_URL}/notices/${notice.id}`);
        if (res.ok) {
          const data = await res.json();
          setContent(data.content ?? "내용을 불러올 수 없습니다.");
        } else {
          setContent("내용을 불러올 수 없습니다.");
        }
      } catch {
        setContent("내용을 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, [notice.id, notice.content]);

  return (
    <View style={layout.screen}>
      <Header title="공지사항" backwardButton="simple" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{notice.title}</Text>
        {notice.createdAt ? (
          <Text style={styles.date}>
            {new Date(notice.createdAt).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        ) : null}
        <View style={styles.divider} />
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <Text style={styles.body}>{content}</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: 48,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    lineHeight: 26,
  },
  date: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    marginVertical: spacing.lg,
  },
  body: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 24,
  },
});
