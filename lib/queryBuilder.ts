/* eslint-disable @typescript-eslint/no-explicit-any */
import { ListResponse } from "@/services/interface";
import { PrismaClient } from "@prisma/client";
import { QueryParams } from "./queryParser";

export function createPrismaQueryBuilder<T, K extends keyof any>(
  prisma: PrismaClient,
  modelName: K
) {
  // Prisma 모델에 접근하기 위한 타입 안전한 방법
  const model = prisma[modelName as keyof PrismaClient] as any;

  return {
    /**
     * 데이터 목록 조회
     */
    async getItems(query: QueryParams): Promise<ListResponse<T>> {
      const {
        page = 1,
        limit = 10,
        search = "",
        sort = "createdDatetime",
        order = "desc",
        filters = {},
      } = query;

      // 기본 조건
      let where: any = {};

      // 검색 조건 적용 (모델에 맞게 수정 필요)
      if (search && search.trim() !== "") {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ];
      }

      // 필터 적용
      if (Object.keys(filters).length > 0) {
        where = {
          ...where,
          ...Object.entries(filters).reduce((acc, [key, value]) => {
            // 배열인 경우 IN 필터 적용
            if (Array.isArray(value)) {
              acc[key] = { in: value };
            }
            // 객체인 경우 (범위 검색 등)
            else if (typeof value === "object" && value !== null) {
              acc[key] = {};
              if ("gte" in value) acc[key].gte = value.gte;
              if ("lte" in value) acc[key].lte = value.lte;
              if ("gt" in value) acc[key].gt = value.gt;
              if ("lt" in value) acc[key].lt = value.lt;
              // 기타 필요한 조건들
            }
            // 단일 값인 경우 정확히 일치
            else {
              acc[key] = value;
            }
            return acc;
          }, {}),
        };
      }

      // 정렬 옵션
      const orderBy = { [sort]: order.toLowerCase() };

      // 페이지네이션 옵션
      const skip = (page - 1) * limit;
      const take = limit;

      // 데이터 조회와 카운트를 병렬로 실행
      const [data, totalCount] = await Promise.all([
        model.findMany({
          where,
          orderBy,
          skip,
          take,
        }),
        model.count({ where }),
      ]);

      return {
        data: data as unknown as T[],
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
        },
      };
    },

    /**
     * 단일 항목 생성
     */
    async createItem(item: Partial<T>): Promise<T> {
      const data = await model.create({
        data: item as any,
      });

      return data as unknown as T;
    },

    /**
     * 단일 항목 조회
     */
    async getItem(id: string | number): Promise<T> {
      const data = await model.findUniqueOrThrow({
        where: { id } as any,
      });

      return data as unknown as T;
    },

    /**
     * 항목 업데이트
     */
    async updateItem(id: string | number, updates: Partial<T>): Promise<T> {
      const data = await model.update({
        where: { id } as any,
        data: updates as any,
      });

      return data as unknown as T;
    },

    /**
     * 항목 삭제
     */
    async deleteItem(id: string | number): Promise<void> {
      await model.delete({
        where: { id } as any,
      });
    },
  };
}
