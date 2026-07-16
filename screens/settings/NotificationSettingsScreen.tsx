import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Switch } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "@/components/Header/Header";
import { layout, colors, spacing, typography, radius } from "@/styles";
import { useAuth } from "@/contexts/AuthContext";
import { requestNotificationPermission, registerPushToken } from "@/services/notifications";

const STORAGE_KEY = "notification_settings";

type NotifSettings = {
  push: boolean;
  travel: boolean;
  event: boolean;
  community: boolean;
};

const DEFAULT: NotifSettings = {
  push: true,
  travel: true,
  event: false,
  community: true,
};

function NotifRow({
  label,
  description,
  value,
  onValueChange,
}: {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        {description ? <Text style={styles.rowDesc}>{description}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.neutral200, true: colors.primarySoft }}
        thumbColor={value ? colors.primary : colors.neutral500}
      />
    </View>
  );
}

export default function NotificationSettingsScreen() {
  const [settings, setSettings] = useState<NotifSettings>(DEFAULT);
  const { user, accessToken } = useAuth();

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) setSettings(JSON.parse(raw));
    });
  }, []);

  async function update(key: keyof NotifSettings, value: boolean) {
    const next = { ...settings, [key]: value };
    setSettings(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));

    if (key === "push" && value && user && accessToken) {
      const granted = await requestNotificationPermission();
      if (granted) {
        await registerPushToken(user.id, accessToken);
      } else {
        const denied = { ...next, push: false };
        setSettings(denied);
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(denied));
      }
    }
  }

  return (
    <View style={styles.container}>
      <Header backwardButton="simple" title="알림 설정" />

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>전체 알림</Text>
        <View style={styles.panel}>
          <NotifRow
            label="앱 푸시 알림"
            description="모든 알림의 마스터 스위치"
            value={settings.push}
            onValueChange={(v) => update("push", v)}
          />
        </View>

        <Text style={styles.sectionTitle}>알림 종류</Text>
        <View style={styles.panel}>
          <NotifRow
            label="여행 소식 알림"
            description="새로운 여행지, 이벤트 소식"
            value={settings.push && settings.travel}
            onValueChange={(v) => update("travel", v)}
          />
          <View style={styles.divider} />
          <NotifRow
            label="이벤트 / 혜택 알림"
            description="할인, 프로모션 정보"
            value={settings.push && settings.event}
            onValueChange={(v) => update("event", v)}
          />
          <View style={styles.divider} />
          <NotifRow
            label="커뮤니티 알림"
            description="내 게시글 댓글, 좋아요"
            value={settings.push && settings.community}
            onValueChange={(v) => update("community", v)}
          />
        </View>

        {!settings.push && (
          <Text style={styles.disabledNote}>
            앱 푸시 알림이 꺼져 있어 모든 알림이 비활성화됩니다.
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...layout.screen },
  content: { padding: spacing.lg, gap: spacing.xl },

  sectionTitle: {
    ...typography.caption,
    color: colors.textTertiary,
    marginBottom: -spacing.md,
    marginLeft: spacing.xs,
  },

  panel: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: "hidden",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  rowText: { flex: 1, gap: 2 },
  rowLabel: { ...typography.emphasis, color: colors.textPrimary },
  rowDesc: { ...typography.caption, color: colors.textTertiary },

  divider: { height: 1, backgroundColor: colors.divider, marginHorizontal: spacing.lg },

  disabledNote: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: "center",
    marginTop: -spacing.md,
  },
});
