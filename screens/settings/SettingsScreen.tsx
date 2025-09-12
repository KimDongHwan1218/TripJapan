// app/(main)/SettingScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Switch, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SettingScreen() {
  const navigation = useNavigation<any>();
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);

  const handleProfilePress = () => {
    navigation.navigate('ProfileEditScreen');
  };

  const handlePress = (route: string) => {
    navigation.navigate(route);
  };

  const confirmAction = (title: string, message: string) => {
    Alert.alert(
      title,
      message,
      [
        { text: '취소', style: 'cancel' },
        { text: '확인', onPress: () => console.log(`${title} confirmed`) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* 프로필 카드 */}
      <TouchableOpacity style={styles.profileCard} onPress={handleProfilePress}>
        <View>
          <View style={styles.nameRow}>
            <Text style={styles.name}>홍길동</Text>
            <Text style={styles.userId}> @hong123</Text>
          </View>
          <Text style={styles.editText}>프로필 편집 &gt;</Text>
        </View>
        <Image
          source={{ uri: 'https://i.pravatar.cc/150?img=20' }}
          style={styles.avatar}
        />
      </TouchableOpacity>

      {/* 설정 항목 */}
      <View style={styles.settingsContainer}>
        {/* 결제방법 */}
        <TouchableOpacity
          style={styles.settingRow}
          activeOpacity={0.6}
          onPress={() => handlePress('PaymentScreen')}
        >
          <Text style={styles.itemText}>결제방법 등록하기</Text>
          <Text style={styles.arrow}>&gt;</Text>
        </TouchableOpacity>

        {/* 알림설정 */}
        <View style={styles.settingRow}>
          <Text style={styles.itemText}>알림 설정하기</Text>
          <Switch
            value={isNotificationEnabled}
            onValueChange={setIsNotificationEnabled}
          />
        </View>

        {/* 버전정보 */}
        <View style={styles.settingRow}>
          <Text style={styles.itemText}>버전 정보</Text>
          <Text style={styles.version}>v1.0.0</Text>
        </View>

        {/* 공지사항 */}
        <TouchableOpacity
          style={styles.settingRow}
          activeOpacity={0.6}
          onPress={() => handlePress('NoticeScreen')}
        >
          <Text style={styles.itemText}>공지사항</Text>
          <Text style={styles.arrow}>&gt;</Text>
        </TouchableOpacity>

        {/* 서비스 약관 */}
        <TouchableOpacity
          style={styles.settingRow}
          activeOpacity={0.6}
          onPress={() => handlePress('PolicyScreen')}
        >
          <Text style={styles.itemText}>서비스 및 개인정보 처리 약관</Text>
          <Text style={styles.arrow}>&gt;</Text>
        </TouchableOpacity>

        {/* 고객센터 */}
        <TouchableOpacity
          style={styles.settingRow}
          activeOpacity={0.6}
          onPress={() => handlePress('SupportScreen')}
        >
          <Text style={styles.itemText}>고객센터</Text>
          <Text style={styles.arrow}>&gt;</Text>
        </TouchableOpacity>
      </View>

      {/* 로그아웃 / 탈퇴 */}
      <View style={styles.bottomActions}>
        <TouchableOpacity onPress={() => confirmAction('로그아웃', '정말 로그아웃 하시겠습니까?')}>
          <Text style={styles.bottomText}>로그아웃</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => confirmAction('탈퇴', '정말 탈퇴하시겠습니까?')}>
          <Text style={styles.bottomText}>탈퇴</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  profileCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    height: '30%',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  nameRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 6 },
  name: { fontSize: 24, fontWeight: 'bold' },
  userId: { fontSize: 14, color: 'gray', marginLeft: 6 },
  editText: { fontSize: 14, color: 'gray' },
  avatar: { width: 80, height: 80, borderRadius: 40 },

  settingsContainer: { flex: 1, paddingHorizontal: 10, marginTop: 10 },

  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  itemText: { fontSize: 16 },
  arrow: { fontSize: 18, color: 'gray' },
  version: { fontSize: 14, color: 'gray' },

  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#f1f1f1',
  },
  bottomText: { fontSize: 14, color: 'red' },
});
