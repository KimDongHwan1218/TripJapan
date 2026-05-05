import "dotenv/config";

export default {
  expo: {
    name: "TripJapan",
    slug: "TripJapan",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/tabi_logo.png",
    scheme: "tripjapan",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,

    ios: {
      config: {
        "googleMapsApiKey": process.env.MAPS_PLATFORM_API_KEY,
      },
      supportsTablet: true,
      bundleIdentifier: "com.hwan1218.tripjapan",
    },

    android: {
      config: {
        googleMaps: {
          apiKey: process.env.MAPS_PLATFORM_API_KEY,
        },
      },
      adaptiveIcon: {
        foregroundImage: "./assets/images/tabi_logo.png",
        backgroundColor: "#ffffff",
      },
      package: "com.hwan1218.tripjapan",
    },

    plugins: [
      [
        "expo-build-properties",
        {
          android: {
            extraMavenRepos: [
              "https://devrepo.kakao.com/nexus/content/groups/public/",
            ],
            compileSdkVersion: 35,
            targetSdkVersion: 35,
            useAndroidX: true,
            enableJetifier: true,
          },
        },
      ],
      "expo-web-browser",
      // // 카카오 네이티브 SDK (EAS 빌드에서만 활성화)
      // [
      //   "@react-native-kakao/core",
      //   {
      //     nativeAppKey: process.env.KAKAO_NATIVE_APP_KEY,
      //     androidUseNewAuth: true,
      //   },
      // ],
      // // 구글 로그인
      // [
      //   "@react-native-google-signin/google-signin",
      //   { iosUrlScheme: process.env.GOOGLE_IOS_URL_SCHEME },
      // ],
    ],

    extra: {
      eas: {
        projectId: "0c7d183b-fcd5-4ae1-81db-bd5bdd4a4174",
      },

      // 🔐 환경변수로 관리
      MAPS_PLATFORM_API_KEY: process.env.MAPS_PLATFORM_API_KEY,
      KAKAO_REST_API_KEY: process.env.KAKAO_REST_API_KEY,
      KAKAO_NATIVE_APP_KEY: process.env.KAKAO_NATIVE_APP_KEY,
      GOOGLE_WEB_CLIENT_ID: process.env.GOOGLE_WEB_CLIENT_ID,
    },
  },
};