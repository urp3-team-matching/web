import Filter from "@/components/Filter";
import ProjectList from "@/components/Home/ProjectList";
import ProjectSort from "@/components/Home/ProjectSort";
import SearchCreateRow from "@/components/Home/SearchCreateRow";
import Spinner from "@/components/ui/spinner";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={<Spinner />}>
      <div className="mt-5 flex-col flex w-full h-auto gap-3 sm:gap-5 justify-between">
        {/* 안내문구 */}
        <p className="text-sm sm:text-base text-slate-500">
          다양한 전공의 만남, 새로운 프로젝트의 시작!
          <br />
          융합연구학점제 팀원을 모집해보세요.
        </p>

        <Filter />

        <SearchCreateRow />

        <ProjectSort />

        <ProjectList />
      </div>
    </Suspense>
  );
}
