// types/applicantTypes.ts
import { Applicant, Prisma } from "@prisma/client";
import { z } from "zod";

export const CreateApplicantSchema = z.object({
  // projectId는 URL 경로에서 주입
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Invalid email format."),
  major: z.string().min(1, "Major is required."),
  phone: z.string().min(1, "Phone number is required."),
  introduction: z.string().optional().default(""),
  password: z.string().min(6, "Password is required (min 6 chars)."),
});
export type CreateApplicantInput = z.infer<typeof CreateApplicantSchema>;

export const UpdateApplicantSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required."),
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  major: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  introduction: z.string().optional(),
  password: z.string().min(6).optional(),
});
export type UpdateApplicantInput = z.infer<typeof UpdateApplicantSchema>;

export type PublicApplicant = Omit<Applicant, "passwordHash">;

export const applicantPublicSelection: Prisma.ApplicantSelect = {
  id: true,
  name: true,
  email: true,
  major: true,
  phone: true,
  introduction: true,
  projectId: true, // 어떤 프로젝트의 지원자인지 표시
  createdDatetime: true,
  updatedDatetime: true,
};
