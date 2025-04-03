import { notClassifiedError, unknownError } from "@/services/error";
import { ListResponse } from "@/services/interface";
import {
  PaginationQueryResult,
  PrismaWhereQueryBuilder,
  QueryParams,
} from "@/services/query";
import { Prisma, PrismaClient, Project } from "@prisma/client";

const prisma = new PrismaClient();

// 필드가 Project 엔티티의 키인지 확인하는 타입 가드
function isProjectKey(key: string): key is keyof Project {
  return key in prisma.project.fields;
}

export const createProject = async (projectData: Project): Promise<Project> => {
  try {
    const newProject = await prisma.project.create({
      data: projectData,
    });
    return newProject;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const getProjects = async (
  query: QueryParams<Project> = {}
): Promise<ListResponse<Project>> => {
  try {
    const {
      // 기본값 설정
      page = 1,
      limit = 10,
      search,
      sort = "createdDatetime",
      order = "desc",
      // 나머지 모든 필드는 필터로 처리
      filters,
    } = query;

    // 페이징 처리
    const skip = (page - 1) * limit;
    const take = limit;

    // 정렬 처리
    const orderBy: Prisma.ProjectOrderByWithRelationInput = {};
    if (sort && sort in prisma.project.fields) {
      orderBy[sort] = order;
    }

    // where 조건 구성
    const prismaQuery = new PrismaWhereQueryBuilder<Project>();

    // 검색 조건 (name, content, proposerName 필드 검색)
    if (search) {
    }

    // 필터 적용 (CustomQuery 타입에서 오는 필터)
    if (filters) {
      Object.entries(filters).forEach(([key, filterValue]) => {
        // 잘못된 필드인 경우 무시
        if (!isProjectKey(key) || filterValue === undefined) return;

        // 각 필드 타입별 처리
        switch (key) {
          case "id":
          case "viewCount": {
            prismaQuery.addNumericField(key, filterValue as Prisma.IntFilter);
            break;
          }

          case "name":
          case "content":
          case "proposerName": {
            prismaQuery.addStringField(key, filterValue as Prisma.StringFilter);
            break;
          }

          case "proposerType": {
            prismaQuery.addEnumField(
              key,
              filterValue as Prisma.EnumProposerTypeFilter
            );
            break;
          }

          case "createdDatetime":
          case "updatedDatetime": {
            prismaQuery.addDatetimeField(
              key,
              filterValue as Date | Prisma.DateTimeFilter
            );
            break;
          }
        }
      });
    }
    // 패스워드 해시 필드는 제외
    prismaQuery.addStringField("passwordHash", {
      equals: undefined,
    });

    const prismaQueryResult = prismaQuery.getQuery();

    // 전체 개수 조회 (페이징 정보용)
    const totalCount = await prisma.project.count({
      where: prismaQueryResult,
    });

    // 실제 데이터 조회
    const projects = await prisma.project.findMany({
      where: prismaQueryResult,
      orderBy,
      skip,
      take,
    });

    // 페이지네이션 정보 구성
    const pagination: PaginationQueryResult = {
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      hasNext: page < Math.ceil(totalCount / limit),
      hasPrev: page > 1,
    };

    return {
      data: projects,
      pagination,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching projects:", error);

    if (error instanceof Error) {
      return {
        data: null,
        pagination: null,
        error: notClassifiedError,
      };
    }

    return {
      data: null,
      pagination: null,
      error: unknownError,
    };
  }
};

export const getProjectById = async (id: number): Promise<Project | null> => {
  try {
    const project = await prisma.project.findUnique({
      where: { id },
    });
    return project;
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    throw error;
  }
};

export const updateProject = async (
  id: number,
  projectData: Partial<Project>
): Promise<Project> => {
  try {
    const updatedProject = await prisma.project.update({
      where: { id },
      data: projectData,
    });
    return updatedProject;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

export const deleteProject = async (id: number): Promise<void> => {
  try {
    await prisma.project.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};
