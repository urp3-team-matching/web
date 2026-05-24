import { updateSession } from "@/utils/supabase/middleware";
import { type NextRequest } from "next/server";

// Next.js 16: middleware.ts → proxy.ts. 런타임은 기본 nodejs (edge runtime은
// proxy에서 미지원).
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: ["/posts/:id/create", "/posts/:id/edit"],
};
