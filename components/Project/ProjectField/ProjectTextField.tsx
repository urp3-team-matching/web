import { ProjectType } from "@/constants/fakeProject";
import ProjectTextArea from "./ProjectTextArea";

interface ProjectTextFeildProps {
  project: ProjectType;
}

export default function ProjectTextField({ project }: ProjectTextFeildProps) {
  return (
    <div className="w-[690px] h-full mt-12 flex flex-col gap-5">
      <ProjectTextArea
        title="프로젝트 소개"
        text={project.introduction}
      ></ProjectTextArea>
      <ProjectTextArea
        title="프로젝트 추진배경"
        text={project.background}
      ></ProjectTextArea>
      <ProjectTextArea
        title="프로젝트 실행방법"
        text={project.methodology}
      ></ProjectTextArea>
      <ProjectTextArea
        title="프로젝트 목표"
        text={project.goal}
      ></ProjectTextArea>
      <ProjectTextArea
        title="프로젝트 기대효과"
        text={project.expectation}
      ></ProjectTextArea>
    </div>
  );
}
