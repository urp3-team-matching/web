import { ProjectList } from "@/components/ProjectList";

export default async function Home() {
  return (
    <div className="min-[1200px]:w-[1200px] flex-col flex w-full h-auto ">
      <div className="w-full flex  justify-between">
        <ProjectList />
      </div>
    </div>
  );
}
