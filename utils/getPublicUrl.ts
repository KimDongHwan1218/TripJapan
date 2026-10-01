// utils/getPublicUrl.ts
import { supabase } from "@/utils/supabaseClient";

/**
 * bucketName: 사용하려는 Supabase Storage 버킷 이름
 * path: 업로드된 이미지 경로 (예: 'avatars/123.png')
 */
export function getPublicUrl(bucketName: string, path: string): string | null {
  if (!path) return null;

  const { data } = supabase.storage.from(bucketName).getPublicUrl(path);

  if (!data?.publicUrl) {
    console.error("Supabase getPublicUrl 에러: publicUrl 없음");
    return null;
  }

  return data.publicUrl;
}
