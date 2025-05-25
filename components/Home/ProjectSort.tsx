"use client";

import { GetProjectsQuerySchema } from "@/types/project";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { z } from "zod";

enum Sort {
  LATEST = "createdDatetime",
  POPULAR = "viewCount",
}

const ProjectSort = () => {
  const [sort, setSort] = useQueryState(
    "sortBy" as keyof z.infer<typeof GetProjectsQuerySchema>,
    parseAsStringEnum<Sort>(Object.values(Sort))
  );

  return (
    <div className="flex max-sm:hidden *:cursor-pointer text-[14px] gap-4">
      <button
        className={sort === Sort.LATEST ? "text-secondary" : ""}
        onClick={() => setSort(Sort.LATEST)}
      >
        • 최신순
      </button>
      <button
        className={sort === Sort.POPULAR ? "text-secondary" : ""}
        onClick={() => setSort(Sort.POPULAR)}
      >
        • 인기순
      </button>
    </div>
  );
};

export default ProjectSort;
