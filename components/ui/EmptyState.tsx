import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "@/styles";
import Button from "./Button";

type Props = {
  icon?: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

// 데이터가 없거나(empty) 요청이 실패했을 때(error) 공통으로 쓰는 안내 화면.
export default function EmptyState({
  icon = "alert-circle-outline",
  title,
  description,
  actionLabel,
  onAction,
}: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={48} color={colors.neutral300} />
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} variant="secondary" size="sm" style={styles.action} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxxl,
    gap: spacing.xs,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: spacing.sm,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },
  action: {
    marginTop: spacing.md,
  },
});
