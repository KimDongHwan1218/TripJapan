import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import type { NavigatorScreenParams } from "@react-navigation/native";
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

export default function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar style="dark" />

      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: 62 + insets.bottom,
            paddingBottom: insets.bottom,
            backgroundColor: "#fff",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            borderTopWidth: 0,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -5 },
            shadowOpacity: 0.04,
            shadowRadius: 6,
            elevation: 12,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.neutral500,
          tabBarLabelStyle: {
            fontSize: 12,
            lineHeight: 14,
            marginTop: 2,
          },
        }}
      >
        {TABS.map(({ name, component, iconActive, iconInactive }) => (
          <Tab.Screen
            key={name}
            name={name}
            component={component}
            options={{
              tabBarIcon: ({ focused, color }) => (
                <Ionicons
                  name={focused ? iconActive : iconInactive}
                  size={22}
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
            }}
          />
        ))}
      </Tab.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    lineHeight: 14,
  },
});
