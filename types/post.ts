// types/postTypes.ts
import { Post, Prisma } from "@prisma/client";
import { z } from "zod";

export const CreatePostSchema = z.object({
  title: z.string().min(1, "Title is required."),
  content: z.string().min(1, "Content is required."),
  author: z.string().min(1, "Author is required."),
  attachments: z.array(z.string()).optional().default([]),
  password: z.string().min(6, "Password is required (min 6 chars)."),
});
export type CreatePostInput = z.infer<typeof CreatePostSchema>;

export const UpdatePostSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required."),
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  author: z.string().min(1).optional(),
  attachments: z.array(z.string()).optional(),
  password: z.string().min(6).optional(),
});
export type UpdatePostInput = z.infer<typeof UpdatePostSchema>;

export const GetPostsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
  sortBy: z
    .enum(["createdDatetime", "viewCount"])
    .optional()
    .default("createdDatetime"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  title: z.string().optional(),
  author: z.string().optional(),
});
export type GetPostsQueryInput = z.infer<typeof GetPostsQuerySchema>;

export type PublicPost = Omit<Post, "passwordHash">;

export interface PaginatedPostsResponse {
  data: PublicPost[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

export const postPublicSelection: Prisma.PostSelect = {
  id: true,
  title: true,
  content: true,
  author: true,
  attachments: true,
  viewCount: true,
  createdDatetime: true,
  updatedDatetime: true,
};
