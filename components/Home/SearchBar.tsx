"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useQueryState } from "nuqs";

interface SearchBarProps {
  className?: string;
}

export default function SearchBar({ className }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useQueryState("search");

  const handleSearch = (value: string) => {
    if (!value || value.trim() === "") {
      setSearchQuery(null);
    } else {
      setSearchQuery(value);
    }
  };

  return (
    <form
      className={cn("relative flex items-center gap-x-3", className)}
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const searchValue = formData.get("search") as string;
        handleSearch(searchValue);
      }}
    >
      <Input
        name="search"
        className="w-full h-full rounded-md px-11 border-[1px] border-black"
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
        className="w-24 h-full bg-third hover:bg-third/90 hover:cursor-pointer"
        type="submit"
      >
        검색
      </Button>
    </form>
  );
}
