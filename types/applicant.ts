import { passwordField } from "@/types/utils";
import { Prisma } from "@prisma/client";
import { z } from "zod";

export const ApplicantSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Invalid email format."),
  major: z.string().min(1, "Major is required."),
  phone: z.string().min(1, "Phone number is required."),
  introduction: z.string().min(1, "Introduction is required."),
  status: z.enum(["PENDING", "ACCEPTED", "REJECTED"]).default("PENDING"),
  password: passwordField,
});
export const ApplicantUpdateSchema = ApplicantSchema.extend({
  currentPassword: passwordField,
});
export type ApplicantInput = z.infer<typeof ApplicantSchema>;
export type ApplicantUpdateInput = z.infer<typeof ApplicantUpdateSchema>;

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
