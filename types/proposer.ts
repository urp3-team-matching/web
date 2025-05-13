import { Prisma, ProposerType } from "@prisma/client";
import { z } from "zod";

export const CreateProposerSchema = z.object({
  projectId: z.number().int().positive(),
  type: z.nativeEnum(ProposerType),
  name: z.string().min(1),
  email: z.string().email(),
  major: z.string().min(1),
  phone: z.string().min(1),
  introduction: z.string().optional().default(""),
  password: z.string().min(6),
});
export type CreateProposerInput = z.infer<typeof CreateProposerSchema>;

export const UpdateProposerSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required."),
  type: z.nativeEnum(ProposerType).optional(),
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  major: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  introduction: z.string().optional(),
  password: z.string().min(6).optional(), // 새 비밀번호
});
export type UpdateProposerInput = z.infer<typeof UpdateProposerSchema>;

export const GetProposersQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
  type: z.nativeEnum(ProposerType).optional(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  major: z.string().optional(),
});
export type GetProposersQueryInput = z.infer<typeof GetProposersQuerySchema>;

export const proposerPublicSelection: Prisma.ProposerSelect = {
  id: true,
  type: true,
  name: true,
  email: true,
  major: true,
  phone: true,
  introduction: true,
  createdDatetime: true,
  updatedDatetime: true,
  projectId: true, // 어떤 프로젝트의 제안자인지 표시
  project: {
    // 관련 프로젝트 간략 정보
    select: { id: true, name: true },
  },
};
