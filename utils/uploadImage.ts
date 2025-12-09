import * as FileSystem from "expo-file-system";
import { Buffer } from "buffer";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export async function uploadImage(
  file: { uri: string; type: string; name: string },
  bucket: string,
  userId: number
) {
  try {
    if (!file?.uri) throw new Error("File URI not found");

    // base64 변환
    const base64 = await FileSystem.readAsStringAsync(file.uri, {
      encoding: "base64",
    });

    // base64 -> binary(buffer)
    const binary = Buffer.from(base64, "base64");

    const uploadPath = `${bucket}/${file.name}`;
    const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${uploadPath}`;

    // Supabase Storage 업로드
    const res = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": file.type,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      body: binary,
    });

    if (!res.ok) {
      console.log("Upload Error:", await res.text());
      throw new Error("Supabase upload failed: " + res.status);
    }

    // Public URL 생성
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${uploadPath}`;

    return { image_url: publicUrl };
  } catch (e) {
    console.error("uploadImage error:", e);
    throw e;
  }
}
