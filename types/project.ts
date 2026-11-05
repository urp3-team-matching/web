import { Applicant, Prisma, ProjectStatus, ProposerType } from "@prisma/client";
import { z } from "zod";

import { passwordField } from "@/types/utils";

export enum Semester {
  FIRST = "1학기",
  SECOND = "2학기",
}

// "all" 센티넬: 학기 필터에서 "전체"(학년도 전체)를 뜻한다.
export const SEMESTER_FILTER_ALL = "all" as const;
export const SemesterFilterSchema = z.union([
  z.nativeEnum(Semester),
  z.literal(SEMESTER_FILTER_ALL),
]);
export type SemesterFilter = z.infer<typeof SemesterFilterSchema>;

// 서비스 이용자가 모두 한국에 있으므로 학기 경계는 KST 기준으로 계산한다.
// (서버(Vercel)는 UTC로 동작하므로 new Date(y, m, d)를 쓰면 9시간 어긋난다.)
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

const kstDate = (year: number, monthIndex: number, day: number) =>
  new Date(Date.UTC(year, monthIndex, day) - KST_OFFSET_MS);

/**
 * 모집 대상 학기 계산 — 화면(Filter)과 서버(getAllProjects)가 공통으로 쓰는 단일 기준.
 * 글 작성일(KST)을 기준으로 분류한다.
 * - 1월 ~ 6월 : 당해 연도 2학기   (예: 2026-03 작성 → 2026년 2학기)
 * - 7월 ~ 12월: 다음 연도 1학기   (예: 2026-11 작성 → 2027년 1학기)
 */
export function getAcademicPeriod(date: Date = new Date()): {
  year: number;
  semester: Semester;
} {
  const kst = new Date(date.getTime() + KST_OFFSET_MS);
  const year = kst.getUTCFullYear();
  const month = kst.getUTCMonth() + 1; // 1~12

  if (month <= 6) return { year, semester: Semester.SECOND };
  return { year: year + 1, semester: Semester.FIRST };
}

/**
 * 학기(또는 학년도 전체)에 해당하는 작성일 범위 [gte, lt) — getAcademicPeriod의 역함수
 * - Y년 1학기: (Y-1)년 7/1 ~ Y년 1/1 전   (전년도 7~12월 작성 글)
 * - Y년 2학기: Y년 1/1     ~ Y년 7/1 전   (당해 1~6월 작성 글)
 * - Y년 전체 : (Y-1)년 7/1 ~ Y년 7/1 전   (1학기 + 2학기)
 */
export function getSemesterDateRange(
  year: number,
  semester: SemesterFilter
): { gte: Date; lt: Date } {
  if (semester === Semester.FIRST) {
    return { gte: kstDate(year - 1, 6, 1), lt: kstDate(year, 0, 1) };
  }
  if (semester === Semester.SECOND) {
    return { gte: kstDate(year, 0, 1), lt: kstDate(year, 6, 1) };
  }
  return { gte: kstDate(year - 1, 6, 1), lt: kstDate(year, 6, 1) };
}

export const ProjectSchema = z.object({
  name: z.string().min(1, "Project name is required."),
  background: z.string(),
  method: z.string(),
  objective: z.string(),
  result: z.string(),
  etc: z.string().optional(),
  attachments: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
  password: passwordField,
  proposerName: z.string().min(1, "Proposer name is required."),
  proposerType: z.nativeEnum(ProposerType),
  proposerMajor: z.string().optional(),
  email: z.string().email("Invalid email format"),
  chatLink: z.string().url("Invalid URL format").optional(),
  status: z.nativeEnum(ProjectStatus),
});
export const ProjectUpdateSchema = ProjectSchema.extend({
  password: passwordField.optional(),
});
export type ProjectInput = z.infer<typeof ProjectSchema>;
export type ProjectUpdateInput = z.infer<typeof ProjectUpdateSchema>;

// 상태 필터
// - "all"(전체)    : 모집중 + 모집완료 글을 모두 보여준다. (기본값)
// - RECRUITING     : 모집중인 글만
// - CLOSED         : 모집완료된 글만
// 모집을 마감(/close)하면 status가 CLOSED로 바뀌어 [모집완료] 탭으로,
// 재모집(/reopen)하면 RECRUITING으로 바뀌어 [모집중] 탭으로 자동 이동한다.
export const STATUS_FILTER_ALL = "all" as const;
export const StatusFilterSchema = z.union([
  z.nativeEnum(ProjectStatus),
  z.literal(STATUS_FILTER_ALL),
]);
export type StatusFilter = z.infer<typeof StatusFilterSchema>;

export const GetProjectsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  sortBy: z.string().optional().default("createdDatetime"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  name: z.string().optional(),
  keyword: z.string().optional(),
  proposerType: z.nativeEnum(ProposerType).optional(),
  searchTerm: z.string().optional(),
  status: StatusFilterSchema.optional().default(STATUS_FILTER_ALL),
  // year/semester가 없으면 서버에서 getAcademicPeriod() 기본값을 적용한다.
  year: z.coerce.number().int().optional(),
  semester: SemesterFilterSchema.optional(),
});
export type GetProjectsQueryInput = z.infer<typeof GetProjectsQuerySchema>;

export type ApplicantForProject = Omit<Applicant, "projectId" | "project">;

// 공통 — 프로젝트 자체의 스칼라 필드는 admin/public 동일
const projectScalarSelection = {
  id: true,
  name: true,
  viewCount: true,
  background: true,
  method: true,
  objective: true,
  result: true,
  etc: true,
  attachments: true,
  keywords: true,
  createdDatetime: true,
  updatedDatetime: true,
  proposerName: true,
  proposerType: true,
  proposerMajor: true,
  email: true,
  chatLink: true,
  status: true,
  passwordHash: false, // 비밀번호 해시 제외
} satisfies Prisma.ProjectSelect;

// Owner/admin 전용 — 임베드된 applicants에 PII(email, introduction) 포함.
// verifyProjectPermission 통과한 호출자에게만 사용.
export const projectAdminSelection = {
  ...projectScalarSelection,
  applicants: {
    select: {
      id: true,
      name: true,
      email: true,
      major: true,
      introduction: true,
      createdDatetime: true,
      updatedDatetime: true,
      status: true,
    },
  },
} satisfies Prisma.ProjectSelect;

// 공개 — 임베드된 applicants에서 PII(email, introduction) 제외.
// 미인증 GET / 목록 조회는 이 select만 사용한다.
export const projectPublicSelection = {
  ...projectScalarSelection,
  applicants: {
    select: {
      id: true,
      name: true,
      major: true,
      createdDatetime: true,
      updatedDatetime: true,
      status: true,
    },
  },
} satisfies Prisma.ProjectSelect;
