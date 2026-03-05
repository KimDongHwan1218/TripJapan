import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SettingsStackParamList } from "@/navigation/SettingsStackNavigator";
import { useAuth } from "@/contexts/AuthContext";
import { spacing, typography, colors, radius } from "@/styles";
import profilePlaceholder from "@/assets/images/profile-placeholder.png";

type NavProp = NativeStackNavigationProp<
  SettingsStackParamList,
  "SettingsScreen"
>;

export default function ProfileSummaryCard() {
  const navigation = useNavigation<NavProp>();
  const { user } = useAuth();

  if (!user) return null;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.card}
      onPress={() => navigation.navigate("ProfileEditScreen")}
    >
      <Image
        source={
          user.profile_image
            ? { uri: user.profile_image }
            : profilePlaceholder
        }
        style={styles.image}
      />

      <View style={styles.content}>
        <Text style={styles.name}>{user.name}</Text>

        {user.nickname && (
          <Text style={styles.nickname}>@{user.nickname}</Text>
        )}

        <View style={styles.divider} />

        <Text style={styles.editText}>프로필 편집</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.xl,
    // marginHorizontal: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    height: 140,

    // 🔑 카드 느낌의 핵심
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  image: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },

  content: {
    marginLeft: spacing.md,
    flex: 1,
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
  },

  nickname: {
    marginTop: 2,
    fontSize: 14,
    color: colors.textSecondary,
  },

  divider: {
    marginVertical: spacing.sm,
    height: 1,
    backgroundColor: colors.border,
    opacity: 0.6,
  },

  editText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "600",
  },
});