import MajorGraph from "@/components/Project/ProjectField/MajorGraph";
import ProjectTextField from "@/components/Project/ProjectField/ProjectTextField";
import ProjectHeader from "@/components/Project/ProjectHeader";
import { fakeProjects, ProjectType } from "@/constants/fakeProject";

export default function Project({ params }: { params: { id: string } }) {
  const project = fakeProjects.find((project) => project.id === params.id);

  return (
    <div className="min-[1040px]:w-[1040px] mt-12 px-5 flex-col flex w-full h-auto ">
      <ProjectHeader project={project as ProjectType} />
      <div className="w-full flex h-96 justify-between ">
        <ProjectTextField project={project as ProjectType} />

        <div className="w-[280px] h-full mt-12">
          <MajorGraph project={project as ProjectType}></MajorGraph>
        </div>
      </div>
    </div>
  );
}
