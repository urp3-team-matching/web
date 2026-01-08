import Filter from "@/components/Filter";
import ProjectList from "@/components/Home/ProjectList";
import ProjectSort from "@/components/Home/ProjectSort";
import SearchRow from "@/components/Home/SearchRow";
import Spinner from "@/components/ui/spinner";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={<Spinner className="w-full py-5" />}>
      <div className="mt-5 flex-col flex w-full h-auto gap-3 justify-between">
        {/* 안내문구 */}
        <p className="text-sm sm:text-base text-slate-500">
          융합연구학점제 팀모집 홈페이지를 통해 융합연구학점제 팀원을 모집해보세요.(아래 공지사항 확인 필수)
          <br />
          ※ 이 홈페이지는 2025학년도 1학기 융합연구학점제 수행팀 김장순팀과 성균융합원행정실이 협업하여 제작하였습니다.
        </p>

        <Filter />

        <SearchRow />

        <ProjectSort />

        <ProjectList />
      </div>
    </Suspense>
  );
}
