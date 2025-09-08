import { NotFoundError } from "@/lib/authUtils";
import { prisma } from "@/lib/prisma";
import {
  GetPostsQueryInput,
  PostInput,
  postPublicSelection,
} from "@/types/post";
import { PaginatedType } from "@/types/utils";
import { Post, Prisma } from "@prisma/client";

// 포스트 생성
export async function createPost(data: PostInput): Promise<Post> {
  const createdPost = await prisma.post.create({
    data,
    select: postPublicSelection,
  });
  return createdPost;
}

// 모든 포스트 조회
export async function getAllPosts(
  query: GetPostsQueryInput
): Promise<PaginatedType<Post>> {
  const {
    page,
    limit,
    sortBy = "createdAt",
    sortOrder = "desc",
    title,
  } = query;
  const skip = (page - 1) * limit;
  const take = limit;

  const whereConditions: Prisma.PostWhereInput = {};
  if (title) whereConditions.title = { contains: title, mode: "insensitive" };

  const orderByConditions: Prisma.PostOrderByWithRelationInput = {
    [sortBy]: sortOrder,
  };

  const [posts, totalItems] = await prisma.$transaction([
    prisma.post.findMany({
      where: whereConditions,
      orderBy: orderByConditions,
      skip,
      take,
      select: postPublicSelection,
    }),
    prisma.post.count({ where: whereConditions }),
  ]);

  return {
    data: posts,
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
    currentPage: page,
    itemsPerPage: limit,
  };
}

// ID로 특정 포스트 조회 (조회수 증가)
export async function getPostById(id: number): Promise<Post | null> {
  const post = await prisma.post.findUnique({
    where: { id },
    select: postPublicSelection,
  });

  if (post) {
    try {
      const updatedPost = await prisma.post.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
        select: postPublicSelection,
      });
      return updatedPost;
    } catch (error) {
      console.error(`Failed to increment view count for post ${id}:`, error);
      return post;
    }
  }
  return null;
}

export async function updatePost(id: number, data: PostInput): Promise<Post> {
  const postToUpdate = await prisma.post.findUnique({ where: { id } });
  if (!postToUpdate) {
    throw new NotFoundError("Post not found.");
  }

  const updatedPost = await prisma.post.update({
    where: { id },
    data,
    select: postPublicSelection,
  });
  return updatedPost;
}

export async function deletePost(id: number): Promise<Post> {
  const postToDelete = await prisma.post.findUnique({ where: { id } });
  if (!postToDelete) {
    throw new NotFoundError("Post not found for deletion.");
  }

  const deletedPost = await prisma.post.delete({
    where: { id },
    select: postPublicSelection,
  });
  return deletedPost;
}
