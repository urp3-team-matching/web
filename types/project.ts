import { Applicant, Prisma, ProjectStatus, ProposerType } from "@prisma/client";
import { z } from "zod";

import { passwordField } from "@/types/utils";

export enum Semester {
  FIRST = "1학기",
  SECOND = "2학기",
}

export const ProjectSchema = z.object({
  name: z.string().min(1, "Project name is required."),
  background: z.string(),
  method: z.string(),
  objective: z.string(),
  result: z.string(),
  etc: z.string().optional(),
  attachments: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
  password: passwordField,
  proposerName: z.string().min(1, "Proposer name is required."),
  proposerType: z.nativeEnum(ProposerType),
  proposerMajor: z.string().optional(),
  email: z.string().email("Invalid email format"),
  chatLink: z.string().url("Invalid URL format").optional(),
  status: z.nativeEnum(ProjectStatus),
});
export const ProjectUpdateSchema = ProjectSchema.extend({
  password: passwordField.optional(),
});
export type ProjectInput = z.infer<typeof ProjectSchema>;
export type ProjectUpdateInput = z.infer<typeof ProjectUpdateSchema>;

// "all" 센티넬: 사용자가 명시적으로 "전체"를 선택했을 때만 사용.
// URL/쿼리에서 status가 없으면 기본값(모집중)이 들어가고, "all"이면 status 필터를 건너뛴다.
export const STATUS_FILTER_ALL = "all" as const;
export const StatusFilterSchema = z.union([
  z.nativeEnum(ProjectStatus),
  z.literal(STATUS_FILTER_ALL),
]);
export type StatusFilter = z.infer<typeof StatusFilterSchema>;

export const GetProjectsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  sortBy: z.string().optional().default("createdDatetime"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  name: z.string().optional(),
  keyword: z.string().optional(),
  proposerType: z.nativeEnum(ProposerType).optional(),
  searchTerm: z.string().optional(),
  status: StatusFilterSchema.optional().default(ProjectStatus.RECRUITING),
  year: z.coerce.number().int().optional(),
  semester: z.nativeEnum(Semester).optional(),
});
export type GetProjectsQueryInput = z.infer<typeof GetProjectsQuerySchema>;

export type ApplicantForProject = Omit<Applicant, "projectId" | "project">;

// 공통 — 프로젝트 자체의 스칼라 필드는 admin/public 동일
const projectScalarSelection = {
  id: true,
  name: true,
  viewCount: true,
  background: true,
  method: true,
  objective: true,
  result: true,
  etc: true,
  attachments: true,
  keywords: true,
  createdDatetime: true,
  updatedDatetime: true,
  proposerName: true,
  proposerType: true,
  proposerMajor: true,
  email: true,
  chatLink: true,
  status: true,
  passwordHash: false, // 비밀번호 해시 제외
} satisfies Prisma.ProjectSelect;

// Owner/admin 전용 — 임베드된 applicants에 PII(email, introduction) 포함.
// verifyProjectPermission 통과한 호출자에게만 사용.
export const projectAdminSelection = {
  ...projectScalarSelection,
  applicants: {
    select: {
      id: true,
      name: true,
      email: true,
      major: true,
      introduction: true,
      createdDatetime: true,
      updatedDatetime: true,
      status: true,
    },
  },
} satisfies Prisma.ProjectSelect;

// 공개 — 임베드된 applicants에서 PII(email, introduction) 제외.
// 미인증 GET / 목록 조회는 이 select만 사용한다.
export const projectPublicSelection = {
  ...projectScalarSelection,
  applicants: {
    select: {
      id: true,
      name: true,
      major: true,
      createdDatetime: true,
      updatedDatetime: true,
      status: true,
    },
  },
} satisfies Prisma.ProjectSelect;
