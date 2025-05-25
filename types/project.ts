import { passwordField } from "@/types/utils";
import { Applicant, Prisma, ProposerType } from "@prisma/client";
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
});
export const ProjectUpdateSchema = ProjectSchema.extend({
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
  recruiting: z.enum(["recruiting", "closed"]).optional(),
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
  applicantCount: true,
  acceptedApplicantCount: true,
  passwordHash: false,
  applicants: {
    select: {
      id: true,
      name: true,
      email: true,
      major: true,
      phone: true,
      introduction: true,
      accepted: true,
      createdDatetime: true,
      updatedDatetime: true,
    },
  },
};
