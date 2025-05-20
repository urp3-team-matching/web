import Filter from "@/components/Filter";
import { ProjectList } from "@/components/Home/ProjectList";
import SearchCreateRow from "@/components/Home/SearchCreateRow";

export default function Home() {
  return (
    <div className={`pageWidth px-5 pt-3 flex-col flex w-full h-auto`}>
      <div className="w-full flex flex-col  gap-5 mt-5 justify-between">
        <Filter />

        <SearchCreateRow />
        <div className="flex *:cursor-pointer text-[14px] gap-4">
          <span>• 최신순</span>
          <span>• 인기순</span>
        </div>

        <ProjectList />
      </div>
    </div>
  );
}
