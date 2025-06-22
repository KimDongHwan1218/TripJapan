import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './LoginScreen';
import LoadingScreen from './LoadingScreen';
import SignupScreen from './SignupScreen';
import HomeScreen from './(HomeTab)';
import BookingScreen from './(HomeTab)/BookingScreen';
import CommunityScreen from './(HomeTab)/CommunityScreen';
import SettingsScreen from './(HomeTab)/SettingsScreen';
import TravelHomeScreen from './(TravelTab)';
import MapScreen from './(TravelTab)/MapScreen';
import TaxiPaymentScreen from './(TravelTab)/TaxiPaymentScreen';
import ShoppingScreen from './(TravelTab)/ShoppingScreen';
import ScheduleScreen from './(TravelTab)/ScheduleScreen';
import PaymentScreen from './(TravelTab)/PaymentScreen';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* <Stack.Screen name="LoadingScreen" options={{ headerShown: false }} />
        <Stack.Screen name="LoginScreen" options={{ headerShown: false }} />
        <Stack.Screen name="SignupScreen" options={{ headerShown: false }} /> */}
        <Stack.Screen name="(HomeTab)" options={{ headerShown: true }} />
        <Stack.Screen name="(TravelTab)" options={{ headerShown: true }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
