"use client";

import { ProjectStatus } from "@prisma/client";
import { parseAsInteger, parseAsStringEnum, useQueryState } from "nuqs";
import { z } from "zod";

import TabTrigger from "@/components/Filter/TabTrigger";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getAcademicPeriod,
  GetProjectsQuerySchema,
  Semester,
  SEMESTER_FILTER_ALL,
  SemesterFilter,
  SemesterFilterSchema,
  STATUS_FILTER_ALL,
  StatusFilter,
  StatusFilterSchema,
} from "@/types/project";

const STATUS_FILTER_VALUES: StatusFilter[] = [
  ...Object.values(ProjectStatus),
  STATUS_FILTER_ALL,
];

const SEMESTER_FILTER_VALUES: SemesterFilter[] = [
  ...Object.values(Semester),
  SEMESTER_FILTER_ALL,
];

const Filter = () => {
  // 서버(getAllProjects)와 같은 함수로 기본 연도/학기를 계산한다.
  // (작성일 기준 1~6월 → 당해 2학기 / 7~12월 → 다음 해 1학기)
  // nuqs의 withDefault 값은 URL에 기록되지 않으므로, 서버도 같은 기본값을
  // 써야 화면에 보이는 필터와 실제 조회 결과가 일치한다.
  const { year: defaultYear, semester: defaultSemester } = getAcademicPeriod();

  const [filter, setFilter] = useQueryState(
    "status" as keyof z.infer<typeof GetProjectsQuerySchema>,
    parseAsStringEnum<StatusFilter>(STATUS_FILTER_VALUES).withDefault(
      STATUS_FILTER_ALL
    )
  );

  const [year, setYear] = useQueryState<number>(
    "year",
    parseAsInteger.withDefault(defaultYear)
  );

  const [semester, setSemester] = useQueryState<SemesterFilter>(
    "semester",
    parseAsStringEnum<SemesterFilter>(SEMESTER_FILTER_VALUES).withDefault(
      defaultSemester
    )
  );

  // 필터가 바뀌면 1페이지로 돌아간다(예: 전체 3페이지 → 모집중 탭 이동 시 빈 화면 방지).
  const [, setPage] = useQueryState("page", parseAsInteger);

  const changeStatus = (value: StatusFilter) => {
    setFilter(value);
    setPage(null);
  };

  return (
    <div className="w-full flex gap-x-2 justify-between md:justify-start items-center">
      {/* 필터 대상: 학기/년도 */}
      <div className="flex gap-2 items-center">
        <Label htmlFor="year" className="hidden md:block">
          년도
        </Label>
        <Input
          type="number"
          value={year}
          onChange={(e) => {
            const value = e.target.valueAsNumber;
            // 입력칸을 비우면 NaN이 들어오므로 기본값으로 되돌린다.
            setYear(Number.isNaN(value) ? null : value);
            setPage(null);
          }}
          className="w-20 px-3 py-1 h-8 text-sm [&::-webkit-inner-spin-button]:opacity-100 [&::-webkit-outer-spin-button]:opacity-100"
        />

        <Label htmlFor="semester" className="hidden md:block">
          학기
        </Label>
        <Select
          value={semester}
          onValueChange={(value) => {
            const parsed = SemesterFilterSchema.safeParse(value);
            if (parsed.success) {
              setSemester(parsed.data);
              setPage(null);
            }
          }}
        >
          <SelectTrigger size="sm">
            <SelectValue placeholder={defaultSemester} />
          </SelectTrigger>
          <SelectContent>
            {Object.values(Semester).map((sem) => (
              <SelectItem key={sem} value={sem}>
                {sem}
              </SelectItem>
            ))}
            <SelectItem key={SEMESTER_FILTER_ALL} value={SEMESTER_FILTER_ALL}>
              전체
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 필터 대상: 상태 */}
      {/* PC : TAP 방식 */}
      <div className="flex-1 max-sm:hidden h-10 *:cursor-pointer items-center border-b-[1px] *:border-black border-b-black flex">
        <TabTrigger
          active={filter === STATUS_FILTER_ALL}
          onClick={() => changeStatus(STATUS_FILTER_ALL)}
        >
          전체
        </TabTrigger>

        <TabTrigger
          active={filter === ProjectStatus.RECRUITING}
          onClick={() => changeStatus(ProjectStatus.RECRUITING)}
        >
          모집중
        </TabTrigger>

        <TabTrigger
          active={filter === ProjectStatus.CLOSED}
          onClick={() => changeStatus(ProjectStatus.CLOSED)}
        >
          모집완료
        </TabTrigger>
      </div>

      {/* 모바일 : SELECT 방식 */}
      <div className="min-sm:hidden flex gap-x-1">
        <Label htmlFor="status">상태</Label>
        <Select
          value={filter}
          onValueChange={(value) => {
            const parsed = StatusFilterSchema.safeParse(value);
            if (parsed.success) changeStatus(parsed.data);
          }}
        >
          <SelectTrigger className="w-[110px]">
            <SelectValue placeholder="전체" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={STATUS_FILTER_ALL}>전체</SelectItem>
            <SelectItem value={ProjectStatus.RECRUITING}>모집중</SelectItem>
            <SelectItem value={ProjectStatus.CLOSED}>모집완료</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Filter;
