"use client";

import { parseAsStringEnum, useQueryState } from "nuqs";

enum Sort {
  LATEST = "latest",
  POPULAR = "popular",
}

const ProjectSort = () => {
  const [sort, setSort] = useQueryState(
    "sort",
    parseAsStringEnum<Sort>(Object.values(Sort))
  );

  return (
    <div className="flex *:cursor-pointer text-[14px] gap-4">
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
