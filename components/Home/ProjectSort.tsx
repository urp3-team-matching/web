"use client";

import { GetProjectsQuerySchema } from "@/types/project";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { z } from "zod";
import { Button } from "../ui/button";
import Link from "next/link";
import { PencilIcon } from "lucide-react";

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
    <div className="sm:flex sm:justify-between hidden *:cursor-pointer text-[14px] ">
      <div className="flex gap-4">
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
      <Button
        asChild
        className="w-full h-10 sm:w-50 sm:h-full bg-green-400 hover:bg-green-500 hover:cursor-pointer"
      >
        <Link href="/projects/create">
          <PencilIcon size={24} />
          글쓰기
        </Link>
      </Button>
    </div>
  );
};

export default ProjectSort;
