import { ApplyStatueMenubar } from "@/components/Home/ApplyStatueMenubar";
import { ProjectList } from "@/components/Home/ProjectList";
import SearchCreateRow from "@/components/Home/SearchCreateRow";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const pageNum = 5;

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
      <Pagination className="my-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>

          {[...Array(pageNum)].map((_, index) => {
            return (
              <PaginationItem key={index}>
                <PaginationLink href="#">{index + 1}</PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
