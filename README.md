# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

```
TripJapan
├─ .env
├─ apis
├─ app.json
├─ App.tsx
├─ assets
│  ├─ fonts
│  │  └─ SpaceMono-Regular.ttf
│  ├─ icons
│  │  ├─ backarrow.png
│  │  ├─ map.png
│  │  ├─ navigate.png
│  │  ├─ search.png
│  │  └─ share.png
│  └─ images
│     ├─ ad1.png
│     ├─ ad2.png
│     ├─ ad3.png
│     ├─ ad4.png
│     ├─ adaptive-icon.png
│     ├─ favicon.png
│     ├─ icon.png
│     ├─ partial-react-logo.png
│     ├─ react-logo.png
│     ├─ react-logo@2x.png
│     ├─ react-logo@3x.png
│     └─ splash-icon.png
├─ babel.config.js
├─ components
│  ├─ Calendar.tsx
│  ├─ Collapsible.tsx
│  ├─ CustomTabButton.tsx
│  ├─ ExternalLink.tsx
│  ├─ FAB.tsx
│  ├─ FlightList.tsx
│  ├─ HapticTab.tsx
│  ├─ Header
│  │  ├─ BackwardButton.tsx
│  │  ├─ Header.tsx
│  │  ├─ MapButton.tsx
│  │  ├─ MovetoButton.tsx
│  │  ├─ SearchButton.tsx
│  │  ├─ ShareButton.tsx
│  │  └─ styles.ts
│  ├─ HotelList.tsx
│  ├─ indexProps
│  │  └─ Imageslides.tsx
│  ├─ JapanMap copy.tsx
│  ├─ JapanMap.tsx
│  ├─ jp_regions.ts
│  ├─ KakaoLogin.tsx
│  ├─ mapProps
│  │  └─ Mapwebview.tsx
│  ├─ ParallaxScrollView.tsx
│  ├─ Popupads.tsx
│  ├─ ScheduleCard.tsx
│  ├─ ScheduleList.tsx
│  ├─ ScheduleMapCalendar.tsx
│  ├─ Slides.tsx
│  ├─ ThemedText.tsx
│  ├─ ThemedView.tsx
│  ├─ Tips.tsx
│  ├─ ToggleMenuButton.tsx
│  ├─ Tomytrip.tsx
│  └─ ui
│     ├─ IconSymbol.ios.tsx
│     ├─ IconSymbol.tsx
│     ├─ TabBarBackground.ios.tsx
│     └─ TabBarBackground.tsx
├─ eas.json
├─ hooks
│  ├─ useColorScheme.ts
│  ├─ useColorScheme.web.ts
│  └─ useThemeColor.ts
├─ index.js
├─ jp.geojson
├─ modals
│  ├─ BookingModal
│  ├─ PaymentModal
│  └─ TranslationModal
├─ navigation
│  ├─ AuthStack.tsx
│  ├─ CommunityStackNavigator.tsx
│  ├─ HomeStackNavigator.tsx
│  ├─ MainTabNavigator.tsx
│  ├─ ScheduleStackNavigator.tsx
│  ├─ SearchStackNavigator.tsx
│  └─ SettingsStackNavigator.tsx
├─ package-lock.json
├─ package.json
├─ README.md
├─ screens
│  ├─ auth
│  │  ├─ LoginScreen.tsx
│  │  └─ SignupScreen.tsx
│  ├─ community
│  │  ├─ CommentScreen.tsx
│  │  ├─ CommunityScreen.tsx
│  │  └─ PostCreateScreen.tsx
│  ├─ fab
│  │  ├─ booking
│  │  │  ├─ BookingCardList.tsx
│  │  │  └─ BookingModal.tsx
│  │  ├─ payment
│  │  │  ├─ CreditCardScreen.tsx
│  │  │  ├─ PaymentMethodSelectScreen.tsx
│  │  │  ├─ PaymentModal.tsx
│  │  │  ├─ PayPayScreen.tsx
│  │  │  └─ TransitCardScreen.tsx
│  │  └─ translation
│  │     ├─ ImageTranslationScreen.tsx
│  │     ├─ TextTranslationScreen.tsx
│  │     ├─ TranslationMethodSelectScreen.tsx
│  │     ├─ TranslationModal.tsx
│  │     └─ VoiceTranslationScreen.tsx
│  ├─ home
│  │  ├─ AttracitonDetailScreen.tsx
│  │  ├─ HomeScreen.tsx
│  │  ├─ ReviewScreen.tsx
│  │  ├─ TravelDetailScreen.tsx
│  │  └─ TravelEditScreen.tsx
│  ├─ schedules
│  │  ├─ AddTripScreen.tsx
│  │  ├─ ScheduleDetailScreen.tsx
│  │  ├─ SchedulingScreen.tsx
│  │  └─ TripHistoryScreen.tsx
│  ├─ search
│  │  ├─ DetailScreen.tsx
│  │  ├─ japandata.json
│  │  └─ SearchHomeScreen.tsx
│  └─ settings
│     ├─ NoticeScreen.tsx
│     ├─ NotificationScreen.tsx
│     ├─ PaymentScreen.tsx
│     ├─ PolicyScreen.tsx
│     ├─ ProfileEditScreen.tsx
│     ├─ SettingsScreen.tsx
│     ├─ SupportScreen.tsx
│     └─ VersionInfoScreen.tsx
├─ scripts
│  └─ reset-project.js
├─ server
│  ├─ .env
│  ├─ server.js
│  └─ uploads
│     ├─ translated-1755620044194.png
│     ├─ translated-1755620076333.png
│     ├─ translated-1755620094318.png
│     ├─ translated-1755620206718.png
│     ├─ translated-1755620272428.png
│     ├─ translated-1755620290451.png
│     ├─ translated-1755620302432.png
│     ├─ translated-1755620441215.png
│     ├─ translated-1755620619767.png
│     ├─ translated-1755620799486.png
│     ├─ translated-1755621002926.png
│     ├─ translated-1755621064095.png
│     ├─ translated-1755621334885.png
│     └─ translated-1755621538698.png
├─ tsconfig.json
├─ types
│  ├─ react-native-image-slider-box
│  │  └─ index.d.ts
│  └─ react-native-xml2js
│     └─ index.d.ts
└─ utils
   └─ constants
      └─ Colors.ts

```