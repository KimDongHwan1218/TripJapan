import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home/HomeScreen';
// import MapScreen from '../screens/schedules/MapScreen';
import HomeStackNavigator from "./HomeStackNavigator";
import CommunityStackNavigator from "./CommunityStackNavigator";
import SettingsStackNavigator from './SettingsStackNavigator';
import ScheduleStackNavigator from './ScheduleStackNavigator';
import SearchStackNavigator from './SearchStackNavigator';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          height: 60,
        },
      }}
    >
      <Tab.Screen name="홈" component={HomeStackNavigator} />
      <Tab.Screen name="검색" component={SearchStackNavigator} />
      <Tab.Screen name="일정" component={ScheduleStackNavigator} />
      <Tab.Screen name="커뮤니티" component={CommunityStackNavigator} />
      <Tab.Screen name="설정" component={SettingsStackNavigator} />
    </Tab.Navigator>
  );
}