import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { layout, spacing, colors, typography, radius } from "@/styles";

type User = {
  id?: string;
  nickname?: string;
  profile_image?: string;
};

type ProfileCardProps = {
  user?: User | null;
  onPress?: () => void;
};

export default function ProfileCard({ user, onPress }: ProfileCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.left}>
        <View style={styles.nameRow}>
          <Text style={typography.title}>{user?.nickname ?? "유저"}</Text>
          {user?.id && <Text style={typography.caption}> @{user.id}</Text>}
        </View>

        <Text style={typography.caption}>프로필 편집 &gt;</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 120,
    paddingHorizontal: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },

  left: {
    flex: 1,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: spacing.xs,
  },

  userId: {
    ...typography.body,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.surface,
  },
});
