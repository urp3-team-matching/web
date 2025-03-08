import { notClassifiedError, unknownError } from "@/services/error";
import {
  CreateResponse,
  DeleteResponse,
  ListResponse,
  RetrieveResponse,
  UpdateResponse,
} from "@/services/interface";
import { defaultPagination } from "@/services/pagination";
import { PrismaClient, Topic } from "@prisma/client";

const prisma = new PrismaClient();

export const createTopic = async (
  data: Topic
): Promise<CreateResponse<Topic>> => {
  try {
    const response = await prisma.topic.create({ data });
    return { success: true, data: response, error: null };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        data: null,
        error: notClassifiedError,
      };
    }
    return { success: false, data: null, error: unknownError };
  }
};

export const getTopics = async (): Promise<ListResponse<Topic>> => {
  try {
    const response = await prisma.topic.findMany();
    return {
      success: true,
      data: response,
      pagination: defaultPagination,
      error: null,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        data: null,
        pagination: null,
        error: notClassifiedError,
      };
    }
    return {
      success: false,
      data: null,
      pagination: null,
      error: unknownError,
    };
  }
};

export const getTopicById = async (
  id: number
): Promise<RetrieveResponse<Topic>> => {
  try {
    const response = await prisma.topic.findUnique({ where: { id } });
    if (response === null) {
      return {
        success: false,
        data: null,
        error: {
          httpStatusCode: 404,
          message: "해당 주제를 찾을 수 없습니다.",
        },
      };
    }
    return { success: true, data: response, error: null };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        data: null,
        error: notClassifiedError,
      };
    }
    return { success: false, data: null, error: unknownError };
  }
};

export const updateTopic = async (
  id: number,
  data: Topic
): Promise<UpdateResponse<Topic>> => {
  try {
    const response = await prisma.topic.update({
      where: { id },
      data,
    });
    return { success: true, data: response, error: null };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        data: null,
        error: notClassifiedError,
      };
    }
    return { success: false, data: null, error: unknownError };
  }
};

export const deleteTopic = async (
  id: number
): Promise<DeleteResponse<Topic>> => {
  try {
    await prisma.topic.delete({ where: { id } });
    return { success: true, data: null, error: null };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        data: null,
        error: notClassifiedError,
      };
    }
    return { success: false, data: null, error: unknownError };
  }
};
