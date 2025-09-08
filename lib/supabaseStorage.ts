import { supabase } from "../lib/supabaseClient";

export function getStorage() {
  const storageName =
    process.env.NODE_ENV === "production"
      ? "web-production"
      : "web-development";
  return supabase.storage.from(storageName);
}

export function uploadFile(file: File, path: string) {
  const storage = getStorage();
  return storage.upload(path, file, {
    cacheControl: "3600",
    upsert: true,
  });
}

export function getPublicUrl(path: string) {
  const storage = getStorage();
  const { data } = storage.getPublicUrl(path);
  return data.publicUrl;
}

export function parseFileNameFromUrl(url: string) {
  try {
    const urlObj = new URL(url);
    const parts = urlObj.pathname.split("/"); // 마지막 / 뒤의 부분 추출
    return parts.pop() || null;
  } catch {
    console.error("Invalid URL:", url);
    return null;
  }
}
