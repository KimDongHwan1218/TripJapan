// components/Header/Header.tsx
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Animated, Platform } from "react-native";
import BackwardButton from "./BackwardButton";
import SearchButton from "./SearchButton";
import ShareButton from "./ShareButton";
import MovetoButton from "./MovetoButton";
import MapButton from "./MapButton";

interface HeaderProps {
  backwardButton?: boolean | "simple" | "arrow" | "round"; // 디자인 선택 가능
  title?: React.ReactNode | string;
  rightButtons?: Array<
    | { type: "search"; domain?: string; onPress?: () => void }
    | { type: "share"; pageInfo?: any }
    | { type: "moveTo"; target: string; label?: string }
    | { type: "map"; searchQuery?: string }
  >;
  isAlwaysVisible?: boolean;
  changeStyleOnScroll?: boolean;
  scrollY?: Animated.Value; // 외부에서 전달받을 수도 있음
}

const Header: React.FC<HeaderProps> = ({
  backwardButton,
  title,
  rightButtons = [],
  isAlwaysVisible = true,
  changeStyleOnScroll = false,
  scrollY,
}) => {
  const [headerBg, setHeaderBg] = useState("transparent");
  const [headerShadow, setHeaderShadow] = useState(false);

  // 스크롤 기반 스타일 변경
  useEffect(() => {
    if (!changeStyleOnScroll || !scrollY) return;

    const listener = scrollY.addListener(({ value }) => {
      if (value > 20) {
        setHeaderBg("#fff");
        setHeaderShadow(true);
      } else {
        setHeaderBg("transparent");
        setHeaderShadow(false);
      }
    });
    return () => scrollY.removeListener(listener);
  }, [scrollY, changeStyleOnScroll]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: headerBg,
          elevation: headerShadow ? 4 : 0,
          shadowOpacity: headerShadow ? 0.2 : 0,
        },
      ]}
    >
      {/* 좌측 뒤로가기 */}
      <View style={styles.left}>
        {backwardButton && <BackwardButton type={backwardButton} />}
        {typeof title === "string" ? (
          <Text style={styles.title}>{title}</Text>
        ) : (
          title
        )}
      </View>

      {/* 우측 버튼 리스트 */}
      <View style={styles.right}>
        {rightButtons.map((btn, idx) => {
          switch (btn.type) {
            case "search":
              return <SearchButton key={idx} domain={btn.domain}/>;
            case "share":
              return <ShareButton key={idx} pageInfo={btn.pageInfo} />;
            case "moveTo":
              return <MovetoButton key={idx} target={btn.target} label={btn.label} />;
            case "map":
              return <MapButton key={idx} searchQuery={btn.searchQuery} />;
            default:
              return null;
          }
        })}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Platform.OS === "ios" ? 64 : 56,   // ↓ 전체 높이 축소
    paddingTop: Platform.OS === "ios" ? 12 : 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  left: {
    minWidth: 40, // 뒤로가기 없는 경우 공간 최소화
    justifyContent: "center",
    flexDirection: "row", 
  },
  middle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  right: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: 130,
  },
  title: {
    fontSize: 26,
    fontWeight: "500", // Home에서는 너무 세지 않게
  },
});

export default Header;
