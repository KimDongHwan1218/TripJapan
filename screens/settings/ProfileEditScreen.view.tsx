import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import Header from "@/components/Header/Header";
import { layout, typography, spacing, colors } from "@/styles";
import profilePlaceholder from "@/assets/images/profile-placeholder.png";

type Props = {
  nickname: string;
  phone: string;
  email: string;
  bio: string;
  profileImage: string;
  loading: boolean;
  onChangeNickname: (v: string) => void;
  onChangePhone: (v: string) => void;
  onChangeEmail: (v: string) => void;
  onChangeBio: (v: string) => void;
  onPickImage: () => void;
  onSave: () => void;
};

export default function ProfileEditScreenView({
  nickname, phone, email, bio, profileImage, loading,
  onChangeNickname, onChangePhone, onChangeEmail, onChangeBio,
  onPickImage, onSave,
}: Props) {
  return (
    <View style={styles.container}>
      <Header backwardButton="simple" title="프로필 편집" />
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={onPickImage} style={styles.imageBox}>
          <Image
            source={profileImage ? { uri: profileImage } : profilePlaceholder}
            style={styles.image}
          />
          <Text style={styles.imageText}>사진 변경</Text>
        </TouchableOpacity>

        <TextInput style={styles.input} placeholder="닉네임" value={nickname} onChangeText={onChangeNickname} />
        <TextInput style={styles.input} placeholder="이메일" value={email} onChangeText={onChangeEmail} />
        <TextInput style={styles.input} placeholder="전화번호" value={phone} onChangeText={onChangePhone} />
        <TextInput
          style={[styles.input, styles.bio]}
          placeholder="소개"
          value={bio}
          onChangeText={onChangeBio}
          multiline
        />

        <TouchableOpacity style={styles.saveButton} onPress={onSave} disabled={loading}>
          <Text style={styles.saveText}>저장</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...layout.screen },
  content: { ...layout.content },
  imageBox: { alignItems: "center", marginBottom: spacing.lg },
  image: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.background },
  imageText: { marginTop: spacing.sm, color: colors.border },
  input: {
    borderBottomWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  bio: { height: 80 },
  saveButton: {
    marginTop: spacing.xl,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 8,
  },
  saveText: { color: colors.textWhite, textAlign: "center", ...typography.subtitle },
});
