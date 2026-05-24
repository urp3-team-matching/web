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
  GetProjectsQuerySchema,
  Semester,
  STATUS_FILTER_ALL,
  StatusFilter,
  StatusFilterSchema,
} from "@/types/project";


const STATUS_FILTER_VALUES: StatusFilter[] = [
  ...Object.values(ProjectStatus),
  STATUS_FILTER_ALL,
];

const Filter = () => {
  const [filter, setFilter] = useQueryState(
    "status" as keyof z.infer<typeof GetProjectsQuerySchema>,
    parseAsStringEnum<StatusFilter>(STATUS_FILTER_VALUES).withDefault(
      ProjectStatus.RECRUITING
    )
  );

  const currentYear = new Date().getFullYear();

  const [year, setYear] = useQueryState<number>(
    "year",
    parseAsInteger.withDefault(currentYear)
  );
  const [semester, setSemester] = useQueryState<Semester>(
    "semester",
    parseAsStringEnum<Semester>(Object.values(Semester))
  );

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
          onChange={(e) => setYear(e.target.valueAsNumber)}
          className="w-16 px-2 py-1 h-8 text-sm"
        />

        <Label htmlFor="semester" className="hidden md:block">
          학기
        </Label>
        <Select
          value={semester ?? "전체"}
          onValueChange={(value) => {
            if (value === "전체") setSemester(null);
            else setSemester(value as Semester);
          }}
        >
          <SelectTrigger size="sm">
            <SelectValue placeholder={Semester.FIRST} />
          </SelectTrigger>
          <SelectContent>
            {Object.values(Semester).map((sem) => (
              <SelectItem key={sem} value={sem}>
                {sem}
              </SelectItem>
            ))}
            <SelectItem key={null} value="전체">
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
          onClick={() => setFilter(STATUS_FILTER_ALL)}
        >
          전체
        </TabTrigger>

        <TabTrigger
          active={filter === ProjectStatus.RECRUITING}
          onClick={() => setFilter(ProjectStatus.RECRUITING)}
        >
          모집중
        </TabTrigger>

        <TabTrigger
          active={filter === ProjectStatus.CLOSED}
          onClick={() => setFilter(ProjectStatus.CLOSED)}
        >
          모집마감
        </TabTrigger>
      </div>

      {/* 모바일 : SELECT 방식 */}
      <div className="min-sm:hidden flex gap-x-1">
        <Label htmlFor="status">상태</Label>
        <Select
          value={filter}
          onValueChange={(value) => {
            const parsed = StatusFilterSchema.safeParse(value);
            if (parsed.success) setFilter(parsed.data);
          }}
        >
          <SelectTrigger className="w-[110px]">
            <SelectValue placeholder="모집중" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={STATUS_FILTER_ALL}>전체</SelectItem>
            <SelectItem value={ProjectStatus.RECRUITING}>모집중</SelectItem>
            <SelectItem value={ProjectStatus.CLOSED}>모집마감</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Filter;
