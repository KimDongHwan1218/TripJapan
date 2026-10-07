import React, { forwardRef } from "react";
import {
  Text as RNText,
  TextInput as RNTextInput,
  StyleSheet,
  type TextProps,
  type TextInputProps,
  type TextStyle,
} from "react-native";
import { FONT_FAMILY } from "@/styles/typography";

// 앱 전체 글꼴(Pretendard) 적용 지점. React Native에는 "기본 글꼴" 설정이 없고, Android는 커스텀 폰트에
// fontWeight만 주면 굵기별 파일을 못 골라서 가짜 볼드가 되거나 기본 글꼴로 빠짐 → fontWeight를 보고
// 굵기별 폰트 파일을 직접 지정하고 fontWeight는 지운다(이중 볼드 방지).
// 예전엔 토큰이 "Pretendard-Bold" 같은 이름을 쓰는데 폰트 파일 자체가 앱에 없어서 효과가 없었음.
const FAMILY_BY_WEIGHT: Record<string, string> = {
  "100": FONT_FAMILY.regular,
  "200": FONT_FAMILY.regular,
  "300": FONT_FAMILY.regular,
  "400": FONT_FAMILY.regular,
  normal: FONT_FAMILY.regular,
  "500": FONT_FAMILY.medium,
  "600": FONT_FAMILY.semibold,
  "700": FONT_FAMILY.bold,
  "800": FONT_FAMILY.bold,
  "900": FONT_FAMILY.bold,
  bold: FONT_FAMILY.bold,
};

function withPretendard(style: TextProps["style"]) {
  const flat = (StyleSheet.flatten(style) ?? {}) as TextStyle;
  // 직접 fontFamily를 지정한 경우(SpaceMono 등)는 그대로 둠
  if (flat.fontFamily && !flat.fontFamily.startsWith("Pretendard")) return style;
  const family = FAMILY_BY_WEIGHT[String(flat.fontWeight ?? "400")] ?? FONT_FAMILY.regular;
  return [style, { fontFamily: family, fontWeight: undefined }];
}

const Text = forwardRef<RNText, TextProps>(function Text({ style, ...rest }, ref) {
  return <RNText ref={ref} style={withPretendard(style)} {...rest} />;
});

export const TextInput = forwardRef<RNTextInput, TextInputProps>(function TextInput({ style, ...rest }, ref) {
  return <RNTextInput ref={ref} style={withPretendard(style) as TextInputProps["style"]} {...rest} />;
});

export default Text;
