import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header/Header";
import { layout, spacing, colors, radius, typography } from "@/styles";
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

function Field({
  label,
  value,
  placeholder,
  onChangeText,
  multiline,
  keyboardType,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChangeText: (v: string) => void;
  multiline?: boolean;
  keyboardType?: any;
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.fieldInput, multiline && styles.fieldInputMulti]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        keyboardType={keyboardType}
        autoCapitalize="none"
      />
    </View>
  );
}

export default function ProfileEditScreenView({
  nickname, phone, email, bio, profileImage, loading,
  onChangeNickname, onChangePhone, onChangeEmail, onChangeBio,
  onPickImage, onSave,
}: Props) {
  return (
    <KeyboardAvoidingView
      style={layout.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Header backwardButton="simple" title="프로필 편집" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 프로필 이미지 */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={onPickImage} style={styles.avatarWrap} activeOpacity={0.8}>
            <Image
              source={profileImage ? { uri: profileImage } : profilePlaceholder}
              style={styles.avatar}
            />
            <View style={styles.cameraOverlay}>
              <Ionicons name="camera" size={18} color={colors.textWhite} />
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarHint}>프로필 사진 변경</Text>
        </View>

        {/* 입력 필드 패널 */}
        <View style={styles.panel}>
          <Field
            label="닉네임"
            value={nickname}
            placeholder="닉네임을 입력하세요"
            onChangeText={onChangeNickname}
          />
          <View style={styles.divider} />
          <Field
            label="이메일"
            value={email}
            placeholder="이메일을 입력하세요"
            onChangeText={onChangeEmail}
            keyboardType="email-address"
          />
          <View style={styles.divider} />
          <Field
            label="전화번호"
            value={phone}
            placeholder="전화번호를 입력하세요"
            onChangeText={onChangePhone}
            keyboardType="phone-pad"
          />
        </View>

        {/* 소개 패널 */}
        <View style={styles.panel}>
          <Field
            label="소개"
            value={bio}
            placeholder="자신을 간단히 소개해보세요"
            onChangeText={onChangeBio}
            multiline
          />
        </View>

        {/* 저장 버튼 */}
        <TouchableOpacity
          style={[styles.saveBtn, loading && { opacity: 0.6 }]}
          onPress={onSave}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color={colors.textWhite} />
          ) : (
            <Text style={styles.saveBtnText}>저장하기</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: 48,
    gap: spacing.md,
  },

  // 아바타
  avatarSection: {
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  avatarWrap: {
    position: "relative",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.neutral200,
  },
  cameraOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.surface,
  },
  avatarHint: {
    marginTop: spacing.sm,
    fontSize: 13,
    color: colors.textTertiary,
  },

  // 패널
  panel: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    overflow: "hidden",
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    marginHorizontal: spacing.lg,
  },

  // 필드
  fieldWrap: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: 6,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textTertiary,
  },
  fieldInput: {
    fontSize: 15,
    color: colors.textPrimary,
    padding: 0,
    minHeight: 24,
  },
  fieldInputMulti: {
    minHeight: 80,
    lineHeight: 22,
  },

  // 저장 버튼
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.sm,
  },
  saveBtnText: {
    ...typography.strongbutton,
    color: colors.textWhite,
  },
});
