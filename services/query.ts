import { Prisma } from "@prisma/client";

export interface SearchQuery {
  search?: string;
}

export interface SortQuery<T> {
  sort?: keyof T;
  order?: "asc" | "desc";
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginationQueryResult {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// 필터 연산자 타입
export type FilterOperator =
  | "eq" // 같음
  | "neq" // 같지 않음
  | "gt" // 초과
  | "gte" // 이상
  | "lt" // 미만
  | "lte" // 이하
  | "like" // 포함
  | "in" // 목록에 포함
  | "between"; // 범위 내

// 타입에 따른 필터 타입 매핑
export type TypedFilter<T> =
  | T
  | Prisma.StringFilter
  | Prisma.IntFilter
  | Prisma.DateTimeFilter;

// 타입별로 매핑된 커스텀 쿼리
export type CustomQuery<T> = {
  [K in keyof T]?: TypedFilter<T[K]>;
};

// 모든 쿼리 매개변수를 통합한 인터페이스
export interface QueryParams<T>
  extends SearchQuery,
    SortQuery<T>,
    PaginationQuery {
  filters?: CustomQuery<T>;
}

/**
 * Prisma where 쿼리 빌더
 * @template T Prisma where 쿼리 타입
 * @class PrismaWhereQueryBuilder
 * @example
 * const prismaWhereQuery = new PrismaWhereQueryBuilder<Project>();
 * prismaWhereQuery.addStringField("name", "test");
 * prismaWhereQuery.addNumericField("viewCount", { gt: 10 });
 * prismaWhereQuery.addDatetimeField("createdDatetime", { gt: new Date() });
 * prismaWhereQuery.addBooleanField("isPublished", true);
 * prismaWhereQuery.addEnumField("proposerType", "USER");
 */
export class PrismaWhereQueryBuilder<
  T extends
    | Prisma.TeamWhereInput
    | Prisma.ProjectWhereInput
    | Prisma.ApplicantWhereInput
    | Prisma.TeamContentWhereInput
> {
  private prismaQuery: T;

  constructor() {
    this.prismaQuery = {} as T;
  }

  public getQuery(): T {
    return this.prismaQuery;
  }

  public addStringField<K extends keyof T>(
    key: K,
    filterValue: string | Prisma.StringFilter
  ): void {
    // string 타입의 key만 처리할 수 있도록 제한
    // StringFilter는 string 필드에만 할당 가능
    const stringFilter = {} as Prisma.StringFilter;

    if (typeof filterValue === "object" && filterValue !== null) {
      // 복잡한 필터 객체 처리
      const filter = filterValue;

      if (filter.equals !== undefined) stringFilter.equals = filter.equals;
      if (filter.not !== undefined) stringFilter.not = filter.not;
      if (filter.contains !== undefined)
        stringFilter.contains = filter.contains;
      if (filter.mode !== undefined) stringFilter.mode = filter.mode;
      if (filter.in !== undefined) stringFilter.in = filter.in;
    } else if (typeof filterValue === "string") {
      // 단순 문자열값
      stringFilter.equals = filterValue;
    }

    if (Object.keys(stringFilter).length > 0) {
      // T[K]가 StringFilter 타입과 호환되는지 확인
      // K는 string 타입 필드의 키만 가능하도록 제한됨
      this.prismaQuery[key] = stringFilter as T[K];
    }
  }

  public addNumericField<K extends keyof T>(
    key: K,
    filterValue: number | Prisma.IntFilter
  ): void {
    // number 타입의 key만 처리할 수 있도록 제한
    // NumericFilter는 number 필드에만 할당 가능
    const numericFilter = {} as Prisma.IntFilter;

    if (typeof filterValue === "object" && filterValue !== null) {
      // 복잡한 필터 객체 처리
      const filter = filterValue;

      if (filter.equals !== undefined) numericFilter.equals = filter.equals;
      if (filter.not !== undefined) numericFilter.not = filter.not;
      if (filter.gt !== undefined) numericFilter.gt = filter.gt;
      if (filter.gte !== undefined) numericFilter.gte = filter.gte;
      if (filter.lt !== undefined) numericFilter.lt = filter.lt;
      if (filter.lte !== undefined) numericFilter.lte = filter.lte;
      if (filter.in !== undefined) numericFilter.in = filter.in;
    } else if (typeof filterValue === "number") {
      // 단순 숫자값
      numericFilter.equals = filterValue;
    }

    if (Object.keys(numericFilter).length > 0) {
      // T[K]가 NumericFilter 타입과 호환되는지 확인
      // K는 number 타입 필드의 키만 가능하도록 제한됨
      this.prismaQuery[key] = numericFilter as T[K];
    }
  }

  public addDatetimeField<K extends keyof T>(
    key: K,
    filterValue: Date | Prisma.DateTimeFilter
  ): void {
    // Date 타입의 key만 처리할 수 있도록 제한
    // DateFilter는 Date 필드에만 할당 가능
    const dateFilter = {} as Prisma.DateTimeFilter;

    if (filterValue instanceof Date) {
      // 단순 Date값
      dateFilter.equals = filterValue;
    } else if (filterValue instanceof Date) {
      // 복잡한 필터 객체 처리
      const filter = filterValue;

      if (filter.equals !== undefined) dateFilter.equals = filter.equals;
      if (filter.not !== undefined) dateFilter.not = filter.not;
      if (filter.gt !== undefined) dateFilter.gt = filter.gt;
      if (filter.gte !== undefined) dateFilter.gte = filter.gte;
      if (filter.lt !== undefined) dateFilter.lt = filter.lt;
      if (filter.lte !== undefined) dateFilter.lte = filter.lte;
      if (filter.in !== undefined) dateFilter.in = filter.in;
    }

    if (Object.keys(dateFilter).length > 0) {
      // T[K]가 DateFilter 타입과 호환되는지 확인
      // K는 Date 타입 필드의 키만 가능하도록 제한됨
      this.prismaQuery[key] = dateFilter as T[K];
    }
  }

  public addBooleanField<K extends keyof T>(
    key: K,
    filterValue: boolean
  ): void {
    this.prismaQuery[key] = filterValue as T[K];
  }

  public addEnumField<K extends keyof T>(
    key: K,
    filterValue: Prisma.EnumProposerTypeFilter
  ): void {
    this.prismaQuery[key] = filterValue as T[K];
  }
}
