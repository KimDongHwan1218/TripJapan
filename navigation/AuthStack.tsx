import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import LoginScreen from '../screens/auth/LoginScreen';
import MainTabs from './MainTabNavigator';

export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;

export default function RootStack() {
  const [initialRoute, setInitialRoute] = useState<'Login' | 'MainTabs' | null>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const refreshToken = await AsyncStorage.getItem('refreshToken');

        if (!token) {
          setInitialRoute('Login');
          return;
        }

        const response = await axios.post(`${BACKEND_URL}/auth/verify`, { token, refreshToken });

        if (response.data.valid) {
          if (response.data.token && response.data.token !== token) {
            // 🔹 새 액세스 토큰이 발급됨
            await AsyncStorage.setItem('authToken', response.data.token);
          }
          setInitialRoute('MainTabs');
        } else {
          await AsyncStorage.removeItem('authToken');
          await AsyncStorage.removeItem('refreshToken');
          setInitialRoute('Login');
        }
      } catch (error) {
        console.error('토큰 검증 오류:', error);
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('refreshToken');
        setInitialRoute('Login');
      }
    };

    checkLoginStatus();
  }, []);

  if (initialRoute === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  );
}
