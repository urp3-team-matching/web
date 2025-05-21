import Link from "next/link";
import { Button } from "../ui/button";
import SearchBar from "./SearchBar";

export default function SearchCreateRow() {
  return (
    <div className="w-full h-11  flex gap-3">
      <SearchBar />

      <div className="flex gap-3">
        <Button className="w-24 h-full bg-third hover:cursor-pointer">
          검색
        </Button>
        <Link href="/projects/create">
          <Button className="w-24 h-full bg-secondary hover:cursor-pointer">
            생성
          </Button>
        </Link>
      </div>
    </div>
  );
}
