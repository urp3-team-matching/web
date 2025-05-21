import Link from "next/link";
import { Button } from "../ui/button";
import SearchBar from "./SearchBar";

export default function SearchCreateRow() {
  return (
    <div className="w-full h-11 flex gap-3">
      <SearchBar className="flex-1" />

      <Button
        asChild
        className="w-24 h-full bg-secondary hover:bg-secondary/90 hover:cursor-pointer"
      >
        <Link href="/projects/create">생성</Link>
      </Button>
    </div>
  );
}
