import Filter from "@/components/Filter";
import ProjectList from "@/components/Home/ProjectList";
import ProjectSort from "@/components/Home/ProjectSort";
import SearchCreateRow from "@/components/Home/SearchCreateRow";
import Spinner from "@/components/ui/spinner";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={<Spinner />}>
      <div className="mt-5 flex-col flex w-full h-auto gap-5 justify-between">
        <Filter />

        <SearchCreateRow />

        <ProjectSort />

        <ProjectList />
      </div>
    </Suspense>
  );
}
