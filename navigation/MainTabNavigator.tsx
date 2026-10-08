import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import Text from "@/components/ui/Text";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import { getFocusedRouteNameFromRoute, type NavigatorScreenParams } from "@react-navigation/native";
import { useDesignContext } from "@/contexts/DesignContext";
import type { SearchStackParamList } from "./SearchStackNavigator";

import HomeStackNavigator from "./HomeStackNavigator";
import CommunityStackNavigator from "./CommunityStackNavigator";
import SettingsStackNavigator from "./SettingsStackNavigator";
import ScheduleStackNavigator from "./ScheduleStackNavigator";
import SearchStackNavigator from "./SearchStackNavigator";

import { colors } from "@/styles";

export type MainTabParamList = {
  홈: undefined;
  일정: undefined;
  타비톡: undefined;
  검색: NavigatorScreenParams<SearchStackParamList>;
  설정: undefined;
};

type TabConfig = {
  name: keyof MainTabParamList;
  component: React.ComponentType<any>;
  iconActive: keyof typeof Ionicons.glyphMap;
  iconInactive: keyof typeof Ionicons.glyphMap;
};

const TABS: TabConfig[] = [
  {
    name: "홈",
    component: HomeStackNavigator,
    iconActive: "home",
    iconInactive: "home-outline",
  },
  {
    name: "일정",
    component: ScheduleStackNavigator,
    iconActive: "calendar",
    iconInactive: "calendar-outline",
  },
  {
    name: "타비톡",
    component: CommunityStackNavigator,
    iconActive: "chatbubbles",
    iconInactive: "chatbubbles-outline",
  },
  {
    name: "검색",
    component: SearchStackNavigator,
    iconActive: "search",
    iconInactive: "search-outline",
  },
  {
    name: "설정",
    component: SettingsStackNavigator,
    iconActive: "settings",
    iconInactive: "settings-outline",
  },
];

const Tab = createBottomTabNavigator<MainTabParamList>();
const TAB_TEST_ID: Record<keyof MainTabParamList, string> = { 홈: "home", 일정: "schedule", 타비톡: "talk", 검색: "search", 설정: "settings" };

// 작성·편집 화면의 "탭바 숨김" 시안(진단 G6): 화면 → 시안 key. 그 화면에서 시안 B(1)를 고르면 탭바를 숨김.
// (화면 쪽에서 useScreenVariant로 같은 key를 등록해 우상단 선택 버튼에 나타나게 함)
export const TABBAR_HIDE_VARIANT: Record<string, string> = {
  PostCreateScreen: "community.postCreate",
  ReviewWrite: "review.write",
  TripEditScreen: "schedule.edit",
};

export default function MainTabs() {
  const insets = useSafeAreaInsets();
  const { selection } = useDesignContext();
  const tabBarStyle = {
    height: 62 + insets.bottom,
    paddingBottom: insets.bottom,
    backgroundColor: colors.surface,
    borderTopWidth: 0,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 12,
  };

  return (
    <>
      <StatusBar style="dark" />

      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.neutral500,
          tabBarLabelStyle: {
            fontSize: 12,
            lineHeight: 16,
            marginTop: 2,
          },
        }}
      >
        {TABS.map(({ name, component, iconActive, iconInactive }) => (
          <Tab.Screen
            key={name}
            name={name}
            component={component}
            options={({ route }) => ({
              // UI 자동화(Maestro)용 고유 ID — 글자 "홈"으로 찾으면 안드로이드 시스템 홈 버튼(접근성 이름 "홈")을 눌러버림
              tabBarButtonTestID: `tab-${TAB_TEST_ID[name]}`,
              tabBarStyle:
                __DEV__ && (selection[TABBAR_HIDE_VARIANT[getFocusedRouteNameFromRoute(route) ?? ""]] ?? 0) >= 1 // B 이후 시안은 전부 탭바 숨김
                  ? { display: "none" as const }
                  : tabBarStyle,
              tabBarIcon: ({ focused, color }) => (
                <Ionicons
                  name={focused ? iconActive : iconInactive}
                  size={24}
                  color={color}
                />
              ),
              tabBarLabel: ({ focused, color }) => (
                <Text
                  style={[
                    styles.label,
                    { color, fontWeight: focused ? "700" : "600" },
                  ]}
                >
                  {name}
                </Text>
              ),
            })}
          />
        ))}
      </Tab.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    lineHeight: 16,
  },
});
