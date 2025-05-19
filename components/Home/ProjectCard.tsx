import ProposalBadge from "@/components/Badge/ProposalBadge";
import { PublicProjectWithForeignKeys } from "@/lib/apiClientHelper";
import { ProposerType } from "@prisma/client";
import { Calendar, Eye } from "lucide-react";
import KeywordBadge from "../Badge/KeywordBadge";

export interface ProjectCardProps {
  project: PublicProjectWithForeignKeys;
  className?: string;
}

export default function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <div
      id={project.id.toString()}
      className={`${className} w-full border-[1px] h-[126px] my-[1px] py-[10px] px-[17px] shadow-[0px_4px_4px_0px_rgba(174,174,174,0.25)] bg-white rounded-[6px]`}
    >
      <div className="flex flex-col gap-2 justify-between h-full pt-1">
        <div className="flex gap-[10px]">
          {/* TODO: status 계산 로직 추가 */}
          {/* <ApplyStatueBadge status={status} /> */}
          <ProposalBadge proposerType={project.proposer.type as ProposerType} />
        </div>
        <span className="text-base font-medium pl-1 py-[1px]">
          {project.name}
        </span>
        <div className="flex gap-1 my-[2px]">
          {project.keywords.map((keyword, index) => (
            <KeywordBadge key={index} keyword={keyword} />
          ))}
        </div>
        <div className="gap-3 flex  font-medium text-xs">
          <span className="text-slate-500 flex items-center">
            {project.name}
          </span>
          <div className="flex items-center gap-1">
            <Eye className="size-5 mt-0.5" />
            <span>{project.viewCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="size-5 mt-0.5" />
            <span>{project.createdDatetime}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
