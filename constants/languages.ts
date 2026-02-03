export const LANGUAGES = {
  KOREAN: {
    code: "ko",
    label: "한국어",
    stt: "ko-KR",
    tts: "ko-KR",
  },
  JAPANESE: {
    code: "ja",
    label: "日本語",
    stt: "ja-JP",
    tts: "ja-JP",
  },
} as const;

export type LanguageKey = keyof typeof LANGUAGES;