import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Switch, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../contexts/AuthContext";

export default function SettingScreen() {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("로그아웃", "정말 로그아웃 하시겠습니까?", [
      { text: "취소", style: "cancel" },
      { text: "확인", onPress: () => logout() },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert("탈퇴", "정말 탈퇴하시겠습니까?", [
      { text: "취소", style: "cancel" },
      { text: "확인", onPress: () => console.log("탈퇴 로직 필요") },
    ]);
  };

  const handleProfilePress = () => {
    navigation.navigate("ProfileEditScreen");
  };

  const confirmAction = (title: string, message: string) => {
    Alert.alert(title, message, [
      { text: "취소", style: "cancel" },
      { text: "확인", onPress: () => console.log(`${title} confirmed`) },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* 프로필 카드 */}
      <TouchableOpacity style={styles.profileCard} onPress={handleProfilePress}>
        <View>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{user?.nickname ?? "유저"}</Text>
            <Text style={styles.userId}> @{user?.id}</Text>
          </View>
          <Text style={styles.editText}>프로필 편집 &gt;</Text>
        </View>

        <Image
          source={{
            uri: user?.profile_image
              ? user.profile_image
              : "https://i.pravatar.cc/150?img=55",
          }}
          style={styles.avatar}
        />
      </TouchableOpacity>

      <View style={styles.settingsContainer}>
        <TouchableOpacity
          style={styles.settingRow}
          activeOpacity={0.6}
          onPress={() => navigation.navigate("PaymentScreen")}
        >
          <Text style={styles.itemText}>결제방법 등록하기</Text>
          <Text style={styles.arrow}>&gt;</Text>
        </TouchableOpacity>

        <View style={styles.settingRow}>
          <Text style={styles.itemText}>알림 설정하기</Text>
          <Switch value={true} onValueChange={() => {}} />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.itemText}>버전 정보</Text>
          <Text style={styles.version}>v1.0.0</Text>
        </View>

        <TouchableOpacity
          style={styles.settingRow}
          activeOpacity={0.6}
          onPress={() => navigation.navigate("NoticeScreen")}
        >
          <Text style={styles.itemText}>공지사항</Text>
          <Text style={styles.arrow}>&gt;</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingRow}
          activeOpacity={0.6}
          onPress={() => navigation.navigate("PolicyScreen")}
        >
          <Text style={styles.itemText}>서비스 및 개인정보 처리 약관</Text>
          <Text style={styles.arrow}>&gt;</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingRow}
          activeOpacity={0.6}
          onPress={() => navigation.navigate("SupportScreen")}
        >
          <Text style={styles.itemText}>고객센터</Text>
          <Text style={styles.arrow}>&gt;</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomActions}>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.bottomText}>로그아웃</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDeleteAccount}>
          <Text style={styles.bottomText}>탈퇴</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  profileCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    height: 120,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  nameRow: { flexDirection: "row", alignItems: "baseline", marginBottom: 6 },
  name: { fontSize: 24, fontWeight: "bold" },
  userId: { fontSize: 14, color: "gray", marginLeft: 6 },
  editText: { fontSize: 14, color: "gray" },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  settingsContainer: { flex: 1, paddingHorizontal: 10, marginTop: 10 },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 40,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  itemText: { fontSize: 16 },
  arrow: { fontSize: 18, color: "gray" },
  version: { fontSize: 14, color: "gray" },
  bottomActions: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#f1f1f1",
  },
  bottomText: { fontSize: 14, color: "red" },
});
