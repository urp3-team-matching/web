import { Prisma } from "@prisma/client";
import { z } from "zod";

export const AttachmentSchema = z.object({
  url: z.string(),
  name: z.string(),
});

export const PostSchema = z.object({
  title: z.string().min(1, "Title is required."),
  content: z.string().min(1, "Content is required."),
  attachments: z.array(AttachmentSchema).default([]).optional(),
});
export type PostInput = z.infer<typeof PostSchema>;

export const GetPostsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
  sortBy: z
    .enum(["createdDatetime", "viewCount"])
    .optional()
    .default("createdDatetime"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  title: z.string().optional(),
});
export type GetPostsQueryInput = z.infer<typeof GetPostsQuerySchema>;

export const postPublicSelection: Prisma.PostSelect = {
  id: true,
  title: true,
  content: true,
  attachments: true,
  viewCount: true,
  createdDatetime: true,
  updatedDatetime: true,
};
