import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SettingsScreen from "../screens/settings/SettingsScreen";
import NoticeScreen from "../screens/settings/components/NoticeScreen";
import SupportScreen from "../screens/settings/components/SupportScreen";
import PolicyScreen from "../screens/settings/components/PolicyScreen";
import NoticeDetailScreen from "../screens/settings/components/NoticeDetailScreen";
import ProfileEditScreen from "../screens/settings/ProfileEditScreen";

export type SettingsStackParamList = {
  SettingsScreen: undefined;
  ProfileEditScreen: undefined;
  NoticeScreen: undefined;
  SupportScreen: undefined;
  PolicyScreen: undefined;
  NoticeDetailScreen: undefined | { noticeId: string };
};

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export default function SettingsStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
      headerShown: false, // ✅ 모든 화면의 기본 헤더 비활성화
    }}>
      {/* ✅ 루트 화면 추가 */}
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      
      <Stack.Screen 
        name="NoticeScreen" 
        component={NoticeScreen} 
        // options={{ title: "공지" }} 
      />
      <Stack.Screen
        name="ProfileEditScreen"
        component={ProfileEditScreen}
      />
      <Stack.Screen 
        name="NoticeDetailScreen" 
        component={NoticeDetailScreen} 
        // options={{ title: "서비스 약관" }} 
      />
      <Stack.Screen 
        name="SupportScreen" 
        component={SupportScreen} 
        // options={{ title: "고객센터" }} 
      />
      <Stack.Screen 
        name="PolicyScreen" 
        component={PolicyScreen} 
        // options={{ title: "서비스 약관" }} 
      />
    </Stack.Navigator>
  );
}