"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { GetProjectsQuerySchema } from "@/types/project";
import { Search } from "lucide-react";
import Link from "next/link";
import { useQueryState } from "nuqs";
import z from "zod";

interface SearchBarProps {
  className?: string;
}

export default function SearchCreateRow({ className }: SearchBarProps) {
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
    <div className="w-full max-sm:h-22 h-11 max-sm:flex-col flex gap-3">
      <form
        className={cn(
          "relative w-full max-sm:flex-col h-full flex max-sm:gap-2 items-center gap-x-3",
          className
        )}
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const searchValue = formData.get(searchQueryKey) as string;
          handleSearch(searchValue);
        }}
      >
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
        <Search className="absolute max-sm:top-1/4 top-1/2 -translate-y-1/2 left-3" />
        <div className="flex gap-3  max-sm:w-full h-full">
          <Button
            className="max-sm:flex-1 w-24 h-full bg-third hover:bg-third/90 hover:cursor-pointer"
            type="submit"
          >
            검색
          </Button>
          <Button
            asChild
            className="max-sm:flex-1 w-24 h-full bg-secondary hover:bg-secondary/90 hover:cursor-pointer"
          >
            <Link href="/projects/create">생성</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
