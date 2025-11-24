import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AuthStack';
import KakaoLogin from '@/screens/auth/components/KakaoLogin';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <KakaoLogin
        onSuccess={() => navigation.replace('MainTabs')}
        onError={() => alert('로그인 실패')}
      />

      <View style={styles.skipContainer}>
        <Button
          title="로그인 없이 계속하기"
          onPress={() => navigation.replace('MainTabs')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20,
  },
  skipContainer: {
    marginTop: 40, // KakaoLogin 버튼 아래에 충분한 공간
    width: '80%',
  },
});
