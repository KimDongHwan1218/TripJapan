import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SettingsScreen from "../screens/settings/SettingsScreen";
import PaymentScreen from "../screens/settings/PaymentScreen";
import ProfileEditScreen from "../screens/settings/ProfileEditScreen";
import NoticeScreen from "../screens/settings/NoticeScreen";
import SupportScreen from "../screens/settings/SupportScreen";
import PolicyScreen from "../screens/settings/PolicyScreen";

export type SettingsStackParamList = {
  SettingsScreen: undefined;
  PaymentScreen: undefined;
  ProfileEditScreen: undefined;
  NoticeScreen: undefined;
  SupportScreen: undefined;
  PolicyScreen: undefined;
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
        name="PaymentScreen" 
        component={PaymentScreen} 
        // options={{ title: "결제" }} 
      />
      <Stack.Screen 
        name="ProfileEditScreen" 
        component={ProfileEditScreen} 
        // options={{ title: "프로필" }} 
      />
      <Stack.Screen 
        name="NoticeScreen" 
        component={NoticeScreen} 
        // options={{ title: "공지" }} 
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