import { ApplyStatueMenubar } from "@/components/Home/ApplyStatueMenubar";
import { ProjectList } from "@/components/Home/ProjectList";
import SearchCreateRow from "@/components/Home/SearchCreateRow";

export default async function Home() {
  return (
    <div className="min-[1040px]:w-[1040px] px-5 flex-col flex w-full h-auto ">
      <div className="w-full flex flex-col gap-5 mt-5 justify-between">
        <ApplyStatueMenubar />
        <SearchCreateRow />
        <div className="flex *:cursor-pointer text-[12px] gap-4">
          <span>• 최신순</span>
          <span>• 인기순</span>
        </div>
        <ProjectList />
      </div>
    </div>
  );
}
