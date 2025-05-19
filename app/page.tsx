"use client";
import SearchCreateRow from "@/components/Home/SearchCreateRow";
import CustomPagination from "@/components/Pagination";

import { useState } from "react";

const pageNum = 5;

export default function Home() {
  const [chosenFilter, setChosenFilter] = useState<
    "all" | "recruiting" | "closed"
  >("all");
  return (
    <div className={`pageWidth px-5 pt-3 flex-col flex w-full h-auto`}>
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
        <div className="flex *:cursor-pointer text-[14px] gap-4">
          <span>• 최신순</span>
          <span>• 인기순</span>
        </div>
        {/* <ProjectList /> */}
      </div>

      <CustomPagination totalPages={pageNum} />
    </div>
  );
}
