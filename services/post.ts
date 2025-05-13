import {
  NotFoundError,
  UnauthorizedError,
  verifyResourcePassword,
} from "@/lib/authUtils";
import { prisma } from "@/lib/prisma";
import {
  CreatePostInput,
  GetPostsQueryInput,
  postPublicSelection,
  UpdatePostInput,
} from "@/types/post";
import { PaginatedType, PasswordOmittedType } from "@/types/utils";
import { Post, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;
type PasswordOmittedPost = PasswordOmittedType<Post>;

// 포스트 생성 (비밀번호 해싱)
export async function createPost(
  data: CreatePostInput
): Promise<PasswordOmittedPost> {
  const { password: plainTextPassword, ...postData } = data;
  const passwordHash = await bcrypt.hash(plainTextPassword, SALT_ROUNDS);

  const createdPost = await prisma.post.create({
    data: {
      ...postData,
      passwordHash,
    },
    select: postPublicSelection, // passwordHash 제외 확인
  });
  return createdPost;
}

// 모든 포스트 조회 (페이지네이션, 필터링, 정렬)
export async function getAllPosts(
  query: GetPostsQueryInput
): Promise<PaginatedType<PasswordOmittedPost>> {
  const { page, limit, sortBy, sortOrder, title, author } = query;
  const skip = (page - 1) * limit;
  const take = limit;

  const whereConditions: Prisma.PostWhereInput = {};
  if (title) whereConditions.title = { contains: title, mode: "insensitive" };
  if (author)
    whereConditions.author = { contains: author, mode: "insensitive" };

  const orderByConditions: Prisma.PostOrderByWithRelationInput = {
    [sortBy]: sortOrder,
  };

  const [posts, totalItems] = await prisma.$transaction([
    prisma.post.findMany({
      where: whereConditions,
      orderBy: orderByConditions,
      skip,
      take,
      select: postPublicSelection, // passwordHash 제외 확인
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
export async function getPostById(
  id: number
): Promise<PasswordOmittedPost | null> {
  const post = await prisma.post.findUnique({
    where: { id },
    select: postPublicSelection, // passwordHash 제외 확인
  });

  if (post) {
    try {
      const updatedPost = await prisma.post.update({
        // 조회수 증가 후 증가된 데이터 반환
        where: { id },
        data: { viewCount: { increment: 1 } },
        select: postPublicSelection,
      });
      return updatedPost;
    } catch (error) {
      console.error(`Failed to increment view count for post ${id}:`, error);
      return post; // 에러 발생해도 원래 조회된 포스트 반환
    }
  }
  return null;
}

// 포스트 수정 (비밀번호 검증)
export async function updatePost(
  id: number,
  data: UpdatePostInput
): Promise<PasswordOmittedPost> {
  const {
    currentPassword,
    password: newPlainTextPassword,
    ...postUpdateData
  } = data;

  const postToUpdate = await prisma.post.findUnique({ where: { id } });
  if (!postToUpdate) {
    throw new NotFoundError("Post not found.");
  }
  if (!postToUpdate.passwordHash) {
    throw new Error("Post password integrity error.");
  }

  const isAuthorized = await verifyResourcePassword(
    currentPassword,
    postToUpdate.passwordHash
  );
  if (!isAuthorized) {
    throw new UnauthorizedError("Incorrect current password for post.");
  }

  let newPasswordHash;
  if (newPlainTextPassword) {
    newPasswordHash = await bcrypt.hash(newPlainTextPassword, SALT_ROUNDS);
  }

  const updatedPost = await prisma.post.update({
    where: { id },
    data: {
      ...postUpdateData,
      ...(newPasswordHash && { passwordHash: newPasswordHash }),
    },
    select: postPublicSelection, // passwordHash 제외 확인
  });
  return updatedPost;
}

// 포스트 삭제 (비밀번호 검증)
export async function deletePost(
  id: number,
  currentPassword?: string
): Promise<PasswordOmittedPost> {
  if (!currentPassword) {
    throw new UnauthorizedError(
      "Current password is required to delete this post."
    );
  }
  const postToDelete = await prisma.post.findUnique({ where: { id } });
  if (!postToDelete) {
    throw new NotFoundError("Post not found for deletion.");
  }
  if (!postToDelete.passwordHash) {
    throw new Error("Post password integrity error.");
  }

  const isAuthorized = await verifyResourcePassword(
    currentPassword,
    postToDelete.passwordHash
  );
  if (!isAuthorized) {
    throw new UnauthorizedError(
      "Incorrect current password for post deletion."
    );
  }

  const deletedPost = await prisma.post.delete({
    where: { id },
    select: postPublicSelection, // passwordHash 제외 확인
  });
  return deletedPost;
}
