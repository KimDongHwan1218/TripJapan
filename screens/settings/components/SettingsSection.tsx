// screens/settings/components/SettingsSection.tsx
import React, { useState } from "react";
import { View, Alert, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SettingsStackParamList } from "@/navigation/SettingsStackNavigator";
import SettingRow from "./SettingRow";
import SettingSwitchRow from "./SettingSwitchRow";
import { spacing, typography, colors, radius } from "@/styles";
import { useAuth } from "@/contexts/AuthContext";

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
  const { logout } = useAuth();

  const [pushEnabled, setPushEnabled] = useState(true);
  const [travelEnabled, setTravelEnabled] = useState(true);
  const [eventEnabled, setEventEnabled] = useState(false);

  return (
    <View style={styles.container}>
      {/* 🔔 알림 */}
      <SettingsPanel title="알림">
        <SettingSwitchRow
          label="앱 푸시 알림"
          value={pushEnabled}
          onValueChange={setPushEnabled}
        />
        <SettingSwitchRow
          label="여행 소식 알림"
          value={travelEnabled}
          onValueChange={setTravelEnabled}
        />
        <SettingSwitchRow
          label="이벤트 / 혜택 알림"
          value={eventEnabled}
          onValueChange={setEventEnabled}
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
        <SettingRow label="회원 탈퇴" danger onPress={() => {}} />
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
