import { env } from "@/lib/env";

export const MAX_APPLICANTS = 4;
export const MAX_APPLICANT_MAJOR_COUNT = 2;
export const SCHEMA_NAME = env.NODE_ENV === "production" ? "public" : "dev";
