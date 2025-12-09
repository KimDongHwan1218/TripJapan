// app/(main)/ProfileEditScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../contexts/AuthContext";

const API_BASE = "https://tavi-server.onrender.com";

export default function ProfileEditScreen() {
  const navigation = useNavigation<any>();
  const { user, login } = useAuth();

  const [nickname, setNickname] = useState(user?.nickname ?? "");
  const [profileImage, setProfileImage] = useState(user?.profile_image ?? null);
  const [loading, setLoading] = useState(false);

  console.log('AuthStack user:', user?.id);

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  /* ============================================================
     📌 presigned URL 방식의 "단일 이미지 업로드" 함수
  ============================================================ */
  const uploadSingleImage = async (uri: string): Promise<string> => {
    
    const filename = `profile_${user.id}_${Date.now()}.jpg`;

    // ---- 1) Presigned URL 요청 ----
    const res = await fetch(`${API_BASE}/profiles/upload-url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename }),
    });

    const { url, path } = await res.json();
    if (!url) throw new Error("Presigned URL 생성 실패");

    // ---- 2) uri → blob ----
    const file = await fetch(uri);
    const blob = await file.blob();

    // ---- 3) PUT 업로드 ----
    const uploadRes = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "image/jpeg" },
      body: blob,
    });
    if (!uploadRes.ok) throw new Error("이미지 업로드 실패");

    // ---- 4) Supabase public URL 생성 ----
    const publicUrl = `https://wwmdmngncknalzfcpejn.supabase.co/storage/v1/object/public/profile-images/${path}`;
    return publicUrl;
  };

  /* ============================================================
     📌 이미지 선택 (PostCreateScreen 방식 동일)
  ============================================================ */
  const handlePickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        return Alert.alert("권한 필요", "사진 접근 권한이 필요합니다.");
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
      });

      if (result.canceled) return;

      const uri = result.assets[0].uri;

      // presigned 방식 업로드
      setLoading(true);
      const uploadedUrl = await uploadSingleImage(uri);

      setProfileImage(uploadedUrl);
      Alert.alert("완료", "프로필 이미지가 변경되었습니다!");
    } catch (err) {
      console.error(err);
      Alert.alert("오류", "이미지 선택 또는 업로드 실패");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = () => {
    setProfileImage(null);
  };

  /* ============================================================
     📌 닉네임 유효성 검사 (기본)
  ============================================================ */
  const validateNickname = (name: string) => {
    const regex = /^[a-zA-Z0-9가-힣]{2,12}$/;
    return regex.test(name);
  };

  /* ============================================================
     📌 닉네임 중복 체크
  ============================================================ */
  const checkNicknameDuplicate = async (name: string) => {
    const res = await fetch(`${API_BASE}/profiles/check-nickname/${name}`);
    const json = await res.json();
    return json.duplicate;
  };

  /* ============================================================
     📌 백엔드 업데이트
  ============================================================ */
  const handleSaveBackend = async () => {
    const body = {
      nickname: nickname,
      profile_image: profileImage,
    };

    const res = await fetch(`${API_BASE}/profiles/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await res.json();
    if (!res.ok) throw new Error("프로필 저장 실패");

    return json.profile;
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      if (!validateNickname(nickname)) {
        Alert.alert("오류", "닉네임은 2~12자, 특수문자 불가입니다.");
        return;
      }

      const duplicate = await checkNicknameDuplicate(nickname);
      if (duplicate && nickname !== user.nickname) {
        Alert.alert("오류", "이미 사용 중인 닉네임입니다.");
        return;
      }

      const updated = await handleSaveBackend();

      await login({ ...user, ...updated });

      Alert.alert("성공", "프로필이 저장되었습니다.");
      navigation.goBack();
    } catch (err: any) {
      console.error(err);
      Alert.alert("오류", err.message || "프로필 저장 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 이미지 */}
      <TouchableOpacity onPress={handlePickImage} style={styles.imageWrapper}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.avatar} />
        ) : (
          <View style={styles.placeholderImage} />
        )}
        <Text style={styles.changeText}>프로필 이미지 변경</Text>
      </TouchableOpacity>

      {/* 이미지 삭제 */}
      {profileImage && (
        <TouchableOpacity onPress={handleDeleteImage}>
          <Text style={{ color: "red", marginBottom: 20 }}>이미지 삭제</Text>
        </TouchableOpacity>
      )}

      {/* 닉네임 */}
      <TextInput
        value={nickname}
        onChangeText={setNickname}
        placeholder="닉네임"
        style={styles.input}
      />

      {/* 저장 버튼 */}
      <TouchableOpacity
        onPress={handleSave}
        style={[styles.saveBtn, loading && { opacity: 0.6 }]}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveText}>저장하기</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

/* ============================================================
   Styles
============================================================ */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageWrapper: {
    alignItems: "center",
    marginBottom: 10,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ddd",
    marginBottom: 10,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  changeText: { color: "gray" },
  input: {
    width: "80%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginVertical: 20,
  },
  saveBtn: {
    backgroundColor: "#007bff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  saveText: { color: "#fff", fontSize: 16 },
});
