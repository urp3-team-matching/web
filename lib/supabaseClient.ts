import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: process.env.NODE_ENV === "production" ? "public" : "dev", // 프로덕션 환경에서는 public 스키마 사용
  },
});
