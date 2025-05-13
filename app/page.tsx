"use client";
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

import { useState } from "react";

const pageNum = 5;

export default function Home() {
  const [chosenFilter, setChosenFilter] = useState<
    "all" | "recruiting" | "closed"
  >("all");
  return (
    <div className={`pageWidth px-5 flex-col flex w-full h-auto`}>
      <div className="w-full flex flex-col  gap-5 mt-5 justify-between">
        <div className="w-full h-10 *:cursor-pointer *:border-b-black *:justify-center *:items-center *:flex border-b-[1px] border-b-black  flex ">
          <div
            className={`w-[60px] h-[40px] ${
              chosenFilter == "all" ? "border-b-[3px]" : ""
            } `}
            onClick={() => setChosenFilter("all")}
          >
            전체
          </div>
          <div
            className={`w-[64px] h-[40px]  ${
              chosenFilter == "recruiting" ? "border-b-[3px]" : ""
            } `}
            onClick={() => setChosenFilter("recruiting")}
          >
            모집중
          </div>
          <div
            className={`w-[72px] h-[40px] ${
              chosenFilter == "closed" ? "border-b-[3px]" : ""
            } `}
            onClick={() => setChosenFilter("closed")}
          >
            모집마감
          </div>
        </div>
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
