export const ENV = {
  API_BASE_URL: process.env.API_BASE ?? "",
  GOOGLE_MAPS_KEY: process.env.MAPS_PLATFORM_API_KEY ?? "",
  KAKAO_APP_KEY: process.env.EXPO_PUBLIC_KAKAO_APP_KEY ?? "",
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL!,
  SUPABASE_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
};