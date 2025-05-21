"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useQueryState } from "nuqs";

export default function SearchBar() {
  const [search, setSearch] = useQueryState("search");

  return (
    <form className="w-full h-full relative">
      <Input
        className="w-full h-full rounded-md px-11 border-[1px] border-black"
        placeholder="프로젝트 또는 연구키워드로 검색해보세요"
        defaultValue={search || ""}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            setSearch(e.currentTarget.value);
          }
        }}
      />
      <Search className="absolute top-1/2 -translate-y-1/2 left-3" />
    </form>
  );
}
