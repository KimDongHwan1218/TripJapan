import { ActivityIndicator, View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { colors } from "@/styles";

type Props = {
  size?: "small" | "large";
  color?: string;
  fullscreen?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function Spinner({ size = "large", color = colors.primary, fullscreen, style }: Props) {
  if (fullscreen) {
    return (
      <View style={[styles.fullscreen, style]}>
        <ActivityIndicator size={size} color={color} />
      </View>
    );
  }
  return <ActivityIndicator size={size} color={color} style={style} />;
}

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
});
