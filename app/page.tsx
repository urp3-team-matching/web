import ApplyListPreview from "@/components/List/ApplyListPreview";
import { HotProjectPreviewList } from "@/components/List/HotProjectListPreview";
import { ProjectPreviewList } from "@/components/List/ProjectListPreview";

export default async function Home() {
  return (
    <div className="min-[1200px]:w-[1200px] flex-col flex w-full h-auto ">
      <div className="w-full flex mb-16 justify-between">
        <HotProjectPreviewList />
        <ProjectPreviewList />
      </div>
      <ApplyListPreview />
    </div>
  );
}
