import React, { useEffect, useRef } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import RootStackNavigator from './navigation/RootStackNavigator';
import { TripProvider } from './contexts/TripContext';
import { CommunityProvider } from './contexts/CommunityContext';
import { UIProvider } from './contexts/UIContext';
import { ToastProvider } from './contexts/ToastContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { registerPushToken } from './services/notifications';
import ErrorBoundary from './components/ErrorBoundary';

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
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}
