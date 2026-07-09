import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from '@/contexts/AuthContext';
import RootStackNavigator from './navigation/RootStackNavigator';
import { TripProvider } from './contexts/TripContext';
import { CommunityProvider } from './contexts/CommunityContext';
import { UIProvider } from './contexts/UIContext';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <TripProvider>
          <UIProvider>
            <CommunityProvider>
              <NavigationContainer>
                <RootStackNavigator />
              </NavigationContainer>
            </CommunityProvider>
          </UIProvider>
        </TripProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
