// ============================================================
// 타비 디자인 시스템 — Shadow Tokens
// iOS: shadow*, Android: elevation
// ============================================================

import { Platform } from "react-native";

const shadow = (
  color: string,
  opacity: number,
  radius: number,
  offsetY: number,
  elevation: number
) =>
  Platform.select({
    ios: {
      shadowColor: color,
      shadowOpacity: opacity,
      shadowRadius: radius,
      shadowOffset: { width: 0, height: offsetY },
    },
    android: { elevation },
    default: {},
  });

export const shadows = {
  // 카드, 버튼 위 가벼운 그림자
  sm: shadow("#000000", 0.06, 4, 2, 2),
  // 카드, 드롭다운, 팝업
  md: shadow("#000000", 0.10, 8, 4, 4),
  // 바텀시트, 모달
  lg: shadow("#000000", 0.14, 16, 8, 8),
  // 탭바 위 구분 그림자
  tabBar: shadow("#000000", 0.08, 12, -4, 6),
} as const;
