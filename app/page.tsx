import Filter from "@/components/Filter";
import ProjectList from "@/components/Home/ProjectList";
import ProjectSort from "@/components/Home/ProjectSort";
import SearchCreateRow from "@/components/Home/SearchCreateRow";

export default function Home() {
  return (
    <div className="pageWidth px-5 pt-3 flex-col flex w-full h-auto gap-5 mt-5 justify-between">
      <Filter />

      <SearchCreateRow />

      <ProjectSort />

      <ProjectList />
    </div>
  );
}
