// screens/settings/ProfileEditScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/contexts/AuthContext";
import { ENV } from "@/config/env";
import { layout, typography, spacing, colors } from "@/styles";
import profilePlaceholder from "@/assets/images/profile-placeholder.png";

const API_BASE = ENV.API_BASE_URL;

export default function ProfileEditScreen() {
  const navigation = useNavigation();
  const { user, updateProfile } = useAuth();
  if (!user) return null;

  const [nickname, setNickname] = useState(user.nickname ?? "");
  const [phone, setPhone] = useState(user.phone ?? "");
  const [email, setEmail] = useState(user.email ?? "");
  const [bio, setBio] = useState(user.bio ?? "");
  const [profileImage, setProfileImage] = useState(
    user.profile_image ?? ""
  );
  const [loading, setLoading] = useState(false);

  const uploadImage = async (uri: string) => {
    const filename = `profile_${user.id}_${Date.now()}.jpg`;

    const res = await fetch(`${API_BASE}/profiles/upload-url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename }),
    });

    const { url, path } = await res.json();

    const file = await fetch(uri);
    const blob = await file.blob();

    await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "image/jpeg" },
      body: blob,
    });

    return `https://wwmdmngncknalzfcpejn.supabase.co/storage/v1/object/public/profile-images/${path}`;
  };

  const handlePickImage = async () => {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("권한 필요", "사진 접근 권한이 필요합니다.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (result.canceled) return;

    setLoading(true);
    const uploadedUrl = await uploadImage(result.assets[0].uri);
    setProfileImage(uploadedUrl);
    setLoading(false);
  };

  const handleSave = async () => {
    await updateProfile({
      nickname,
      phone,
      email,
      bio,
      profile_image: profileImage,
    });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={handlePickImage} style={styles.imageBox}>
          <Image
            source={
              profileImage
                ? { uri: profileImage }
                : profilePlaceholder
            }
            style={styles.image}
          />
          <Text style={styles.imageText}>사진 변경</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="닉네임"
          value={nickname}
          onChangeText={setNickname}
        />
        <TextInput
          style={styles.input}
          placeholder="이메일"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="전화번호"
          value={phone}
          onChangeText={setPhone}
        />
        <TextInput
          style={[styles.input, styles.bio]}
          placeholder="소개"
          value={bio}
          onChangeText={setBio}
          multiline
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveText}>저장</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    ...layout.screen,
  },
  content: {
    ...layout.content,
  },
  imageBox: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  image: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.background,
  },
  imageText: {
    marginTop: spacing.sm,
    color: colors.border,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  bio: {
    height: 80,
  },
  saveButton: {
    marginTop: spacing.xl,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 8,
  },
  saveText: {
    color: colors.textWhite,
    textAlign: "center",
    ...typography.subtitle,
  },
});
