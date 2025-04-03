import ProjectCard from "../Card/ProjectCard";
import SectionLable from "../SectionLable";
import ShowMoreButton from "../ShowMoreButton";

export function ProjectPreviewList() {
  return (
    <div className="w-[690px] h-auto">
      <SectionLable title="주제" />
      <div className="w-full h-auto flex gap-2 flex-col">
        {[...Array(4)].map((_, i) => (
          <ProjectCard
            key={i}
            title="모빌리티/로봇 메타버스 디지털트윈 기반 고장관리 인공지능 에이전트"
            name="김훈모"
            view={1003}
            date={new Date("2025-03-06")}
            proposer="admin"
          />
        ))}
      </div>
      <ShowMoreButton href="/projects" />
    </div>
  );
}
