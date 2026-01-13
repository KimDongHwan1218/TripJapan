import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../contexts/AuthContext";
import { ENV } from "@/config/env";

const API_BASE = ENV.API_BASE_URL;

export default function ProfileEditScreen() {
  const navigation = useNavigation<any>();
  const { user, updateProfile } = useAuth();

  const [nickname, setNickname] = useState(user?.nickname ?? "");
  const [profileImage, setProfileImage] = useState(user?.profile_image ?? undefined);
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // presigned URL 기반 단일 이미지 업로드
  const uploadSingleImage = async (uri: string): Promise<string> => {
    const filename = `profile_${user.profileId}_${Date.now()}.jpg`;

    // presigned url 요청
    const res = await fetch(`${API_BASE}/profiles/upload-url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename }),
    });

    const { url, path } = await res.json();
    if (!url) throw new Error("Presigned URL 생성 실패");

    // uri -> blob
    const file = await fetch(uri);
    const blob = await file.blob();

    // PUT 업로드
    const uploadRes = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "image/jpeg" },
      body: blob,
    });

    if (!uploadRes.ok) throw new Error("이미지 업로드 실패");

    return `https://wwmdmngncknalzfcpejn.supabase.co/storage/v1/object/public/profile-images/${path}`;
  };

  const handlePickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("권한 필요", "사진 접근 권한이 필요합니다.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
      });

      if (result.canceled) return;

      setLoading(true);
      const uri = result.assets[0].uri;
      const uploadedUrl = await uploadSingleImage(uri);

      setProfileImage(uploadedUrl);
    } catch (e) {
      Alert.alert("오류", "이미지 업로드 실패");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      await updateProfile({
        nickname,
        profile_image: profileImage,
      });

      Alert.alert("성공", "프로필이 저장되었습니다.");
      navigation.goBack();
    } catch (e: any) {
      Alert.alert("오류", e.message || "저장 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePickImage} style={styles.imageWrapper}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.avatar} />
        ) : (
          <View style={styles.placeholderImage} />
        )}
        <Text style={styles.changeText}>프로필 이미지 변경</Text>
      </TouchableOpacity>

      <TextInput
        value={nickname}
        onChangeText={setNickname}
        placeholder="닉네임"
        style={styles.input}
      />

      <TouchableOpacity
        onPress={handleSave}
        disabled={loading}
        style={[styles.saveBtn, loading && { opacity: 0.6 }]}
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
