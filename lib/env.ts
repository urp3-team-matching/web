import { z } from "zod";

const envSchema = z.object({
  // Server-side only
  PROJECT_ENCRYPTION_KEY: z
    .string()
    .length(32, "PROJECT_ENCRYPTION_KEY must be exactly 32 characters"),
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),
  DIRECT_URL: z.string().url("DIRECT_URL must be a valid URL"),

  // For sending emails
  EMAIL_SERVER_USER: z
    .string()
    .email("EMAIL_SERVER_USER must be a valid email"),
  EMAIL_SERVER_PASSWORD: z.string().min(1, "EMAIL_SERVER_PASSWORD is required"),

  // Client-side (NEXT_PUBLIC_*)
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),

  // Optional, only for production
  NEXT_PUBLIC_BASE_URL: z
    .string()
    .url("NEXT_PUBLIC_BASE_URL must be a valid URL")
    .optional(),

  // For Vercel
  VERCEL_URL: z.string().optional(),

  // General
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

const validateEnv = (() => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("❌ Environment validation error:");
    result.error.errors.forEach((err) => {
      console.error(`  - ${err.path.join(".")}: ${err.message}`);
    });
    process.exit(1);
  }

  console.log("✅ Environment validation passed");

  return process.env;
})();

export const env = validateEnv as z.infer<typeof envSchema>;
export type Env = z.infer<typeof envSchema>;
