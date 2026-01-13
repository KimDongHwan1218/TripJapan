import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import HomeStackNavigator from "./HomeStackNavigator";
import CommunityStackNavigator from "./CommunityStackNavigator";
import SettingsStackNavigator from './SettingsStackNavigator';
import ScheduleStackNavigator from './ScheduleStackNavigator';
import SearchStackNavigator from './SearchStackNavigator';
import { StatusBar } from "expo-status-bar";

export type MainTabParamList = {
  홈: undefined;
  검색: { id?: string } | undefined;
  일정: undefined;
  커뮤니티: undefined;
  설정: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar style="dark" translucent={false} />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: true,

          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            switch (route.name) {
              case "홈":
                iconName = focused ? "home" : "home-outline";
                break;
              case "검색":
                iconName = focused ? "search" : "search-outline";
                break;
              case "일정":
                iconName = focused ? "calendar" : "calendar-outline";
                break;
              case "커뮤니티":
                iconName = focused ? "people" : "people-outline";
                break;
              case "설정":
                iconName = focused ? "settings" : "settings-outline";
                break;
              default:
                iconName = "ellipse";
            }

            return <Ionicons name={iconName} size={22} color={color} />;
          },

          tabBarActiveTintColor: "#007AFF",
          tabBarInactiveTintColor: "#999",

          tabBarStyle: {
            height: 56 + insets.bottom,
            paddingBottom: insets.bottom,
          },
          tabBarItemStyle: {
            paddingVertical: 4,
          },
          tabBarLabelStyle: {
            fontSize: 11,
          },
        })}
      >
        <Tab.Screen name="홈" component={HomeStackNavigator} />
        <Tab.Screen name="검색" component={SearchStackNavigator} />
        <Tab.Screen name="일정" component={ScheduleStackNavigator} />
        <Tab.Screen name="커뮤니티" component={CommunityStackNavigator} />
        <Tab.Screen name="설정" component={SettingsStackNavigator} />
      </Tab.Navigator>
    </>
  );
}
