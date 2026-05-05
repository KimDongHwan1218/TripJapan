import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
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
        }}
      >
        {TABS.map(({ name, component, iconActive, iconInactive }) => (
          <Tab.Screen
            key={name}
            name={name}
            component={component}
            options={{
              tabBarButton: (props) => {
                const focused = props.accessibilityState?.selected ?? false;

                return (
                  <Pressable
                    onPress={props.onPress}
                    style={styles.btn}
                    android_ripple={{ color: "transparent" }}
                  >
                    <View style={styles.tabItem}>
                      <Ionicons
                        name={focused ? iconActive : iconInactive}
                        size={22}
                        color={focused ? colors.primary : colors.neutral500}
                      />
                      <Text
                        style={[
                          styles.label,
                          {
                            color: focused ? colors.primary : colors.neutral500,
                            fontWeight: focused ? "700" : "600",
                          },
                        ]}
                      >
                        {name}
                      </Text>
                    </View>
                  </Pressable>
                );
              },
            }}
          />
        ))}
      </Tab.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingTop: 10,
  },
  label: {
    fontSize: 12,
    lineHeight: 14,
  },
});
