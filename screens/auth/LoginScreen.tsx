import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import KakaoLogin from '@/screens/auth/components/KakaoLogin';
import { useAuth } from '@/contexts/AuthContext';


export default function LoginScreen() {
  const { login } = useAuth();

  return (
    <View style={styles.container}>
      <KakaoLogin
        onSuccess={(data) => {
          login({
            user: data.user,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          });
        }}
        onError={(err) => alert(err.message)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
});
