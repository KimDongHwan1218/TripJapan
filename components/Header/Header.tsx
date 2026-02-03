import React from "react";
import { View, Text, StyleSheet, Platform, ImageBackground } from "react-native";
import BackwardButton from "./BackwardButton";
import SearchButton from "./SearchButton";
import ShareButton from "./ShareButton";
import MovetoButton from "./MovetoButton";
import MapButton from "./MapButton";
import headerBg from "@/assets/images/header_bg.png";
import { layout, spacing, typography, colors } from "@/styles";

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
  return (
    <ImageBackground
      source={headerBg}
      resizeMode="cover"
      style={styles.container}
    >
      {/* Left Area */}
      <View style={styles.side}>
        {backwardButton && <BackwardButton type={backwardButton} />}
      </View>

      {/* Center Title */}
      <View pointerEvents="none" style={styles.titleWrapper}>
        {typeof title === "string" ? (
          <Text style={styles.title}>{title}</Text>
        ) : (
          title
        )}
      </View>

      {/* Right Area */}
      <View style={[styles.side, styles.right]}>
        {rightButtons.map((btn, idx) => {
          switch (btn.type) {
            case "search":
              return <SearchButton key={idx} domain={btn.domain} />;
            case "share":
              return <ShareButton key={idx} pageInfo={btn.pageInfo} />;
            case "moveTo":
              return (
                <MovetoButton
                  key={idx}
                  target={btn.target}
                  label={btn.label}
                />
              );
            case "map":
              return <MapButton key={idx} searchQuery={btn.searchQuery} />;
            default:
              return null;
          }
        })}
      </View>
    </ImageBackground>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    height: Platform.OS === "ios" ? 120 : 108,

    flexDirection: "row",
    alignItems: "center",
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
    left: 0,
    right: 0,
    bottom: 0,
    top: Platform.OS === "ios" ? 12 : 8,

    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary
  },
});