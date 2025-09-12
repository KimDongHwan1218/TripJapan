import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home/HomeScreen';
import MapScreen from '../screens/calendar/MapScreen';
import SchedulingScreen from '../screens/calendar/SchedulingScreen';
import CommunityScreen from '../screens/community/CommunityScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import CommunityStackNavigator from "./CommunityStackNavigator";
import SettingsStackNavigator from './SettingsStackNavigator';

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
      <Tab.Screen name="홈" component={HomeScreen} />
      <Tab.Screen name="지도" component={MapScreen} />
      <Tab.Screen name="일정" component={SchedulingScreen} />
      <Tab.Screen name="커뮤니티" component={CommunityStackNavigator} options={{ title: "커뮤니티" }} />
      <Tab.Screen name="설정" component={SettingsStackNavigator} options={{ title: "설정" }} />
    </Tab.Navigator>
  );
}