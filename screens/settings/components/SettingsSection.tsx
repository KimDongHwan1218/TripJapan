// screens/settings/components/SettingsSection.tsx
import React from "react";
import { View, Alert, StyleSheet } from "react-native";
import Text from "@/components/ui/Text";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SettingsStackParamList } from "@/navigation/SettingsStackNavigator";
import SettingRow from "./SettingRow";
import { spacing, typography, colors, radius } from "@/styles";
import { useAuth } from "@/contexts/AuthContext";
import { useScreenVariant } from "@/contexts/DesignContext";

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
  const { logout, deleteAccount } = useAuth();
  // 시안 B: 행마다 컬러 아이콘(검색 허브·타비톡과 같은 카테고리 톤) + 로그아웃은 일반 글자(빨강은 탈퇴만, D2)
  const variant = useScreenVariant("settings", ["현재", "컬러 아이콘 행"]);

  const handleDeleteAccount = () => {
    Alert.alert(
      "회원 탈퇴",
      "정말 탈퇴하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "확인",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAccount();

              Alert.alert("탈퇴 완료", "회원 탈퇴가 정상적으로 처리되었습니다.");
            } catch (error) {
              console.error("user delete error:", error);
              Alert.alert("오류", "처리 중 문제가 발생했습니다. 다시 시도해 주세요.");
            }
          },
        },
      ]
    );
  };

  const confirmLogout = () =>
    Alert.alert("로그아웃", "정말 로그아웃 하시겠습니까?", [
      { text: "취소", style: "cancel" },
      { text: "확인", onPress: logout },
    ]);

  if (variant === 1) {
    return (
      <View style={styles.container}>
        <SettingsPanel title="알림">
          <SettingRow icon="notifications" tone="yellow" label="알림 설정" onPress={() => navigation.navigate("NotificationSettingsScreen")} />
        </SettingsPanel>
        <SettingsPanel title="서비스 정보">
          <SettingRow icon="megaphone" tone="blue" label="공지사항" onPress={() => navigation.navigate("NoticeScreen")} />
          <SettingRow icon="document-text" tone="purple" label="약관 및 개인정보 처리방침" onPress={() => navigation.navigate("PolicyScreen")} />
          <SettingRow icon="chatbubble-ellipses" tone="teal" label="고객센터" onPress={() => navigation.navigate("SupportScreen")} />
          <SettingRow icon="call" tone="orange" label="긴급 연락처" onPress={() => navigation.navigate("EmergencyContactsScreen")} />
        </SettingsPanel>
        <SettingsPanel title="계정 관리">
          <SettingRow icon="log-out-outline" label="로그아웃" showChevron={false} onPress={confirmLogout} />
          <SettingRow icon="person-remove-outline" label="회원 탈퇴" danger showChevron={false} onPress={handleDeleteAccount} />
        </SettingsPanel>
      </View>
    );
  }

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
        <SettingRow
          label="회원 탈퇴"
          danger
          onPress={handleDeleteAccount}
        />
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
