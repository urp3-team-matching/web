"use client";

import useUser from "@/hooks/use-user";
import { cn } from "@/lib/utils";
import { GetProjectsQuerySchema } from "@/types/project";
import { PencilIcon } from "lucide-react";
import Link from "next/link";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { z } from "zod";
import { Button } from "../ui/button";

enum Sort {
  LATEST = "createdDatetime",
  POPULAR = "viewCount",
}

const ProjectSort = () => {
  const user = useUser();

  const [sort, setSort] = useQueryState(
    "sortBy" as keyof z.infer<typeof GetProjectsQuerySchema>,
    parseAsStringEnum<Sort>(Object.values(Sort))
  );

  return (
    <div className="sm:justify-between flex *:cursor-pointer text-[14px] items-baseline">
      <div className="flex gap-4 pl-2">
        <button
          className={cn(
            "cursor-pointer",
            sort === Sort.LATEST && "text-secondary"
          )}
          onClick={() => setSort(Sort.LATEST)}
        >
          • 최신순
        </button>
        <button
          className={cn(
            "cursor-pointer",
            sort === Sort.POPULAR && "text-secondary"
          )}
          onClick={() => setSort(Sort.POPULAR)}
        >
          • 인기순
        </button>
      </div>

      <div className="flex gap-2 items-center">
        <Button
          asChild
          className="hidden sm:flex w-full h-10 sm:w-50 sm:h-full bg-green-400 hover:bg-green-500 hover:cursor-pointer"
        >
          <Link href="/projects/create">
            <PencilIcon size={24} />
            글쓰기
          </Link>
        </Button>
        {user && (
          <Button
            asChild
            className="w-32 h-10 hidden sm:flex sm:w-50 sm:h-full bg-green-400 hover:bg-green-500 hover:cursor-pointer"
          >
            <Link href="/posts/create">
              <PencilIcon size={24} />
              공지사항 추가
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProjectSort;
