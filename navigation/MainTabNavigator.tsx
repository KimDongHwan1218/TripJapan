import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";

import type { NavigatorScreenParams } from "@react-navigation/native";
import type { SearchStackParamList } from "./SearchStackNavigator";

import HomeStackNavigator from "./HomeStackNavigator";
import CommunityStackNavigator from "./CommunityStackNavigator";
import SettingsStackNavigator from "./SettingsStackNavigator";
import ScheduleStackNavigator from "./ScheduleStackNavigator";
import SearchStackNavigator from "./SearchStackNavigator";

import HomeIcon from "@/assets/icons/home.png";
import SearchIcon from "@/assets/icons/검색.png";
import CalendarIcon from "@/assets/icons/스케쥴.png";
import CommunityIcon from "@/assets/icons/커뮤니티.png";
import SettingsIcon from "@/assets/icons/설정.png";

import { spacing, typography, colors } from "@/styles";

/**
 * 🔥 1️⃣ 반드시 export 해야 다른 파일에서 import 가능
 */
export type MainTabParamList = {
  홈: undefined;
  검색: NavigatorScreenParams<SearchStackParamList>;
  일정: undefined;
  커뮤니티: undefined;
  설정: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

/**
 * 🔥 2️⃣ 타입 안정성 확보용 탭 설정 배열
 */
const tabs: {
  name: keyof MainTabParamList;
  component: React.ComponentType<any>;
  icon: any;
}[] = [
  { name: "홈", component: HomeStackNavigator, icon: HomeIcon },
  { name: "검색", component: SearchStackNavigator, icon: SearchIcon },
  { name: "일정", component: ScheduleStackNavigator, icon: CalendarIcon },
  { name: "커뮤니티", component: CommunityStackNavigator, icon: CommunityIcon },
  { name: "설정", component: SettingsStackNavigator, icon: SettingsIcon },
];

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
          },
        }}
      >
        {tabs.map(({ name, component, icon }) => (
          <Tab.Screen
            key={name}
            name={name}
            component={component}
            options={{
              tabBarButton: (props) => {
                const { accessibilityState, onPress } = props;
                const focused = accessibilityState?.selected;

                return (
                  <Pressable
                    onPress={onPress}
                    style={styles.buttonContainer}
                  >
                    <View
                      style={[
                        styles.innerContainer,
                        focused && styles.focusedBackground,
                      ]}
                    >
                      <Image
                        source={icon}
                        style={styles.icon}
                      />
                      <Text
                        style={[
                          styles.label,
                          focused && styles.focusedLabel,
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
  buttonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  innerContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },

  focusedBackground: {
    backgroundColor: colors.focused,
    opacity: 0.5,
  },

  icon: {
    width: 30,
    height: 30,
    marginBottom: 5,
    resizeMode: "contain",
  },

  label: {
    ...typography.navigation,
  },

  focusedLabel: {
    color: "#007AFF",
    fontWeight: "600",
  },
});
