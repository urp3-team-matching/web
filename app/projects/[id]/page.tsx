import ProjectHeader from "@/components/Project/ProjectHeader";
import { fakeProjects, ProjectType } from "@/constants/fakeProject";

export default function Project({ params }: { params: { id: string } }) {
  const project = fakeProjects.find((project) => project.id === params.id);

  return (
    <div className="min-[1040px]:w-[1040px] pt-12 px-5 flex-col flex w-full h-auto ">
      <ProjectHeader project={project as ProjectType} />
    </div>
  );
}
