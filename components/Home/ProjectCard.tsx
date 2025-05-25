import ApplyStatueBadge from "@/components/Badge/ApplyStatueBadge";
import ProposalBadge from "@/components/Badge/ProposalBadge";
import { PublicProjectWithForeignKeys } from "@/lib/apiClientHelper";
import { cn, getProjectStatus, parseDate } from "@/lib/utils";
import { Calendar, Eye } from "lucide-react";
import KeywordBadge from "../Badge/KeywordBadge";

export interface ProjectCardProps {
  project: PublicProjectWithForeignKeys;
  className?: string;
}

export default function ProjectCard({ project, className }: ProjectCardProps) {
  const projectStatus = getProjectStatus(project);

  return (
    <div
      className={cn(
        "w-full border-t-[1px]  py-2.5 px-4.5  bg-white  hover:bg-slate-50 transition-colors duration-200 ease-in-out",
        className
      )}
    >
      <div className="flex flex-col gap-2 justify-between h-full pt-1">
        {/* 헤더: 상태, 제안 타입 */}
        <div className="flex gap-[10px]">
          <ApplyStatueBadge status={projectStatus} />
          <ProposalBadge proposerType={project.proposerType} />
        </div>

        {/* 제목 */}
        <span className="text-base font-medium pl-1 py-[1px]">
          {project.name}
        </span>

        {/* 하단: 조회수, 생성일, 키워드 */}
        <div className="gap-3 flex  font-medium text-xs">
          {/* 조회수 */}
          <div className="flex items-center gap-1">
            <Eye className="size-5 mt-0.5" />
            <span>{project.viewCount}</span>
          </div>

          {/* 생성일 */}
          <div className="flex items-center gap-1">
            <Calendar className="size-5 mt-0.5" />
            <span>{parseDate(project.createdDatetime)}</span>
          </div>

          {/*키워드*/}
          <div className="flex gap-1 my-[2px]">
            {project.keywords.map((keyword, index) => (
              <KeywordBadge key={index} keyword={keyword} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
