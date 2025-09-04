"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { GetProjectsQuerySchema } from "@/types/project";
import { PencilIcon, Search } from "lucide-react";
import Link from "next/link";
import { useQueryState } from "nuqs";
import z from "zod";

interface SearchBarProps {
  className?: string;
}

export default function SearchRow({ className }: SearchBarProps) {
  const searchQueryKey = "searchTerm" as keyof z.infer<
    typeof GetProjectsQuerySchema
  >;
  const [searchQuery, setSearchQuery] = useQueryState(searchQueryKey);

  const handleSearch = (value: string) => {
    if (!value || value.trim() === "") {
      setSearchQuery(null);
    } else {
      setSearchQuery(value);
    }
  };

  return (
    <div className="w-full h-24 sm:h-11 flex-col sm:flex-row flex gap-3">
      <form
        className={cn(
          "relative w-full sm:flex-row flex-col h-full flex items-center gap-3",
          className
        )}
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const searchValue = formData.get(searchQueryKey) as string;
          handleSearch(searchValue);
        }}
      >
        <Button
          asChild
          className="w-full h-10 sm:hidden sm:w-50 sm:h-full bg-green-400 hover:bg-green-500 hover:cursor-pointer"
        >
          <Link href="/projects/create">
            <PencilIcon size={24} />
            글쓰기
          </Link>
        </Button>
        <div className="relative flex gap-3 w-full sm:flex-1 h-full">
          <Input
            name="search"
            className="w-full text-sm h-full rounded-md px-11 border-[1px] border-black"
            placeholder="프로젝트 또는 연구키워드로 검색해보세요"
            defaultValue={searchQuery || ""}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch(e.currentTarget.value);
              }
            }}
          />
          <Search className="absolute top-1/2 -translate-y-1/2 left-3" />
          <Button
            className="w-16 sm:w-24 h-full bg-third hover:bg-third/90 hover:cursor-pointer"
            type="submit"
          >
            검색
          </Button>
        </div>
      </form>
    </div>
  );
}
