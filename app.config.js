import "dotenv/config";

export default {
  expo: {
    name: "TripJapan",
    slug: "TripJapan",
    version: "1.0.0",
    orientation: "portrait",
    // 브랜드 이미지는 scripts/gen-brand-assets.js로 로고 SVG에서 생성(예전엔 60×27px PNG를 늘려 써서 흐릿했음)
    icon: "./assets/brand/icon.png",
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
        foregroundImage: "./assets/brand/adaptive-foreground.png",
        backgroundColor: "#E30003",
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
      [
        // 시작 화면: 흰 바탕 + 진한 "tabi" + 빨간 점. JS 인트로(IntroScreen)가 같은 이미지·크기(200)로 이어받아 끊김 없이
        "expo-splash-screen",
        {
          image: "./assets/brand/splash.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#FFFFFF",
        },
      ],
      [
        "expo-notifications",
        {
          icon: "./assets/brand/notification.png", // 흰 단색(안드로이드 알림 아이콘 규칙)
          color: "#E30003",
          sounds: [],
        },
      ],
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

      // 🔐 환경변수로 관리 — extra에 넣은 값은 앱 번들에 그대로 들어가므로 클라이언트가 실제로 쓰는 것만.
      // (Kakao/Google 로그인은 서버 프록시 방식이라 앱에선 해당 키를 쓰지 않음 — 번들에서 제거함)
      MAPS_PLATFORM_API_KEY: process.env.MAPS_PLATFORM_API_KEY,
    },
  },
};