import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SettingsStackParamList } from "@/navigation/SettingsStackNavigator";
import { useAuth } from "@/contexts/AuthContext";
import { spacing, colors } from "@/styles";
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
      activeOpacity={0.7}
      style={styles.row}
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
      </View>

      <Text style={styles.chevron}>{">"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.lg,
  },

  image: {
    width: 64,
    height: 64,
    borderRadius: 32,
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

  chevron: {
    color: colors.textSecondary,
    fontSize: 16,
  },
});