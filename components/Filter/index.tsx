"use client";

import TabTrigger from "@/components/Filter/TabTrigger";
import { parseAsStringEnum, useQueryState } from "nuqs";

enum ProjectFilter {
  ALL = "all",
  RECRUITING = "recruiting",
  CLOSED = "closed",
}

const Filter = () => {
  const [filter, setFilter] = useQueryState(
    "filter",
    parseAsStringEnum<ProjectFilter>(Object.values(ProjectFilter))
  );

  return (
    <div className="w-full h-10 *:cursor-pointer items-center border-b-[1px] *:border-black border-b-black flex">
      <TabTrigger
        active={filter === ProjectFilter.ALL}
        onClick={() => setFilter(ProjectFilter.ALL)}
      >
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
  );
};

export default Filter;
