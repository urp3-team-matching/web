import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="w-full h-full relative">
      <Input
        className="w-full h-full rounded-md px-11 border-[1px] border-black"
        placeholder="프로젝트 또는 연구키워드로 검색해보세요"
      />
      <Search className="absolute top-1/2 -translate-y-1/2 left-3" />
    </div>
  );
}
