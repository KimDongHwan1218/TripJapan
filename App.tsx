import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from '@/contexts/AuthContext';
import RootStack from './navigation/AuthStack';
import { TripProvider } from './contexts/TripContext';
import { CommunityProvider } from './contexts/CommunityContext';

export default function App() {
  return (
    <AuthProvider>
      <TripProvider>
        <CommunityProvider>
          <NavigationContainer>
            <RootStack />
          </NavigationContainer>
        </CommunityProvider>
      </TripProvider>
    </AuthProvider>
  );
}
