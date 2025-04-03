// 제안자(교수, 학생, 관리자), 제목, 이름, 날짜, 조회수를 fetch 해야 함

import { Calendar, Eye } from "lucide-react";
import ProposalBadge from "../Badge/ProposalBadge";
import { ProjectCardProps } from "./ProjectCard";

export default function HotProjectCard({
  id,
  proposer,
  title,
  name,
  date,
  view,
  className,
}: ProjectCardProps) {
  return (
    <div
      id={id}
      className={`${className} w-60 border-2 h-60 p-5 bg-white shadow-lg rounded-md`}
    >
      <div className="flex flex-col justify-between w-full h-full gap-1">
        <ProposalBadge proposer={proposer} />
        <span className="text-base font-medium">{title}</span>
        <div className="gap-3 flex  font-medium text-xs">
          <span className="text-slate-500 flex items-center">{name}</span>
          <div className="flex items-center gap-1">
            <Eye className="size-5 mt-0.5" />
            <span>{view}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="size-5 mt-0.5" />
            <span>{date.toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
