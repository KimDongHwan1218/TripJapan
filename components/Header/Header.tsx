import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackwardButton from "./BackwardButton";
import SearchButton from "./SearchButton";
import ShareButton from "./ShareButton";
import MovetoButton from "./MovetoButton";
import MapButton from "./MapButton";
import { colors, spacing } from "@/styles";

const NAV_HEIGHT = 56;

interface HeaderProps {
  backwardButton?: boolean | "simple" | "arrow" | "round";
  title?: React.ReactNode | string;
  rightButtons?: Array<
    | { type: "search"; domain?: string }
    | { type: "share"; pageInfo?: any }
    | { type: "moveTo"; target: string; label?: string }
    | { type: "map"; searchQuery?: string }
  >;
}

const Header: React.FC<HeaderProps> = ({
  backwardButton,
  title,
  rightButtons = [],
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.inner}>
        {/* Left */}
        <View style={styles.side}>
          {backwardButton && <BackwardButton type={backwardButton} />}
        </View>

        {/* Center */}
        <View pointerEvents="none" style={styles.titleWrapper}>
          {typeof title === "string" ? (
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          ) : (
            title
          )}
        </View>

        {/* Right */}
        <View style={[styles.side, styles.right]}>
          {rightButtons.map((btn, idx) => {
            switch (btn.type) {
              case "search":
                return <SearchButton key={idx} domain={btn.domain} />;
              case "share":
                return <ShareButton key={idx} pageInfo={btn.pageInfo} />;
              case "moveTo":
                return (
                  <MovetoButton key={idx} target={btn.target} label={btn.label} />
                );
              case "map":
                return <MapButton key={idx} searchQuery={btn.searchQuery} />;
              default:
                return null;
            }
          })}
        </View>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  inner: {
    height: NAV_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.xs,
  },
  side: {
    minWidth: 44,
    flexDirection: "row",
    alignItems: "center",
  },
  right: {
    justifyContent: "flex-end",
  },
  titleWrapper: {
    position: "absolute",
    left: 44,
    right: 44,
    height: NAV_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.textPrimary,
  },
});
