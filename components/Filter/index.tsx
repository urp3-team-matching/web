"use client";

import { useState } from "react";

const Filter = () => {
  const [chosenFilter, setChosenFilter] = useState<
    "all" | "recruiting" | "closed"
  >("all");
  return (
    <div className="w-full h-10 *:cursor-pointer *:border-b-black *:justify-center *:items-center *:flex border-b-[1px] border-b-black flex">
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
  );
};

export default Filter;
