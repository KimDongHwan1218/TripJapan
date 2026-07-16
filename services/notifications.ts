import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import Constants from "expo-constants";
import { ENV } from "@/config/env";

// Expo Go does not support push token registration (SDK 51+)
const isExpoGo = (Constants.executionEnvironment as string) === "storeClient";

try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
} catch {
  // expo-notifications native module not available (dev client not rebuilt yet)
}

export async function requestNotificationPermission(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === "granted") return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function registerPushToken(userId: string, accessToken: string): Promise<void> {
  if (isExpoGo) return;
  try {
    const granted = await requestNotificationPermission();
    if (!granted) return;

    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: "0c7d183b-fcd5-4ae1-81db-bd5bdd4a4174",
    });

    await fetch(`${ENV.API_BASE_URL}/users/${userId}/push-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ token: tokenData.data, platform: Platform.OS }),
    });
  } catch (e) {
    console.warn("Push token registration failed:", e);
  }
}
