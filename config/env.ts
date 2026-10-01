// 클라이언트 번들에 들어가는 값만 둔다 — 여기 값은 앱을 디컴파일하면 누구나 볼 수 있음.
// Supabase anon 키는 공개 전제(RLS로 보호)라 번들에 들어가도 되지만, 소스에 하드코딩하지 않고
// .env의 EXPO_PUBLIC_* 값을 Expo가 빌드 시점에 주입하게 함(값은 .env.example 참고).
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY가 비어있음 — .env.example을 참고해 .env를 만들 것"
  );
}

export const ENV = {
  API_BASE_URL: "https://tavi-server.onrender.com",
  TRANSLATION_SERVER_URL: "https://tavi-server.onrender.com", // 번역 서버 URL (로컬 개발 시 http://192.168.x.x:3000 으로 변경)
  SUPABASE_URL,
  SUPABASE_KEY: SUPABASE_ANON_KEY,
};
