import Constants from "expo-constants";

/**
 * true  → Expo Go 앱 안에서 실행 중 (네이티브 SDK 사용 불가)
 * false → EAS 빌드 / 개발 클라이언트 (네이티브 SDK 사용 가능)
 */
export const isExpoGo = Constants.appOwnership === "expo";
