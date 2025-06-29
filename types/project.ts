import { passwordField } from "@/types/utils";
import { Applicant, Prisma, ProjectStatus, ProposerType } from "@prisma/client";
import { z } from "zod";

export const ProjectSchema = z.object({
  name: z.string().min(1, "Project name is required."),
  background: z.string(),
  method: z.string(),
  objective: z.string(),
  result: z.string(),
  attachments: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
  password: passwordField,
  proposerName: z.string().min(1, "Proposer name is required."),
  proposerType: z.nativeEnum(ProposerType),
  proposerMajor: z.string().optional(),
  email: z.string().email("Invalid email format").optional(),
  chatLink: z.string().url("Invalid URL format").optional(),
  status: z.nativeEnum(ProjectStatus),
});
export const ProjectUpdateSchema = ProjectSchema.extend({
  password: passwordField.optional(),
  currentPassword: passwordField,
});
export type ProjectInput = z.infer<typeof ProjectSchema>;
export type ProjectUpdateInput = z.infer<typeof ProjectUpdateSchema>;

export const GetProjectsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  sortBy: z.string().optional().default("createdDatetime"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  name: z.string().optional(),
  keyword: z.string().optional(),
  proposerType: z.nativeEnum(ProposerType).optional(),
  searchTerm: z.string().optional(),
  status: z.nativeEnum(ProjectStatus).optional(),
});
export type GetProjectsQueryInput = z.infer<typeof GetProjectsQuerySchema>;

export type ApplicantForProject = Omit<Applicant, "projectId" | "project">;

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
  proposerName: true,
  proposerType: true,
  proposerMajor: true,
  email: true,
  chatLink: true,
  status: true,
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
      status: true,
    },
  },
};
