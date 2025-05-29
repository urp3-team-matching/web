"use client";

import TabTrigger from "@/components/Filter/TabTrigger";
import { GetProjectsQuerySchema } from "@/types/project";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { z } from "zod";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

enum ProjectFilter {
  RECRUITING = "recruiting",
  CLOSED = "closed",
}

const Filter = () => {
  const [filter, setFilter] = useQueryState(
    "recruiting" as keyof z.infer<typeof GetProjectsQuerySchema>,
    parseAsStringEnum<ProjectFilter>(Object.values(ProjectFilter))
  );

  return (
    <>
      {/* PC : TAP 방식 */}
      <div className="w-full max-sm:hidden h-10 *:cursor-pointer items-center border-b-[1px] *:border-black border-b-black flex">
        <TabTrigger active={filter === null} onClick={() => setFilter(null)}>
          전체
        </TabTrigger>

        <TabTrigger
          active={filter === ProjectFilter.RECRUITING}
          onClick={() => setFilter(ProjectFilter.RECRUITING)}
        >
          모집중
        </TabTrigger>

        <TabTrigger
          active={filter === ProjectFilter.CLOSED}
          onClick={() => setFilter(ProjectFilter.CLOSED)}
        >
          모집마감
        </TabTrigger>
      </div>
      {/* 모바일 : SELECT 방식 */}
      <div className="w-full h-full min-sm:hidden">
        <Select
          value={filter ?? "all"} // null이면 all로 보여줌
          onValueChange={(value) => {
            if (value === "all") setFilter(null);
            else setFilter(value as ProjectFilter);
          }}
        >
          <SelectTrigger className="w-[110px]">
            <SelectValue placeholder="전체" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value={ProjectFilter.RECRUITING}>모집중</SelectItem>
            <SelectItem value={ProjectFilter.CLOSED}>모집마감</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default Filter;
