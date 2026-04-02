import { ENV } from "@/config/env";

const API_BASE = ENV.API_BASE_URL;

export async function uploadProfileImage(userId: number, uri: string): Promise<string> {
  const filename = `profile_${userId}_${Date.now()}.jpg`;

  const res = await fetch(`${API_BASE}/profiles/upload-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename }),
  });
  const { url, path } = await res.json();

  const file = await fetch(uri);
  const blob = await file.blob();
  await fetch(url, { method: "PUT", headers: { "Content-Type": "image/jpeg" }, body: blob });

  return `https://wwmdmngncknalzfcpejn.supabase.co/storage/v1/object/public/profile-images/${path}`;
}
