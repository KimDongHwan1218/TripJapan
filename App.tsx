import React, { useEffect, useRef } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import RootStackNavigator from './navigation/RootStackNavigator';
import { TripProvider } from './contexts/TripContext';
import { CommunityProvider } from './contexts/CommunityContext';
import { UIProvider } from './contexts/UIContext';
import { ToastProvider } from './contexts/ToastContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { DesignProvider } from './contexts/DesignContext';
import DesignVariantPicker from './components/DesignVariantPicker';
import { registerPushToken } from './services/notifications';
import ErrorBoundary from './components/ErrorBoundary';

// Pretendard 로딩이 끝날 때까지 스플래시 유지 — 기본 글꼴로 한 번 그려졌다가 바뀌는 깜빡임 방지
SplashScreen.preventAutoHideAsync().catch(() => {});

function AppInner() {
  const { user, accessToken } = useAuth();
  const navigationRef = useRef<NavigationContainerRef<any>>(null);

  // Register push token when user logs in
  useEffect(() => {
    if (user && accessToken) {
      registerPushToken(user.id, accessToken);
    }
  }, [user?.id]);

  // Handle notification tap
  useEffect(() => {
    try {
      const sub = Notifications.addNotificationResponseReceivedListener(() => {
        // navigate to relevant screen based on notification data if needed
      });
      return () => sub.remove();
    } catch {
      // expo-notifications native module not available
    }
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <RootStackNavigator />
      {/* 개발 빌드 전용 — 화면별 디자인 시안 선택(우상단) */}
      <DesignVariantPicker />
    </NavigationContainer>
  );
}

export default function App() {
  // 이름은 styles/typography.ts의 FONT_FAMILY와 같아야 함(components/ui/Text가 이 이름으로 지정)
  const [fontsLoaded, fontError] = useFonts({
    "Pretendard-Regular": require("./assets/fonts/Pretendard-Regular.otf"),
    "Pretendard-Medium": require("./assets/fonts/Pretendard-Medium.otf"),
    "Pretendard-SemiBold": require("./assets/fonts/Pretendard-SemiBold.otf"),
    "Pretendard-Bold": require("./assets/fonts/Pretendard-Bold.otf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded, fontError]);

  // 폰트 로딩 실패 시에도 앱은 띄움(기본 글꼴로 대체)
  if (!fontsLoaded && !fontError) return null;

  return (
    <ErrorBoundary>
      <DesignProvider>
      <SafeAreaProvider>
        <AuthProvider>
          <TripProvider>
            <UIProvider>
              <CommunityProvider>
                <FavoritesProvider>
                  <ToastProvider>
                    <AppInner />
                  </ToastProvider>
                </FavoritesProvider>
              </CommunityProvider>
            </UIProvider>
          </TripProvider>
        </AuthProvider>
      </SafeAreaProvider>
      </DesignProvider>
    </ErrorBoundary>
  );
}
