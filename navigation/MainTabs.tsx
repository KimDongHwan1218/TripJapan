import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import SchedulingScreen from '../screens/SchedulingScreen';
import CommunityScreen from '../screens/CommunityScreen';
import SettingsScreen from '../screens/SettingsScreen';

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
      <Tab.Screen name="커뮤니티" component={CommunityScreen} />
      <Tab.Screen name="설정" component={SettingsScreen} />
    </Tab.Navigator>
  );
}