import React, { useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/contexts/AuthContext";
import { uploadProfileImage } from "./hooks/useProfileUpload";
import ProfileEditScreenView from "./ProfileEditScreen.view";

export default function ProfileEditScreenContainer() {
  const navigation = useNavigation();
  const { user, updateProfile } = useAuth();
  if (!user) return null;

  const [nickname, setNickname] = useState(user.nickname ?? "");
  const [phone, setPhone] = useState(user.phone ?? "");
  const [email, setEmail] = useState(user.email ?? "");
  const [bio, setBio] = useState(user.bio ?? "");
  const [profileImage, setProfileImage] = useState(user.profile_image ?? "");
  const [loading, setLoading] = useState(false);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
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
    try {
      const uploadedUrl = await uploadProfileImage(Number(user.id), result.assets[0].uri);
      setProfileImage(uploadedUrl);
    } catch {
      Alert.alert("업로드 실패", "이미지를 업로드하지 못했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    await updateProfile({ nickname, phone, email, bio, profile_image: profileImage });
    navigation.goBack();
  };

  return (
    <ProfileEditScreenView
      nickname={nickname}
      phone={phone}
      email={email}
      bio={bio}
      profileImage={profileImage}
      loading={loading}
      onChangeNickname={setNickname}
      onChangePhone={setPhone}
      onChangeEmail={setEmail}
      onChangeBio={setBio}
      onPickImage={handlePickImage}
      onSave={handleSave}
    />
  );
}
