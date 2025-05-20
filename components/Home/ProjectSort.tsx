"use client";

import { parseAsStringEnum, useQueryState } from "nuqs";

enum Sort {
  latest = "latest",
  popular = "popular",
}

const ProjectSort = () => {
  const [sort, setSort] = useQueryState(
    "sort",
    parseAsStringEnum<Sort>(Object.values(Sort))
  );

  return (
    <div className="flex *:cursor-pointer text-[14px] gap-4">
      <button
        className={sort === Sort.latest ? "text-secondary-100" : ""}
        onClick={() => setSort(Sort.latest)}
      >
        • 최신순
      </button>
      <button
        className={sort === Sort.popular ? "text-secondary-100" : ""}
        onClick={() => setSort(Sort.popular)}
      >
        • 인기순
      </button>
    </div>
  );
};

export default ProjectSort;
