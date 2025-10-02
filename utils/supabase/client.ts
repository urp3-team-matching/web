import { env } from "@/lib/env";
import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let client: SupabaseClient<any, "public" | "dev", any> | null = null;

export function getClientSupabase() {
  // 🔹 싱글톤 패턴으로 중복 생성 방지
  if (client) {
    return client;
  }

  client = createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: {
        schema: env.NODE_ENV === "production" ? "public" : "dev",
      },
    }
  );

  return client;
}
