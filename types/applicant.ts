import { Prisma } from "@prisma/client";
import { z } from "zod";

export const ApplicantSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Invalid email format."),
  major: z.string().min(1, "Major is required."),
  phone: z.string().min(1, "Phone number is required."),
  introduction: z.string().min(1, "Introduction is required."),
  password: z.string().min(6, "Password is required (min 6 chars)."),
});
export type ApplicantInput = z.infer<typeof ApplicantSchema>;

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
