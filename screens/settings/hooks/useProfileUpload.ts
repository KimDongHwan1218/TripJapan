import { ENV } from "@/config/env";

const API_BASE = ENV.API_BASE_URL;

export async function uploadProfileImage(userId: number, uri: string): Promise<string> {
  const filename = `profile_${userId}_${Date.now()}.jpg`;

  try {
    const res = await fetch(`${API_BASE}/profiles/upload-url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename }),
    });
    if (!res.ok) throw new Error(`업로드 URL 발급 실패: ${res.status}`);
    const { url, path } = await res.json();

    const file = await fetch(uri);
    const blob = await file.blob();
    const putRes = await fetch(url, { method: "PUT", headers: { "Content-Type": "image/jpeg" }, body: blob });
    if (!putRes.ok) throw new Error(`이미지 업로드 실패: ${putRes.status}`);

    return `https://wwmdmngncknalzfcpejn.supabase.co/storage/v1/object/public/profile-images/${path}`;
  } catch (err) {
    console.error("프로필 이미지 업로드 실패", err);
    throw err;
  }
}
