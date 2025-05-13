import { PublicType } from "@/types/utils";
import { Applicant, Prisma, Proposer, ProposerType } from "@prisma/client";
import { z } from "zod";

// ProposerDataSchema는 Project 생성/수정 시 중첩 입력용
export const ProposerDataSchema = z.object({
  type: z.nativeEnum(ProposerType),
  name: z.string().min(1, "Proposer name is required."),
  email: z.string().email("Invalid email format for proposer."),
  major: z.string().min(1, "Proposer major is required."),
  phone: z.string().min(1, "Proposer phone number is required."),
  introduction: z.string().optional().default(""),
  password: z.string().min(6, "Proposer password is required (min 6 chars)."),
});
export type ProposerDataInput = z.infer<typeof ProposerDataSchema>;

export const CreateProjectSchema = z.object({
  name: z.string().min(1, "Project name is required."),
  background: z.string().optional().default(""),
  method: z.string().optional().default(""),
  objective: z.string().optional().default(""),
  result: z.string().optional().default(""),
  attachments: z.array(z.string()).optional().default([]),
  keywords: z.array(z.string()).optional().default([]),
  password: z.string().min(6, "Project password is required (min 6 chars)."),
  proposer: ProposerDataSchema.optional(),
});
export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;

export const UpdateProjectSchema = z.object({
  currentPassword: z
    .string()
    .min(1, "Current password is required to make changes."),
  name: z.string().min(1).optional(),
  background: z.string().optional(),
  method: z.string().optional(),
  objective: z.string().optional(),
  result: z.string().optional(),
  attachments: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
  password: z
    .string()
    .min(6, "New password must be at least 6 characters.")
    .optional(),
  proposer: ProposerDataSchema.partial() // Proposer 필드도 부분적 업데이트 가능
    .extend({ password: z.string().min(6).optional() }) // Proposer 새 비밀번호도 선택적
    .nullable()
    .optional(),
});
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;

export const GetProjectsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
  sortBy: z.string().optional().default("createdDatetime"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  name: z.string().optional(),
  keyword: z.string().optional(),
  proposerType: z.nativeEnum(ProposerType).optional(),
  searchTerm: z.string().optional(),
});
export type GetProjectsQueryInput = z.infer<typeof GetProjectsQuerySchema>;

export type ProposerForProject = Omit<
  PublicType<Proposer>,
  "projectId" | "project"
>; // Proposer의 project 필드는 순환 참조 가능성
export type ApplicantForProject = Omit<
  PublicType<Applicant>,
  "projectId" | "project"
>;

// Prisma Select 객체 (passwordHash 제외)
export const projectPublicSelection: Prisma.ProjectSelect = {
  id: true,
  name: true,
  viewCount: true,
  background: true,
  method: true,
  objective: true,
  result: true,
  attachments: true,
  keywords: true,
  createdDatetime: true,
  updatedDatetime: true,
  proposer: {
    select: {
      id: true,
      type: true,
      name: true,
      email: true,
      major: true,
      phone: true,
      introduction: true,
      createdDatetime: true,
      updatedDatetime: true,
    },
  },
  applicants: {
    select: {
      id: true,
      name: true,
      email: true,
      major: true,
      phone: true,
      introduction: true,
      createdDatetime: true,
      updatedDatetime: true,
    },
  },
};
