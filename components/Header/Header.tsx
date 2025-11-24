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
  middleContent?: React.ReactNode | string;
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
  middleContent,
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
      if (value > 50) {
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
      </View>

      {/* 중앙 내용 */}
      <View style={styles.middle}>
        {typeof middleContent === "string" ? (
          <Text style={styles.title}>{middleContent}</Text>
        ) : (
          middleContent
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
    height: Platform.OS === "ios" ? 90 : 70,
    paddingTop: Platform.OS === "ios" ? 40 : 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  left: { width: 60 },
  middle: { flex: 1, alignItems: "center" },
  right: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: 80,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
});

export default Header;
