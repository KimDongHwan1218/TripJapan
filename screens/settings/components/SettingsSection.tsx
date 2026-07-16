// screens/settings/components/SettingsSection.tsx
import React from "react";
import { View, Alert, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SettingsStackParamList } from "@/navigation/SettingsStackNavigator";
import SettingRow from "./SettingRow";
import { spacing, typography, colors, radius } from "@/styles";
import { useAuth } from "@/contexts/AuthContext";
import { ENV } from "@/config/env";

type NavProp = NativeStackNavigationProp<
  SettingsStackParamList,
  "SettingsScreen"
>;

function SettingsPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.panelWrapper}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.panel}>{children}</View>
    </View>
  );
}

export default function SettingsSection() {
  const navigation = useNavigation<NavProp>();
  const { user, accessToken, logout } = useAuth();

  const handleDeleteAccount = () => {
    Alert.alert(
      "회원 탈퇴",
      "정말 탈퇴하시겠습니까?\n탈퇴 후 모든 데이터가 삭제됩니다.",
      [
        { text: "취소", style: "cancel" },
        {
          text: "탈퇴",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await fetch(`${ENV.API_BASE_URL}/users/${user!.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${accessToken}` },
              });
              if (!res.ok) throw new Error();
              await logout();
            } catch {
              Alert.alert("오류", "회원 탈퇴 중 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* 🔔 알림 */}
      <SettingsPanel title="알림">
        <SettingRow
          label="알림 설정"
          onPress={() => navigation.navigate("NotificationSettingsScreen")}
        />
      </SettingsPanel>

      {/* 📄 서비스 정보 */}
      <SettingsPanel title="서비스 정보">
        <SettingRow
          label="공지사항"
          onPress={() => navigation.navigate("NoticeScreen")}
        />
        <SettingRow
          label="약관 및 개인정보 처리방침"
          onPress={() => navigation.navigate("PolicyScreen")}
        />
        <SettingRow
          label="고객센터"
          onPress={() => navigation.navigate("SupportScreen")}
        />
        <SettingRow
          label="긴급 연락처"
          onPress={() => navigation.navigate("EmergencyContactsScreen")}
        />
      </SettingsPanel>

      {/* 👤 계정 관리 */}
      <SettingsPanel title="계정 관리">
        <SettingRow
          label="로그아웃"
          danger
          onPress={() =>
            Alert.alert("로그아웃", "정말 로그아웃 하시겠습니까?", [
              { text: "취소", style: "cancel" },
              { text: "확인", onPress: logout },
            ])
          }
        />
        <SettingRow label="회원 탈퇴" danger onPress={handleDeleteAccount} />
      </SettingsPanel>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  panelWrapper: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    marginLeft: spacing.sm,
  },
  panel: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: "hidden",
  },
});
